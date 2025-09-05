import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import Comment from '@/models/Comment';

// Get all posts
export async function GET() {
  try {
    await dbConnect();
    
    const posts = await Post.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('userId', 'name email image');
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Posts API error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// Create a new post
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content, image, tags } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    if (content.length > 500) {
      return NextResponse.json({ error: 'Content too long' }, { status: 400 });
    }

    await dbConnect();

    const post = new Post({
      userId: session.user.id,
      username: session.user.name || 'Anonymous',
      content: content.trim(),
      image: image || undefined,
      tags: tags || [],
      userLikes: [],
    });

    await post.save();

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

// Like/unlike a post
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { postId, action } = body; // action: 'like' or 'unlike'

    if (!postId || !action) {
      return NextResponse.json({ error: 'Post ID and action required' }, { status: 400 });
    }

    await dbConnect();

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const username = session.user.name || 'Anonymous';
    const isLiked = post.userLikes.includes(username);

    if (action === 'like' && !isLiked) {
      post.likes += 1;
      post.userLikes.push(username);
    } else if (action === 'unlike' && isLiked) {
      post.likes -= 1;
      post.userLikes = post.userLikes.filter((user: string) => user !== username);
    }

    await post.save();

    return NextResponse.json({ 
      likes: post.likes, 
      userLikes: post.userLikes,
      isLiked: post.userLikes.includes(username)
    });
  } catch (error) {
    console.error('Like post error:', error);
    return NextResponse.json({ error: 'Failed to update like' }, { status: 500 });
  }
}
