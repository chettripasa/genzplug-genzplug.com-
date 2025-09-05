import mongoose from 'mongoose';

export interface IVideo extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  username: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  userLikes: string[];
  category: string;
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new mongoose.Schema<IVideo>(
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
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
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
    category: {
      type: String,
      required: true,
      enum: ['Gaming', 'Tech', 'Racing', 'AI', 'VR', 'Lifestyle', 'Entertainment'],
    },
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
VideoSchema.index({ userId: 1, createdAt: -1 });
VideoSchema.index({ category: 1, createdAt: -1 });
VideoSchema.index({ isPublic: 1, views: -1 });
VideoSchema.index({ tags: 1 });

export default mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);
