/**
 * Cloudflare Worker — Contact Form Handler
 *
 * Receives form submissions and sends email via Resend API.
 *
 * Setup:
 * 1. Create a worker at https://dash.cloudflare.com → Workers & Pages → Create
 * 2. Paste this code
 * 3. Add environment variable: RESEND_API_KEY = your Resend API key
 * 4. Add a custom route: api.travanixlabs.com/contact → this worker
 *    (Or use the worker's default *.workers.dev URL)
 */

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders(request),
      });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405, request);
    }

    try {
      const { name, email, service, message } = await request.json();

      // Basic validation
      if (!name || !email || !message) {
        return jsonResponse({ error: 'Missing required fields' }, 400, request);
      }

      // Send email via Resend
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Travanix Labs <info@travanixlabs.com>',
          to: ['info@travanixlabs.com'],
          reply_to: email,
          subject: `New enquiry from ${name} — ${service || 'General'}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Service:</strong> ${escapeHtml(service || 'Not specified')}</p>
            <hr>
            <p><strong>Message:</strong></p>
            <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
          `,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error('Resend error:', err);
        return jsonResponse({ error: 'Failed to send email' }, 500, request);
      }

      return jsonResponse({ success: true }, 200, request);
    } catch (err) {
      console.error('Worker error:', err);
      return jsonResponse({ error: 'Internal server error' }, 500, request);
    }
  },
};

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(data, status, request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(request),
    },
  });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
