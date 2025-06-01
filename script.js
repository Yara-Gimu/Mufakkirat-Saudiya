// بيانات المشاريع
let projects = [];

// عناصر DOM
const themeToggle = document.getElementById('theme-toggle');
const projectsContainer = document.getElementById('projects-container');
const yearFilter = document.getElementById('year');
const departmentFilter = document.getElementById('department');
const fieldFilter = document.getElementById('field');
const applyFiltersBtn = document.getElementById('apply-filters');
const resultsCountElement = document.getElementById('results-count');

// عناصر النافذة المنبثقة لسياسة الخصوصية
const privacyModal = document.getElementById('privacy-modal');
const privacyLink = document.getElementById('privacy-link');
const closeModal = document.querySelector('.close-modal');
const acceptBtn = document.querySelector('.accept-btn');

// دالة لإنشاء قائمة السنوات
function generateYearOptions() {
    const currentYear = new Date().getFullYear();
    const startYear = 2020;
    const yearSelect = document.getElementById('year');
    
    yearSelect.innerHTML = '<option value="all">الكل</option>';
    
    for (let year = currentYear; year >= startYear; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

// تبديل الوضع المظلم
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i><span>وضع ليلي</span>';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i><span>وضع النهار</span>';
    }
});

// دالة لاستخراج معرف الملف من رابط جوجل درايف
function getGoogleDriveFileId(url) {
    if (!url) return null;
    
    // لروابط النمط الجديد
    let match = url.match(/\/file\/d\/([^\/]+)/);
    if (match) return match[1];
    
    // لروابط النمط القديم
    match = url.match(/id=([^&]+)/);
    if (match) return match[1];
    
    // إذا كان الرابط يحتوي على المعرف مباشرة
    match = url.match(/[-\w]{25,}/);
    return match ? match[0] : null;
}

// دالة لجلب البيانات
async function fetchProjects() {
    try {
        projectsContainer.innerHTML = '<div class="loading">جاري تحميل المشاريع...</div>';
        
        // هنا يمكنك استخدام رابط API الحقيقي أو البيانات المباشرة
        const API_URL = 'https://sheetdb.io/api/v1/rpqob6xane66i';
        const response = await fetch(API_URL);
        const data = await response.json();
        
        console.log('بيانات الجدول المستلمة:', data);
        
        if (!data || data.length === 0) {
            throw new Error('لا توجد بيانات في الجدول');
        }
        
        projects = data;
        displayProjects(projects);
        updateResultsCount(projects.length);
        
    } catch (error) {
        console.error('Error:', error);
        projectsContainer.innerHTML = `
            <div class="error">
                ${error.message}
                <button onclick="fetchProjects()">إعادة المحاولة</button>
            </div>
        `;
    }
}

// دالة لتحديث عدد النتائج
function updateResultsCount(count) {
    resultsCountElement.textContent = count;
}

// دالة لعرض المشاريع
function displayProjects(projectsToDisplay) {
    projectsContainer.innerHTML = '';
    
    if (!projectsToDisplay || projectsToDisplay.length === 0) {
        projectsContainer.innerHTML = '<div class="no-projects">لا توجد مشاريع مطابقة للبحث</div>';
        updateResultsCount(0);
        return;
    }
    
    projectsToDisplay.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        // استخراج القيم حسب الأسماء الفعلية في البيانات
        const projectName = project['عنوان المشروع'] || 'بدون عنوان';
        const description = project['وصف المشروع '] || '';
        const year = project['السنة أو الترم '] || 'غير محدد';
        const department = project['القسم'] || 'غير محدد';
        const field = project['المجال العام للفكرة'] || 'غير محدد';
        
        projectCard.innerHTML = `
            <div class="project-card-content">
                <h3>${projectName}</h3>
                <p>${description.substring(0, 100)}${description.length > 100 ? '...' : ''}</p>
                <div class="project-meta">
                    <span>السنة: ${year}</span>
                    <span>القسم: ${department}</span>
                    <span>المجال: ${field}</span>
                </div>
            </div>
        `;
        
        projectCard.addEventListener('click', () => showProjectDetails(project));
        projectsContainer.appendChild(projectCard);
    });
    
    updateResultsCount(projectsToDisplay.length);
}

// دالة لعرض التفاصيل مع عرض الملفات المرفقة
function showProjectDetails(project) {
    const detailsModal = document.createElement('div');
    detailsModal.className = 'project-details';
    
    // معالجة روابط الملفات لعرضها مباشرة
    const posterUrl = project['بوستر المشروع '] ? 
        `https://drive.google.com/thumbnail?id=${getGoogleDriveFileId(project['بوستر المشروع '])}&sz=w1000` : null;
    
    const fileUrl = project['ملف يشرح المشروع'] ? 
        `https://drive.google.com/file/d/${getGoogleDriveFileId(project['ملف يشرح المشروع'])}/preview` : null;
    
    const videoUrl = project['رابط فديو يشرح المشروع '] ? 
        project['رابط فديو يشرح المشروع '].replace('http//', 'http://').replace('https//', 'https://') : null;
    
    detailsModal.innerHTML = `
        <div class="details-content">
            <button class="close-details">&times;</button>
            <h2>${project['عنوان المشروع'] || 'بدون عنوان'}</h2>
            
            <div class="project-info-grid">
                <div>
                    <p><strong><i class="fas fa-calendar-alt"></i> السنة:</strong> ${project['السنة أو الترم '] || 'غير محدد'}</p>
                </div>
                <div>
                    <p><strong><i class="fas fa-graduation-cap"></i> القسم:</strong> ${project['القسم'] || 'غير محدد'}</p>
                </div>
                <div>
                    <p><strong><i class="fas fa-tags"></i> المجال:</strong> ${project['المجال العام للفكرة'] || 'غير محدد'}</p>
                </div>
            </div>
            
            <h3><i class="fas fa-align-right"></i> وصف المشروع:</h3>
            <p>${project['وصف المشروع '] || 'لا يوجد وصف'}</p>
            
            ${posterUrl ? `
                <h3><i class="fas fa-image"></i> بوستر المشروع:</h3>
                <div class="file-preview">
                    <img src="${posterUrl}" alt="بوستر المشروع" class="poster-image">
                    <a href="${project['بوستر المشروع ']}" target="_blank" class="download-link">
                        <i class="fas fa-external-link-alt"></i> فتح في نافذة جديدة
                    </a>
                </div>
            ` : ''}
            
            ${fileUrl ? `
                <h3><i class="fas fa-file-pdf"></i> ملف الشرح:</h3>
                <div class="file-preview">
                    <iframe src="${fileUrl}" class="pdf-viewer"></iframe>
                    <a href="${project['ملف يشرح المشروع']}" target="_blank" class="download-link">
                        <i class="fas fa-external-link-alt"></i> فتح في نافذة جديدة
                    </a>
                </div>
            ` : ''}
            
            ${videoUrl ? `
                <h3><i class="fas fa-video"></i> فيديو الشرح:</h3>
                <div class="video-preview">
                    ${videoUrl.includes('youtube') || videoUrl.includes('youtu.be') ? `
                        <iframe src="${videoUrl.replace('watch?v=', 'embed/')}" class="video-embed" frameborder="0" allowfullscreen></iframe>
                    ` : `
                        <video controls class="video-player">
                            <source src="${videoUrl}" type="video/mp4">
                            متصفحك لا يدعم تشغيل الفيديو
                        </video>
                    `}
                    <a href="${videoUrl}" target="_blank" class="download-link">
                        <i class="fas fa-external-link-alt"></i> فتح في نافذة جديدة
                    </a>
                </div>
            ` : ''}
            
            ${project['طريقة تواصل'] ? `
                <h3><i class="fas fa-envelope"></i> طريقة التواصل:</h3>
                <p>${project['طريقة تواصل']}</p>
            ` : ''}
        </div>
    `;
    
    document.body.appendChild(detailsModal);
    detailsModal.style.display = 'block';
    
    const closeBtn = detailsModal.querySelector('.close-details');
    closeBtn.addEventListener('click', () => {
        detailsModal.style.display = 'none';
        setTimeout(() => detailsModal.remove(), 300);
    });
}

// دالة التصفية المعدلة لتعمل مع القسم
function applyFilters() {
    const selectedYear = yearFilter.value;
    const selectedDept = departmentFilter.value;
    const selectedField = fieldFilter.value;
    
    const filteredProjects = projects.filter(project => {
        const projectYear = (project['السنة أو الترم '] || '').toString();
        const projectDept = (project['القسم'] || '').toString();
        const projectField = (project['المجال العام للفكرة'] || '').toString();
        
        // تعديل المقارنة لتكون أكثر مرونة مع القسم
        const yearMatch = selectedYear === 'all' || projectYear.includes(selectedYear);
        const deptMatch = selectedDept === 'all' || 
                         (selectedDept === 'CS' && projectDept.includes('علوم الحاسب')) ||
                         (selectedDept === 'IT' && projectDept.includes('تقنية المعلومات')) ||
                         (selectedDept === 'IS' && projectDept.includes('نظم معلومات'));
        const fieldMatch = selectedField === 'all' || projectField.includes(selectedField);
        
        return yearMatch && deptMatch && fieldMatch;
    });
    
    displayProjects(filteredProjects);
}

// أحداث الفلاتر
applyFiltersBtn.addEventListener('click', applyFilters);

// أحداث النافذة المنبثقة لسياسة الخصوصية
privacyLink.addEventListener('click', function(e) {
    e.preventDefault();
    privacyModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

closeModal.addEventListener('click', function() {
    privacyModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

acceptBtn.addEventListener('click', function() {
    privacyModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', function(e) {
    if (e.target === privacyModal) {
        privacyModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && privacyModal.style.display === 'block') {
        privacyModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// جلب البيانات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    generateYearOptions();
    fetchProjects();
});