import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  console.log('📝 Registration attempt started');
  
  try {
    console.log('🔌 Connecting to database...');
    await dbConnect();
    console.log('✅ Database connected successfully');
    
    // Parse JSON with comprehensive error handling
    let body;
    try {
      const contentType = request.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return NextResponse.json(
          { 
            error: 'Content-Type must be application/json',
            code: 'INVALID_CONTENT_TYPE'
          },
          { status: 400 }
        );
      }
      
      const text = await request.text();
      if (!text || text.trim() === '') {
        return NextResponse.json(
          { 
            error: 'Request body is empty',
            code: 'EMPTY_BODY'
          },
          { status: 400 }
        );
      }
      
      body = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { 
          error: 'Invalid JSON format in request body',
          code: 'INVALID_JSON',
          details: parseError instanceof Error ? parseError.message : 'Unknown parse error'
        },
        { status: 400 }
      );
    }
    
    const { name, email, password } = body;
    console.log('📋 Registration data received:', { name: name?.substring(0, 10) + '...', email });
    
    // Validate required fields with detailed error messages
    const validationErrors = [];
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      validationErrors.push('Name must be a string with at least 2 characters');
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.push('Email must be a valid email address');
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      validationErrors.push('Password must be a string with at least 6 characters');
    }
    
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validationErrors
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    console.log('🔍 Checking if user already exists...');
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return NextResponse.json(
        { 
          error: 'User already exists with this email address',
          code: 'USER_EXISTS'
        },
        { status: 409 }
      );
    }
    console.log('✅ User does not exist, proceeding with registration');

    // Hash password with error handling
    console.log('🔐 Hashing password...');
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password.trim(), 12);
      console.log('✅ Password hashed successfully');
    } catch (hashError) {
      console.error('❌ Password hashing error:', hashError);
      return NextResponse.json(
        { 
          error: 'Failed to process password',
          code: 'PASSWORD_HASH_ERROR'
        },
        { status: 500 }
      );
    }

    // Create user with error handling
    console.log('👤 Creating user account...');
    let user;
    try {
      user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
      });
      console.log('✅ User created successfully:', user._id);
    } catch (createError) {
      console.error('❌ User creation error:', createError);
      return NextResponse.json(
        { 
          error: 'Failed to create user account',
          code: 'USER_CREATION_ERROR',
          details: createError instanceof Error ? createError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    console.log('🎉 Registration completed successfully');
    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: userWithoutPassword
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Registration error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error during registration',
        code: 'INTERNAL_ERROR',
        details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
      },
      { status: 500 }
    );
  }
}
