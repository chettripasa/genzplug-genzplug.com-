import mongoose from 'mongoose';

export interface IPost extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  username: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  userLikes: string[];
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new mongoose.Schema<IPost>(
  {
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
      maxlength: 500,
    },
    image: {
      type: String,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    comments: {
      type: Number,
      default: 0,
      min: 0,
    },
    shares: {
      type: Number,
      default: 0,
      min: 0,
    },
    userLikes: [{
      type: String,
    }],
    tags: [{
      type: String,
      trim: true,
    }],
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
PostSchema.index({ userId: 1, createdAt: -1 });
PostSchema.index({ isPublic: 1, createdAt: -1 });
PostSchema.index({ tags: 1 });
PostSchema.index({ likes: -1 });

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
