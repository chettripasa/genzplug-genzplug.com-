import mongoose from 'mongoose';

export interface IComment extends mongoose.Document {
  postId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  username: string;
  content: string;
  likes: number;
  userLikes: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new mongoose.Schema<IComment>(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 200,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    userLikes: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
CommentSchema.index({ postId: 1, createdAt: -1 });
CommentSchema.index({ userId: 1 });

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
