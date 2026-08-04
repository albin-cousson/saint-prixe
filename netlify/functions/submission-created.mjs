import nodemailer from 'nodemailer';

// Reads the current contact email live from Sanity so it always matches
// Réglages du site → Email de contact, without needing a redeploy.
async function getContactEmail() {
  const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
  const query = encodeURIComponent('*[_type == "siteSettings"][0].email');
  const url = `https://${projectId}.apicdn.sanity.io/v2024-01-01/data/query/${dataset}?query=${query}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    return json.result || process.env.GMAIL_USER;
  } catch {
    return process.env.GMAIL_USER;
  }
}

export async function handler(event) {
  try {
    const { payload } = JSON.parse(event.body);
    if (payload?.form_name !== 'contact') {
      return { statusCode: 200, body: 'ignored' };
    }

    const { name, email, message } = payload.data;
    const to = await getContactEmail();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      replyTo: email,
      subject: `Message de ${name} — via le site`,
      text: `${message}\n\nRépondre à : ${email}`,
    });

    return { statusCode: 200, body: 'sent' };
  } catch (err) {
    console.error('submission-created error:', err);
    return { statusCode: 500, body: 'error' };
  }
}
