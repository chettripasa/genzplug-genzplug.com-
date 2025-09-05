import mongoose from 'mongoose';

export interface IChatMessage extends mongoose.Document {
  roomId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  username: string;
  message: string;
  messageType: 'text' | 'image' | 'file' | 'system';
  createdAt: Date;
}

export interface IChatRoom extends mongoose.Document {
  name: string;
  description: string;
  category: string;
  members: string[];
  onlineMembers: string[];
  maxMembers: number;
  isPrivate: boolean;
  password?: string;
  adminId: mongoose.Types.ObjectId;
  adminUsername: string;
  lastMessage?: string;
  lastMessageUser?: string;
  lastMessageTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new mongoose.Schema<IChatMessage>(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatRoom',
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
    message: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'file', 'system'],
      default: 'text',
    },
  },
  {
    timestamps: true,
  }
);

const ChatRoomSchema = new mongoose.Schema<IChatRoom>(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
    },
    description: {
      type: String,
      maxlength: 200,
    },
    category: {
      type: String,
      required: true,
      enum: ['Gaming', 'VR', 'Tech', 'Racing', 'Art', 'Crypto', 'General'],
    },
    members: [{
      type: String,
    }],
    onlineMembers: [{
      type: String,
    }],
    maxMembers: {
      type: Number,
      default: 100,
      min: 2,
      max: 1000,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    adminUsername: {
      type: String,
      required: true,
    },
    lastMessage: {
      type: String,
    },
    lastMessageUser: {
      type: String,
    },
    lastMessageTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
ChatMessageSchema.index({ roomId: 1, createdAt: -1 });
ChatRoomSchema.index({ category: 1, createdAt: -1 });
ChatRoomSchema.index({ isPrivate: 1, category: 1 });
ChatRoomSchema.index({ adminId: 1 });

export const ChatMessage = mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
export const ChatRoom = mongoose.models.ChatRoom || mongoose.model<IChatRoom>('ChatRoom', ChatRoomSchema);
