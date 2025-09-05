import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Post from '@/models/Post';

// Get comments for a post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }

    await dbConnect();
    
    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .limit(50);
    
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Comments API error:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// Create a new comment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { postId, content } = body;

    if (!postId || !content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Post ID and content required' }, { status: 400 });
    }

    if (content.length > 200) {
      return NextResponse.json({ error: 'Comment too long' }, { status: 400 });
    }

    await dbConnect();

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const comment = new Comment({
      postId,
      userId: session.user.id,
      username: session.user.name || 'Anonymous',
      content: content.trim(),
      userLikes: [],
    });

    await comment.save();

    // Update post comment count
    post.comments += 1;
    await post.save();

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

// Like/unlike a comment
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { commentId, action } = body; // action: 'like' or 'unlike'

    if (!commentId || !action) {
      return NextResponse.json({ error: 'Comment ID and action required' }, { status: 400 });
    }

    await dbConnect();

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    const username = session.user.name || 'Anonymous';
    const isLiked = comment.userLikes.includes(username);

    if (action === 'like' && !isLiked) {
      comment.likes += 1;
      comment.userLikes.push(username);
    } else if (action === 'unlike' && isLiked) {
      comment.likes -= 1;
      comment.userLikes = comment.userLikes.filter(user => user !== username);
    }

    await comment.save();

    return NextResponse.json({ 
      likes: comment.likes, 
      userLikes: comment.userLikes,
      isLiked: comment.userLikes.includes(username)
    });
  } catch (error) {
    console.error('Like comment error:', error);
    return NextResponse.json({ error: 'Failed to update like' }, { status: 500 });
  }
}
