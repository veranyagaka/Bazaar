
# Bazaar - Market Match Platform for Farmers 🌾

A web-first platform connecting small-scale farmers with better market opportunities through real-time pricing data, buyer matching, and transparent agricultural commerce.

## 🎯 Problem Statement

Small-scale farmers often lack access to:
- Real-time market pricing information
- Direct connections to buyers
- Transparent pricing mechanisms
- Efficient distribution channels

This leads to financial losses, market inefficiencies, and limited growth opportunities.

## 💡 Solution

Bazaar provides a comprehensive web platform that:
- **Live Market Prices**: Real-time crop pricing across different markets
- **Buyer Matching**: Algorithm-driven connections between farmers and buyers
- **Price Alerts**: Notifications for optimal selling opportunities
- **Trend Analysis**: Historical data and market predictions
- **Direct Communication**: In-app messaging or WhatsApp integration

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Authentication**: Clerk (email/password + magic links)
- **Database**: Supabase (PostgreSQL)
- **State Management**: TanStack Query
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **Build Tool**: Vite

## 🎨 Design System

- **Theme**: Dark mode optimized for rural/low-light conditions
- **Colors**: 
  - Primary: Orange (#ff5733)
  - Background: Deep gray (#1a1a1a)
  - Cards: Dark gray (#2a2a2a)
- **Typography**: Inter font family
- **Layout**: Mobile-first responsive design
- **Performance**: Optimized for low-bandwidth rural internet

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Clerk account (https://go.clerk.com/lovable)
- Supabase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd bazaar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Clerk Authentication**
   - Create a Clerk application at https://go.clerk.com/lovable
   - Copy your publishable key
   - Replace the demo key in `src/main.tsx`

4. **Set up Supabase**
   - Connect your Lovable project to Supabase using the green button
   - Run the SQL schema from `SUPABASE_SETUP.md`
   - Configure Row Level Security policies

5. **Start development server**
   ```bash
   npm run dev
   ```

## 📊 Database Schema

The platform uses a comprehensive PostgreSQL schema with:
- **User Management**: Profiles, farmer/buyer specific data
- **Product Catalog**: Produce types, categories, and metadata
- **Market Data**: Real-time and historical pricing
- **Matching System**: Buy requests, farmer produce, matches
- **Communication**: In-app messaging system
- **Alerts**: Price and market notifications

See `SUPABASE_SETUP.md` for complete schema and setup instructions.

## 🔐 Authentication Flow

1. **Landing Page**: Hero section with value proposition
2. **Sign Up**: Role selection (Farmer/Buyer)
3. **Onboarding**: Profile completion and preferences
4. **Dashboard**: Role-specific interface and features

## 👥 User Roles

### 🌾 Farmers
- Add crops and quantities available
- Set pricing and quality grades
- View buyer recommendations
- Receive price alerts
- Track sales and revenue

### 🏪 Buyers
- Post buying requirements
- Browse available produce
- Set price alerts for desired crops
- Connect with farmers
- Manage procurement pipeline

### 👨‍💼 Admins
- Market data management
- User verification
- System analytics
- Platform moderation

## 📱 Key Features

### For Farmers
- **Crop Management**: Add, edit, and manage crop listings
- **Price Discovery**: Real-time market prices for decision making
- **Buyer Matching**: Algorithm finds best nearby buyers
- **Revenue Tracking**: Monitor sales and profits
- **Market Trends**: Historical pricing and demand patterns

### For Buyers
- **Supplier Discovery**: Find reliable local farmers
- **Requirement Posting**: Specify quantity, quality, and price needs
- **Quality Assurance**: Access to crop quality information
- **Logistics Planning**: Distance and delivery coordination
- **Market Intelligence**: Supply trends and price forecasting

### Platform Features
- **Real-time Messaging**: Direct farmer-buyer communication
- **WhatsApp Integration**: Leverage existing communication habits
- **Geolocation Services**: Location-based matching and logistics
- **Mobile Optimization**: Works well on basic smartphones
- **Offline Support**: Core features work with limited connectivity

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navigation.tsx   # Main navigation bar
│   ├── Hero.tsx        # Landing page hero section
│   ├── MarketFeed.tsx  # Live market prices display
│   ├── FarmerDashboard.tsx
│   ├── BuyerDashboard.tsx
│   └── Footer.tsx
├── pages/              # Page components
│   ├── Index.tsx       # Main landing/dashboard page
│   └── NotFound.tsx    # 404 error page
├── types/              # TypeScript type definitions
│   └── index.ts        # Core data models
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── styles/             # Global styles and themes
```

## 🔧 Development

### Key Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Tailwind for styling
- Component-first architecture

## 🌍 Deployment

### Using Lovable
1. Click the "Publish" button in Lovable
2. Your app will be deployed automatically
3. Connect custom domain in Project Settings if needed

### Manual Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure environment variables for production

## 🔒 Security

- **Authentication**: Clerk handles secure user authentication
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Row Level Security in Supabase
- **API Security**: Protected endpoints and rate limiting
- **Input Validation**: Client and server-side validation

## 📈 Roadmap

### Phase 1 (Current)
- [x] User authentication and profiles
- [x] Basic farmer and buyer dashboards
- [x] Market price display
- [x] Responsive design implementation

### Phase 2 (Next)
- [ ] Advanced matching algorithm
- [ ] Real-time price data integration
- [ ] In-app messaging system
- [ ] Mobile app development

### Phase 3 (Future)
- [ ] Payment integration
- [ ] Logistics partnerships
- [ ] AI-powered price predictions
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

- **Documentation**: See SUPABASE_SETUP.md and CLERK_SETUP.md
- **Issues**: Report bugs or request features via GitHub Issues
- **Community**: Join our Discord for discussions and support

---

**Made with ❤️ for farmers and sustainable agriculture**

*Empowering small-scale farmers through technology and transparent markets.*
