import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import GameRoom from '@/models/GameRoom';

// Get all game rooms
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameType = searchParams.get('gameType');
    const status = searchParams.get('status') || 'waiting';

    await dbConnect();
    
    let query: any = { status, isPrivate: false };
    if (gameType && gameType !== 'All') {
      query.gameType = gameType;
    }
    
    const gameRooms = await GameRoom.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('hostId', 'name email image');
    
    return NextResponse.json(gameRooms);
  } catch (error) {
    console.error('Game rooms API error:', error);
    return NextResponse.json({ error: 'Failed to fetch game rooms' }, { status: 500 });
  }
}

// Create a new game room
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, gameType, maxPlayers, isPrivate, password, settings } = body;

    if (!name || !gameType || !maxPlayers) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    if (name.length > 50) {
      return NextResponse.json({ error: 'Room name too long' }, { status: 400 });
    }

    await dbConnect();

    const gameRoom = new GameRoom({
      name: name.trim(),
      description: description?.trim() || '',
      gameType,
      maxPlayers: parseInt(maxPlayers),
      currentPlayers: 1,
      players: [session.user.name || 'Anonymous'],
      hostId: session.user.id,
      hostUsername: session.user.name || 'Anonymous',
      status: 'waiting',
      isPrivate: isPrivate || false,
      password: isPrivate ? password : undefined,
      settings: settings || { difficulty: 'medium' },
    });

    await gameRoom.save();

    return NextResponse.json(gameRoom, { status: 201 });
  } catch (error) {
    console.error('Create game room error:', error);
    return NextResponse.json({ error: 'Failed to create game room' }, { status: 500 });
  }
}

// Join/leave a game room
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

    const gameRoom = await GameRoom.findById(roomId);
    if (!gameRoom) {
      return NextResponse.json({ error: 'Game room not found' }, { status: 404 });
    }

    const username = session.user.name || 'Anonymous';

    if (action === 'join') {
      if (gameRoom.isPrivate && gameRoom.password && password !== gameRoom.password) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
      }

      if (gameRoom.currentPlayers >= gameRoom.maxPlayers) {
        return NextResponse.json({ error: 'Room is full' }, { status: 400 });
      }

      if (!gameRoom.players.includes(username)) {
        gameRoom.players.push(username);
        gameRoom.currentPlayers += 1;
      }
    } else if (action === 'leave') {
      gameRoom.players = gameRoom.players.filter((player: string) => player !== username);
      gameRoom.currentPlayers = Math.max(0, gameRoom.currentPlayers - 1);
      
      // If host leaves, assign new host or close room
      if (gameRoom.hostUsername === username && gameRoom.players.length > 0) {
        gameRoom.hostUsername = gameRoom.players[0];
      } else if (gameRoom.players.length === 0) {
        gameRoom.status = 'finished';
      }
    }

    await gameRoom.save();

    return NextResponse.json({
      currentPlayers: gameRoom.currentPlayers,
      players: gameRoom.players,
      status: gameRoom.status,
      hostUsername: gameRoom.hostUsername
    });
  } catch (error) {
    console.error('Game room action error:', error);
    return NextResponse.json({ error: 'Failed to update game room' }, { status: 500 });
  }
}
