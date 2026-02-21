export default {
  async fetch(request, env) {
    if (request.method === "POST") {
      try {
        const projectData = await request.json();

        // إرسال البيانات إلى Appwrite Table
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
    return new Response("Send a POST request with project data!", { status: 400 });
  }
};
