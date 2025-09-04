# GenZPlug Dashboard

A futuristic, modular dashboard for authenticated users with glowing neon effects and cyberpunk aesthetics.

## Features

### 🔐 Authentication Protection
- Only authenticated users can access the dashboard
- Automatic redirect to signin page for unauthenticated users
- Session-based authentication with NextAuth.js
- Loading states with animated spinners

### 🎨 Futuristic Design
- **Neon Glow Effects**: Cyan, pink, purple, green, and blue neon glows
- **Glassmorphism**: Translucent cards with backdrop blur
- **Animated Background**: Floating particles and pulsing elements
- **Smooth Animations**: Slide-in, fade-in, and hover effects
- **Responsive Design**: Works on all screen sizes

### 📱 Social Feed
- **Interactive Posts**: Like, comment, and share functionality
- **Rich Content**: Text, images, and video support
- **Real-time Updates**: Live indicators and timestamps
- **User Avatars**: Gradient avatars with emoji icons
- **Engagement Metrics**: Like counts, comments, and shares

### 🎥 Video Hub
- **YouTube/TikTok Style**: Grid layout with video thumbnails
- **Category Filtering**: Filter by gaming, tech, racing, AI, VR, lifestyle
- **Video Metadata**: Duration, views, likes, comments
- **Play Button**: Hover effects with play overlay
- **Creator Information**: Creator names and ratings

### 🎮 Gaming Hub
- **Game Categories**: Racing, action, puzzle, strategy, arcade, RPG
- **Featured Games**: Highlighted games with ratings and player counts
- **Live Stats**: Active players, available games, tournaments
- **Quick Actions**: Join tournaments, find players, view leaderboards
- **Recent Activity**: User gaming achievements and activities
- **Game Center**: Modal for browser game integration

### 🛍️ Shop
- **Product Catalog**: Gaming chairs, keyboards, VR headsets, accessories
- **Category Filtering**: Furniture, accessories, VR, lighting, gaming
- **Shopping Cart**: Add/remove items with total calculation
- **Product Details**: Prices, ratings, reviews, stock status
- **Discount Badges**: Percentage off indicators
- **Stripe Integration**: Ready for checkout implementation

### 💬 Community Hub
- **Discord-style Chatrooms**: Active chatrooms with member counts
- **Category Organization**: Gaming, VR, tech, racing, art, crypto
- **Online Friends**: Friend status and current activities
- **Voice Chat**: Placeholder for voice communication
- **Community Stats**: Total members, active users, chatrooms
- **Create Rooms**: Modal for creating new chatrooms

## Technical Implementation

### Modular Architecture
```
src/components/dashboard/
├── SocialFeed.tsx      # Social media feed component
├── VideoHub.tsx        # Video streaming hub component
├── GamingHub.tsx       # Gaming center component
├── Shop.tsx           # E-commerce shop component
└── CommunityHub.tsx    # Community chat component
```

### Authentication Flow
1. User visits `/dashboard`
2. Check session status with `useSession()`
3. If not authenticated → redirect to `/auth/signin`
4. If authenticated → load dashboard with user data

### State Management
- **Local State**: Each component manages its own state
- **Session State**: User authentication and profile data
- **Tab Navigation**: Active tab state for section switching

### Styling System
- **TailwindCSS**: Utility-first CSS framework
- **Custom CSS Variables**: Neon color definitions
- **Glassmorphism**: Translucent card effects
- **Animations**: CSS keyframes for smooth transitions

## Getting Started

### Prerequisites
- Node.js 18+ 
- Next.js 14
- NextAuth.js
- TailwindCSS

### Installation
```bash
npm install
npm run dev
```

### Environment Variables
```env
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## Future Enhancements

### Social Feed
- [ ] Real-time post updates with WebSocket
- [ ] Image/video upload functionality
- [ ] Comment threading system
- [ ] User profiles and following system

### Video Hub
- [ ] Video player integration
- [ ] Live streaming capabilities
- [ ] Video upload and processing
- [ ] Recommendation algorithm

### Gaming Hub
- [ ] Browser game integration
- [ ] Real-time multiplayer support
- [ ] Tournament system
- [ ] Achievement system

### Shop
- [ ] Stripe payment integration
- [ ] Order management system
- [ ] Product inventory management
- [ ] User reviews and ratings

### Community Hub
- [ ] Real-time chat with WebSocket
- [ ] Voice chat with WebRTC
- [ ] File sharing capabilities
- [ ] Moderation tools

## Customization

### Adding New Sections
1. Create new component in `src/components/dashboard/`
2. Add to tabs array in `src/app/dashboard/page.tsx`
3. Import and include in the component mapping

### Styling Customization
- Modify CSS variables in `src/app/globals.css`
- Add new neon colors to the `:root` section
- Create custom animation keyframes

### Data Integration
- Replace demo data with API calls
- Integrate with your backend services
- Add real-time updates with WebSocket

## Performance Optimizations

- **Code Splitting**: Each section loads independently
- **Lazy Loading**: Components load on demand
- **Image Optimization**: Next.js Image component for thumbnails
- **Animation Performance**: CSS transforms for smooth animations

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - see LICENSE file for details
