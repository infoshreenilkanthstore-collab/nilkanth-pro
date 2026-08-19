import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Enquiry from '@/models/Enquiry';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { firstName, lastName, phone, email, message } = body;

    // Simple validation
    if (!firstName || !lastName || !phone || !email || !message) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    const newEnquiry = await Enquiry.create({
      firstName,
      lastName,
      phone,
      email,
      message
    });

    return NextResponse.json({
      success: true,
      message: 'Your enquiry has been submitted successfully!',
      data: newEnquiry
    });

  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
