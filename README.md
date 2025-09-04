# GenZPlug - Modern E-commerce Platform

A full-stack e-commerce platform built with Next.js 14, MongoDB, Stripe, and NextAuth.js.

## 🚀 Features

- **Next.js 14 App Router** - Latest React framework with optimal performance
- **TypeScript** - Type-safe development experience
- **TailwindCSS** - Utility-first CSS framework for modern UI
- **MongoDB + Mongoose** - Scalable NoSQL database with ODM
- **Stripe Integration** - Secure payment processing with webhooks
- **NextAuth.js Authentication** - Multi-provider authentication (Email, Google, GitHub)
- **Route Protection** - Middleware-based route protection
- **Responsive Design** - Mobile-first approach
- **Vercel Deployment** - Optimized for cloud deployment

## 🔐 Authentication Features

### Supported Providers
- **Email/Password** - Custom credentials with bcrypt password hashing
- **Google OAuth** - Social login with Google
- **GitHub OAuth** - Social login with GitHub

### Authentication Flow
- Secure user registration with password validation
- Email/password login with bcrypt verification
- OAuth login with automatic account creation
- Protected routes with middleware
- Session management with JWT tokens
- User profile management

### Protected Routes
- `/dashboard` - User dashboard (requires authentication)
- `/profile` - User profile management
- `/orders` - Order history
- `/api/protected/*` - Protected API endpoints

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: NextAuth.js with multiple providers
- **Payments**: Stripe
- **Deployment**: Vercel
- **Database**: MongoDB Atlas (recommended)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd genzplug
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/genzplug
   # For production: mongodb+srv://username:password@cluster.mongodb.net/genzplug

   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key-here

   # Stripe Configuration
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here

   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # GitHub OAuth (Optional)
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret

   # App Configuration
   APP_NAME=GenZPlug
   APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication Setup

### Email/Password Authentication
The application includes a complete email/password authentication system:
- User registration with password hashing (bcrypt)
- Email/password login with secure verification
- Password validation and error handling

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins
6. Update environment variables

### GitHub OAuth Setup
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set the callback URL to `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Client Secret
5. Update environment variables

## 🗄️ Database Setup

### Local MongoDB
1. Install MongoDB locally or use Docker:
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

### MongoDB Atlas (Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your environment variables

## 💳 Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Set up webhooks for payment events
4. Update your environment variables with the Stripe keys

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push

### Environment Variables for Production

Set these in your Vercel dashboard:
- `NEXTAUTH_URL` - Your production URL
- `NEXTAUTH_SECRET` - A secure random string
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret
- `GOOGLE_CLIENT_ID` - Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Your Google OAuth client secret
- `GITHUB_CLIENT_ID` - Your GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` - Your GitHub OAuth client secret

## 🧪 Testing the Application

### Authentication Testing

1. **Email Registration**
   - Visit `/auth/signup`
   - Create an account with email/password
   - Verify account creation

2. **Email Login**
   - Visit `/auth/signin`
   - Login with your credentials
   - Access protected dashboard

3. **OAuth Testing**
   - Click on Google or GitHub login buttons
   - Complete OAuth flow
   - Verify automatic account creation

4. **Route Protection**
   - Try accessing `/dashboard` without authentication
   - Verify redirect to login page
   - Test protected API endpoints

### Without Database

The application will run without a database, but authentication and API routes will show errors. The frontend will still work.

### With Database

1. Set up MongoDB (local or Atlas)
2. Test user registration and login
3. Verify OAuth providers work correctly
4. Test protected routes and API endpoints

## 📁 Project Structure

```
genzplug/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/         # NextAuth routes
│   │   │   │   ├── [...nextauth]/ # NextAuth handler
│   │   │   │   └── register/ # User registration
│   │   │   ├── products/     # Product API
│   │   │   ├── checkout/     # Stripe checkout
│   │   │   ├── webhooks/     # Stripe webhooks
│   │   │   └── protected/    # Protected API routes
│   │   ├── auth/             # Authentication pages
│   │   │   ├── signin/       # Login page
│   │   │   └── signup/       # Registration page
│   │   ├── dashboard/        # Protected dashboard
│   │   ├── products/         # Products page
│   │   ├── about/           # About page
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # React components
│   │   ├── Header.tsx       # Navigation header
│   │   ├── ProductCard.tsx  # Product display
│   │   ├── Footer.tsx       # Footer component
│   │   └── Providers.tsx    # Auth providers
│   ├── lib/                 # Utility libraries
│   │   ├── auth.ts         # NextAuth configuration
│   │   ├── mongodb.ts      # Database connection
│   │   ├── stripe.ts       # Stripe utilities
│   │   ├── utils.ts        # Common utilities
│   │   └── mongodb-adapter.ts # NextAuth adapter
│   ├── models/             # MongoDB models
│   │   ├── User.ts         # User schema
│   │   └── Product.ts      # Product schema
│   ├── types/              # TypeScript types
│   │   └── global.d.ts     # Global type definitions
│   └── middleware.ts       # Route protection middleware
├── public/                 # Static assets
├── .github/               # GitHub Actions
│   └── workflows/         # CI/CD workflows
├── vercel.json            # Vercel configuration
├── .env.example          # Environment variables template
├── package.json           # Dependencies
└── README.md             # Project documentation
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔒 Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Tokens** - Secure session management
- **Route Protection** - Middleware-based authentication
- **CSRF Protection** - Built-in NextAuth protection
- **Input Validation** - Server-side validation
- **Environment Variables** - Secure configuration management

## 🆘 Troubleshooting

### Authentication Issues

1. **OAuth not working**
   - Verify OAuth credentials are correct
   - Check callback URLs in provider settings
   - Ensure environment variables are set

2. **Email registration fails**
   - Check MongoDB connection
   - Verify email format validation
   - Check password requirements

3. **Protected routes not working**
   - Verify middleware configuration
   - Check session handling
   - Ensure proper redirects

### Build Errors

If you encounter build errors related to missing environment variables:
1. Make sure you have a `.env.local` file
2. Check that all required variables are set
3. The application will build without database/Stripe if variables are missing

### Database Connection Issues

1. Verify your MongoDB URI is correct
2. Check network connectivity
3. Ensure MongoDB is running (if using local instance)

## 📞 Support

For issues or questions:
1. Check the README.md for detailed documentation
2. Review the code comments for implementation details
3. Open an issue on GitHub

## 🔄 Updates

Stay updated with the latest changes by following the repository and checking the releases page.

---

Built with ❤️ using Next.js, MongoDB, Stripe, and NextAuth.js
#   g e n z p l u g - g e n z p l u g . c o m -  
 