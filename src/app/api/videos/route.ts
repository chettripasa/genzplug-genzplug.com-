import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Video from '@/models/Video';

// Get all videos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');

    await dbConnect();
    
    let query: any = { isPublic: true };
    if (category && category !== 'All') {
      query.category = category;
    }
    
    const videos = await Video.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name email image');
    
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Videos API error:', error);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}

// Create a new video
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, thumbnail, videoUrl, duration, category, tags } = body;

    if (!title || !thumbnail || !videoUrl || !duration || !category) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    if (title.length > 100) {
      return NextResponse.json({ error: 'Title too long' }, { status: 400 });
    }

    await dbConnect();

    const video = new Video({
      userId: session.user.id,
      username: session.user.name || 'Anonymous',
      title: title.trim(),
      description: description?.trim() || '',
      thumbnail,
      videoUrl,
      duration,
      category,
      tags: tags || [],
      userLikes: [],
    });

    await video.save();

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error('Create video error:', error);
    return NextResponse.json({ error: 'Failed to create video' }, { status: 500 });
  }
}

// Like/unlike a video
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { videoId, action } = body; // action: 'like' or 'unlike'

    if (!videoId || !action) {
      return NextResponse.json({ error: 'Video ID and action required' }, { status: 400 });
    }

    await dbConnect();

    const video = await Video.findById(videoId);
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const username = session.user.name || 'Anonymous';
    const isLiked = video.userLikes.includes(username);

    if (action === 'like' && !isLiked) {
      video.likes += 1;
      video.userLikes.push(username);
    } else if (action === 'unlike' && isLiked) {
      video.likes -= 1;
      video.userLikes = video.userLikes.filter((user: string) => user !== username);
    }

    await video.save();

    return NextResponse.json({ 
      likes: video.likes, 
      userLikes: video.userLikes,
      isLiked: video.userLikes.includes(username)
    });
  } catch (error) {
    console.error('Like video error:', error);
    return NextResponse.json({ error: 'Failed to update like' }, { status: 500 });
  }
}
