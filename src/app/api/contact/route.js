import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    const firstName = body.first_name || body.firstName || '';
    const lastName = body.last_name || body.lastName || '';
    const mobile = body.mobile || body.phone || '';
    const email = body.email || '';
    const message = body.message || '';

    // Validation
    if (!firstName || !lastName || !mobile || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.SHOPFRONT_API_URL || 'https://megaecomm.megascale.co.in/backend';
    const token = process.env.SHOPFRONT_TOKEN || process.env.NEXT_PUBLIC_SHOPFRONT_TOKEN;

    const response = await fetch(`${baseUrl}/api/shop/enquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopfront-Token': token || ''
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        mobile: mobile,
        email: email,
        message: message
      })
    });

    const contentType = response.headers.get('content-type');
    let data = {};
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text };
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || 'Failed to submit enquiry'
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || 'Your enquiry has been submitted successfully!',
      data
    });

  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
