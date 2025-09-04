import mongoose from 'mongoose';

export interface IProduct extends mongoose.Document {
  name: string;
  description: string;
  price: number;
  currency: string;
  stripeProductId?: string;
  stripePriceId?: string;
  images: string[];
  category: string;
  inStock: boolean;
  stockQuantity: number;
  tags: string[];
  featured: boolean;
  discountPercentage?: number;
  originalPrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    },
    stripeProductId: {
      type: String,
    },
    stripePriceId: {
      type: String,
    },
    images: [{
      type: String,
      required: true,
    }],
    category: {
      type: String,
      required: true,
      enum: ['gaming', 'tech', 'accessories', 'clothing', 'collectibles', 'software'],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    featured: {
      type: Boolean,
      default: false,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
ProductSchema.index({ category: 1, featured: 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ inStock: 1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
