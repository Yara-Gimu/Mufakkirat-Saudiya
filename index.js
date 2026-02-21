export default {
  async fetch(request, env) {
    // 1. التعامل مع استقبال البيانات (POST) من قوقل شيت
    if (request.method === "POST") {
      try {
        const projectData = await request.json();
        const response = await fetch(`${env.APPWRITE_ENDPOINT}/databases/${env.DB_ID}/collections/${env.TABLE_ID}/documents`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': env.APPWRITE_PROJECT_ID,
            'X-Appwrite-Key': env.APPWRITE_API_KEY
          },
          body: JSON.stringify({
            documentId: 'unique()',
            data: {
              title: projectData.title,
              description: projectData.description,
              department: projectData.department,
              year: projectData.year,
              field: projectData.field,
              contact_info: projectData.contact
            }
          })
        });
        const result = await response.json();
        return new Response(JSON.stringify(result), { status: 200 });
      } catch (err) {
        return new Response(err.message, { status: 500 });
      }
    }

    // 2. عرض واجهة "مفكّرة سعودية" (GET) عند فتح الرابط
    const html = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>مكتبة مشاريع طلاب كلية الحاسبات</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
        <style>
            /* ضعي هنا محتويات ملف styles.css الخاص بكِ */
            body { font-family: 'Tajawal', sans-serif; background-color: #f4f7f6; margin: 0; }
            header { background: #2c3e50; color: white; padding: 1rem; text-align: center; }
            .hero { padding: 50px; text-align: center; background: white; }
            .cta-button { padding: 10px 20px; border-radius: 5px; text-decoration: none; color: white; margin: 5px; display: inline-block; }
            .explore-btn { background: #3498db; }
            .add-btn { background: #27ae60; }
            /* أضيفي بقية التنسيقات هنا لضمان ظهور الصفحة بشكل صحيح */
        </style>
    </head>
    <body>
        <header>
            <div class="header-content">
                <h1>مفكّرة سعودية</h1>
            </div>
        </header>
        <main>
            <section class="hero">
                <h2>استكشف مشاريع طلاب كلية الحاسبات</h2>
                <p>"مفكّرة سعودية" هي مكتبة رقمية تطوعية لتوثيق إنجازات طلاب جامعة الملك عبدالعزيز.</p>
                <div class="hero-actions">
                    <a href="#projects" class="cta-button explore-btn">استكشف المشاريع</a>
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSeh6zg_Bc-tYqq2Mtcq9WWqEAFsD0EUHsBXWJBBIWZVUotIzw/viewform" class="cta-button add-btn">أضف مشروعك</a>
                </div>
            </section>
        </main>
        <footer>
            <p>© 2025 مفكّرة سعودية. تصميم: يارا العلوي 🦋</p>
        </footer>
    </body>
    </html>
    `;

    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
};
