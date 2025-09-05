import mongoose from 'mongoose';

export interface IGameRoom extends mongoose.Document {
  name: string;
  description: string;
  gameType: string;
  maxPlayers: number;
  currentPlayers: number;
  players: string[];
  hostId: mongoose.Types.ObjectId;
  hostUsername: string;
  status: 'waiting' | 'playing' | 'finished';
  isPrivate: boolean;
  password?: string;
  settings: {
    difficulty: 'easy' | 'medium' | 'hard';
    timeLimit?: number;
    customRules?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const GameRoomSchema = new mongoose.Schema<IGameRoom>(
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
    gameType: {
      type: String,
      required: true,
      enum: ['Cyberpunk Arena', 'VR Racing', 'Neon Battle', 'AI Challenge', 'Metaverse Quest'],
    },
    maxPlayers: {
      type: Number,
      required: true,
      min: 2,
      max: 20,
    },
    currentPlayers: {
      type: Number,
      default: 0,
      min: 0,
    },
    players: [{
      type: String,
    }],
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hostUsername: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['waiting', 'playing', 'finished'],
      default: 'waiting',
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
    },
    settings: {
      difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium',
      },
      timeLimit: {
        type: Number,
        min: 60,
        max: 3600,
      },
      customRules: {
        type: String,
        maxlength: 500,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
GameRoomSchema.index({ status: 1, createdAt: -1 });
GameRoomSchema.index({ gameType: 1, status: 1 });
GameRoomSchema.index({ hostId: 1 });
GameRoomSchema.index({ isPrivate: 1, status: 1 });

export default mongoose.models.GameRoom || mongoose.model<IGameRoom>('GameRoom', GameRoomSchema);
