// Email notification service for WageCrunch
// This would be implemented as a serverless function in production

export async function POST(request) {
  try {
    const { email, name, type = 'newsletter' } = await request.json();

    if (!email || !isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Valid email address is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Mock email service for demo purposes
    // In production, this would integrate with SendGrid, Mailchimp, etc.
    console.log('Email subscription:', { email, name, type });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 800));

    // Store email in localStorage for demo
    if (typeof window !== 'undefined') {
      const existingEmails = JSON.parse(localStorage.getItem('wagecrunch_emails') || '[]');
      existingEmails.push({
        email,
        name,
        type,
        subscribedAt: new Date().toISOString()
      });
      localStorage.setItem('wagecrunch_emails', JSON.stringify(existingEmails));
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully subscribed to updates',
        email: email
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Email API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process email subscription' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Real implementation would look like this:
/*
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(request) {
  try {
    const { email, name, type } = await request.json();

    if (!isValidEmail(email)) {
      throw new Error('Invalid email address');
    }

    // Add to SendGrid contact list
    const contactData = {
      list_ids: [process.env.SENDGRID_LIST_ID],
      contacts: [
        {
          email: email,
          first_name: name || '',
          custom_fields: {
            subscription_type: type,
            source: 'wagecrunch',
            subscribed_at: new Date().toISOString()
          }
        }
      ]
    };

    await sgMail.request({
      url: '/v3/marketing/contacts',
      method: 'PUT',
      body: contactData
    });

    // Send welcome email
    const welcomeEmail = {
      to: email,
      from: 'hello@wagecrunch.com',
      templateId: process.env.SENDGRID_WELCOME_TEMPLATE_ID,
      dynamic_template_data: {
        name: name || 'there',
        unsubscribe_url: `${process.env.APP_URL}/unsubscribe?email=${encodeURIComponent(email)}`
      }
    };

    await sgMail.send(welcomeEmail);

    return new Response(
      JSON.stringify({ success: true, message: 'Subscription successful' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('SendGrid error:', error);
    return new Response(
      JSON.stringify({ error: 'Subscription failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
*/
