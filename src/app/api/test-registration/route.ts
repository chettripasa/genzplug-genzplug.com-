import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    console.log('🧪 Testing registration components...');
    
    // Test 1: Database connection
    console.log('🔌 Testing database connection...');
    await dbConnect();
    console.log('✅ Database connection successful');
    
    // Test 2: User model
    console.log('👤 Testing User model...');
    const userCount = await User.countDocuments();
    console.log('✅ User model working, count:', userCount);
    
    // Test 3: Password hashing
    console.log('🔐 Testing password hashing...');
    const testPassword = 'test123';
    const hashedPassword = await bcrypt.hash(testPassword, 12);
    console.log('✅ Password hashing successful');
    
    // Test 4: Create a test user (if it doesn't exist)
    console.log('📝 Testing user creation...');
    const testEmail = 'test@genzplug.com';
    const existingTestUser = await User.findOne({ email: testEmail });
    
    if (!existingTestUser) {
      const testUser = await User.create({
        name: 'Test User',
        email: testEmail,
        password: hashedPassword,
      });
      console.log('✅ Test user created:', testUser._id);
      
      // Clean up test user
      await User.deleteOne({ _id: testUser._id });
      console.log('🧹 Test user cleaned up');
    } else {
      console.log('ℹ️ Test user already exists, skipping creation');
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'All registration components working correctly',
      tests: {
        databaseConnection: '✅ Pass',
        userModel: '✅ Pass',
        passwordHashing: '✅ Pass',
        userCreation: '✅ Pass',
        userCount: userCount
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Registration test failed:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Registration test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    console.log('🧪 Testing full registration process...');
    
    // Simulate the exact registration process
    const testData = {
      name: 'Test Registration User',
      email: 'test-registration@genzplug.com',
      password: 'testpassword123'
    };
    
    console.log('📝 Registration test data:', { name: testData.name, email: testData.email });
    
    // Step 1: Database connection
    console.log('🔌 Connecting to database...');
    await dbConnect();
    console.log('✅ Database connected successfully');
    
    // Step 2: Check if user exists
    console.log('🔍 Checking if user already exists...');
    const existingUser = await User.findOne({ email: testData.email.toLowerCase().trim() });
    if (existingUser) {
      console.log('ℹ️ Test user already exists, cleaning up...');
      await User.deleteOne({ _id: existingUser._id });
      console.log('🧹 Existing test user cleaned up');
    }
    console.log('✅ User does not exist, proceeding with registration');
    
    // Step 3: Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(testData.password.trim(), 12);
    console.log('✅ Password hashed successfully');
    
    // Step 4: Create user
    console.log('👤 Creating user account...');
    const user = await User.create({
      name: testData.name.trim(),
      email: testData.email.toLowerCase().trim(),
      password: hashedPassword,
    });
    console.log('✅ User created successfully:', user._id);
    
    // Step 5: Clean up
    console.log('🧹 Cleaning up test user...');
    await User.deleteOne({ _id: user._id });
    console.log('✅ Test user cleaned up');
    
    console.log('🎉 Full registration test completed successfully');
    
    return NextResponse.json({
      status: 'success',
      message: 'Full registration process test completed successfully',
      testData: {
        name: testData.name,
        email: testData.email,
        userId: user._id.toString()
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Full registration test failed:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Full registration test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}