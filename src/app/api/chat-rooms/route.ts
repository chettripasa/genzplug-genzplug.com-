import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { ChatRoom, ChatMessage } from '@/models/ChatRoom';

// Get all chat rooms
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    await dbConnect();
    
    let query: any = { isPrivate: false };
    if (category && category !== 'All') {
      query.category = category;
    }
    
    const chatRooms = await ChatRoom.find(query)
      .sort({ lastMessageTime: -1, createdAt: -1 })
      .limit(50)
      .populate('adminId', 'name email image');
    
    return NextResponse.json(chatRooms);
  } catch (error) {
    console.error('Chat rooms API error:', error);
    return NextResponse.json({ error: 'Failed to fetch chat rooms' }, { status: 500 });
  }
}

// Create a new chat room
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, category, maxMembers, isPrivate, password } = body;

    if (!name || !category) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    if (name.length > 50) {
      return NextResponse.json({ error: 'Room name too long' }, { status: 400 });
    }

    await dbConnect();

    const chatRoom = new ChatRoom({
      name: name.trim(),
      description: description?.trim() || '',
      category,
      members: [session.user.name || 'Anonymous'],
      onlineMembers: [session.user.name || 'Anonymous'],
      maxMembers: maxMembers || 100,
      isPrivate: isPrivate || false,
      password: isPrivate ? password : undefined,
      adminId: session.user.id,
      adminUsername: session.user.name || 'Anonymous',
    });

    await chatRoom.save();

    return NextResponse.json(chatRoom, { status: 201 });
  } catch (error) {
    console.error('Create chat room error:', error);
    return NextResponse.json({ error: 'Failed to create chat room' }, { status: 500 });
  }
}

// Join/leave a chat room
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { roomId, action, password } = body; // action: 'join' or 'leave'

    if (!roomId || !action) {
      return NextResponse.json({ error: 'Room ID and action required' }, { status: 400 });
    }

    await dbConnect();

    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom) {
      return NextResponse.json({ error: 'Chat room not found' }, { status: 404 });
    }

    const username = session.user.name || 'Anonymous';

    if (action === 'join') {
      if (chatRoom.isPrivate && chatRoom.password && password !== chatRoom.password) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
      }

      if (chatRoom.members.length >= chatRoom.maxMembers) {
        return NextResponse.json({ error: 'Room is full' }, { status: 400 });
      }

      if (!chatRoom.members.includes(username)) {
        chatRoom.members.push(username);
      }
      if (!chatRoom.onlineMembers.includes(username)) {
        chatRoom.onlineMembers.push(username);
      }
    } else if (action === 'leave') {
      chatRoom.members = chatRoom.members.filter((member: string) => member !== username);
      chatRoom.onlineMembers = chatRoom.onlineMembers.filter((member: string) => member !== username);
    }

    await chatRoom.save();

    return NextResponse.json({
      members: chatRoom.members,
      onlineMembers: chatRoom.onlineMembers,
      memberCount: chatRoom.members.length,
      onlineCount: chatRoom.onlineMembers.length
    });
  } catch (error) {
    console.error('Chat room action error:', error);
    return NextResponse.json({ error: 'Failed to update chat room' }, { status: 500 });
  }
}
