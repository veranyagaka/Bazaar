# BAZAAR DOCUMENTATION

# Bazaar - Market Match Platform for Farmers 🌾

A web-first platform connecting small-scale farmers with better market opportunities through real-time pricing data, buyer matching, and transparent agricultural commerce.

## 📌 Table of Contents

- [🌟 Problem Statement](#-problem-statement)
- [💡Solution](#solution)
- [🧰 Tech Stack](#-tech-stack)
- [🖼 Screenshots](#-screenshots)
- [🚀 Getting Started](#-getting-started)
- [🔐 User Access & Flow](#-user-access--flow)
- [🏗️ Project Structure](#-project-structure)
- [📈 Roadmap](#-roadmap)
- [⚙️ Technical Implementation of Features](#-technical-implementation-of-features)
- [🔒 Security & Testing](#-security--testing)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🤝 Contributors](#-contributors)


## 🎯 Problem Statement

Small-scale farmers often lack access to:

- Real-time market pricing information
- Direct connections to buyers
- Transparent pricing mechanisms
- Efficient distribution channels
- Low-quality produce

This leads to financial losses, market inefficiencies, and limited growth opportunities.

## 💡 Solution

Bazaar provides a comprehensive web platform that:

- **Live Market Prices**: Real-time crop pricing across different markets
- **Buyer Matching**: Algorithm-driven connections between farmers and buyers
- **Crop Disease Detection:** Enables real-time analysis of crop health
- **Price Alerts**: Notifications for optimal selling opportunities
- **Trend Analysis**: Historical data and market predictions
- **Direct Communication**: In-app messaging or WhatsApp integration

## 🛠️ Tech Stack

| Frontend | Backend | Auth | UI & Styling | Dev Tools |
| --- | --- | --- | --- | --- |
| React + TypeScript | Supabase (PostgreSQL) | Clerk | Shadcn/ui, Tailwind CSS | Vite, Lovable.dev+Supabase |
| React Native + Expo | Supabase Realtime | Magic Links | Lucide React, Recharts | GitHub, Rork.app, v0 |

## 🖼 Screenshots

<div align="center" style="display: flex; gap: 16px;">
  <img src="/public/assets/one.jpeg" alt="Bazaar App Welcome Screen" width="300"/>
  <img src="/public/assets/two.jpeg" alt="Bazaar Dashboard" width="300"/>
  <img src="/public/assets/three.jpeg" alt="Disease Detection Screen" width="300"/>
  <img src="/public/assets/four.png" alt="Buyer Matches Screen" width="300"/>
</div>

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Clerk account
- Supabase project

### Installation

1. **Clone the repository**
    
    ```bash
    git clone https://github.com/veranyagaka/Bazaar.git
    cd bazaar
    
    # **Install dependencies
    npm install**
    ```
    
2. **Set up Clerk Authentication**
    - Create a Clerk application at [https://go.clerk.com/lovable](https://go.clerk.com/lovable)
    - Copy your publishable key
    - Replace the demo key in `src/main.tsx`
3. **Set up Supabase**
    - Connect your Lovable project to Supabase using the green button
    - Run the SQL schema from `SUPABASE_SETUP.md`
    - Configure Row Level Security policies
4. **Start development server**
    
    ```bash
    npm run dev
    
    ```
    

## 🔐 User Access & Flow

### 1. Authentication Journey

- **Landing Page** – Hero section with value proposition
- **Sign Up** – Choose role (Farmer / Buyer)
- **Onboarding** – Complete profile and set preferences
- **Dashboard** – Role-specific features

### 2. User Types & Features

| Role | Key Actions |
| --- | --- |
| 🌾 **Farmers** | Add crops, set prices/quality, view buyer matches, receive alerts, track sales |
| 🏪 **Buyers** | Post needs, browse produce, set alerts, connect with farmers, manage procurement |
| 👨‍💼 **Admins** | Manage market data, verify users, analytics, moderation |

## 🏗️ Project Structure

```
public/                 # Static Files i.e images
server/                 # Backend for AI assistant
src/
├── components/          # Reusable UI components
│   ├── Navigation.tsx   # Main navigation bar
│   ├── Hero.tsx        # Landing page hero section
│   ├── MarketFeed.tsx  # Live market prices display
│   ├── ChatWidget.tsx
│   ├── RoleOnboarding.tsx
│   ├── FarmerDashboard.tsx
│   ├── BuyerDashboard.tsx
│   └── Footer.tsx           
├── pages/              # Page components
│   ├── AdminDashbord.tsx
│   ├── Alerts.tsx
│   ├── Buyers.tsx
│   ├── DiseaseDetection.tsx
│   ├── Markets.tsx
│   ├── Index.tsx       # Main landing/dashboard page
│   └── NotFound.tsx    # 404 error page
├── types/              # TypeScript type definitions
│   └── index.ts        # Core data models
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
│   ├── supabaseClient.tsx       
└── styles/             # Global styles and themes

```

## 📈 Roadmap

### Phase 1 (Current)

- [x]  User authentication and profiles
- [x]  Basic farmer and buyer dashboards
- [x]  Market price display
- [x]  Responsive design implementation

### Phase 2 (Next)

- [ ]  Advanced matching algorithm
- [ ]  Real-time price data integration
- [ ]  Full mobile app development

### Phase 3 (Future)

- [ ]  Payment integration
- [ ]  AI-powered price predictions
- [ ]  Multi-language support

## TECHNICAL IMPLEMENTATION OF FEATURES

### Market Matching System 🎯

## Quick Overview

The Market Matching System intelligently connects farmers with potential buyers using a sophisticated algorithm that analyzes location, crop type, quantity, price preferences, and delivery requirements.

## Key Features

- **Smart Matching Algorithm**: Weighted scoring system (Location 30%, Price 25%, Quantity 20%, Delivery 15%, Recency 10%)
- **Real-time Results**: Instant matching with buyers based on farmer preferences
- **Advanced Filtering**: Filter by match score, distance, price range, and delivery dates
- **Market Insights**: Analytics showing average match scores, best prices, and market demand
- **Secure Communication**: Protected contact system with Clerk authentication

## Core Components

| Component | Purpose |
| --- | --- |
| MarketMatch | Main interface for crop input and preferences |
| MatchResults | Displays matched buyers with scores and details |
| MatchFilters | Advanced filtering and sorting options |

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL) with RLS policies
- **Authentication**: Clerk
- **State Management**: TanStack Query

## Quick Stats

- **17+ Supported Crops**: Comprehensive crop type coverage
- **30% Minimum Match Score**: Quality threshold for displayed results
- **Multi-factor Scoring**: Location, price, quantity, delivery, and recency
- **Real-time Updates**: Live market data integration

## Getting Started

1. Navigate to `/market-match` (authentication required)
2. Input crop details and preferences
3. Review matched buyers sorted by compatibility score
4. Connect with buyers using built-in communication tools

---

📖 [**View Complete Technical Documentation**](https://www.notion.so/AI-Powered-Crop-Disease-Detection-Data-Warehousing-Integration-Guide-1fefecc0d34a80c7aff9d3fc589c5c23?pvs=21)

*The full documentation includes detailed architecture diagrams, database schemas, API specifications, security considerations, testing strategies, and deployment guidelines.*

# AI Crop Disease Detection System 🌱🤖

## Quick Overview

An intelligent system that uses OpenAI Vision API (GPT-4o) to detect crop diseases in real-time, integrated with comprehensive data warehousing for agricultural analytics and market intelligence.

## Key Features

- **AI-Powered Detection**: Real-time crop disease identification using advanced computer vision
- **High Accuracy Analysis**: Confidence scoring, severity assessment, and treatment recommendations
- **Data Warehousing**: ETL pipelines for agricultural analytics and market intelligence
- **Predictive Analytics**: Yield forecasting, outbreak prediction, and economic impact modeling
- **Real-time Dashboards**: Live disease monitoring, market intelligence, and alert systems

## Core Components

| Component | Purpose |
| --- | --- |
| OpenAI Vision Integration | Real-time disease detection and analysis |
| Edge Functions | Image processing and API orchestration |
| Data Warehouse Sync | Analytics aggregation and insights |
| Predictive Models | Yield forecasting and risk assessment |

## System Architecture

```
Frontend (React) ↔ Supabase Edge Functions ↔ OpenAI Vision API
                           ↓
                   Supabase Database
                           ↓
                   Data Warehouse (Azure/AWS/GCP)

```

## Detection Capabilities

- **17+ Crop Types**: Comprehensive coverage of Kenyan agricultural crops
- **Disease Identification**: Automated pathogen detection and classification
- **Severity Assessment**: Mild, moderate, severe, and critical classifications
- **Treatment Recommendations**: Actionable intervention strategies
- **Economic Impact**: Yield loss estimation and market impact analysis

## Tech Stack

| Frontend | Backend | AI/ML | Data Warehouse | Analytics
|-----|-----
| React + TypeScript | Supabase Edge Functions | OpenAI GPT-4o Vision | Azure Synapse / AWS Redshift / Google BigQuery | Real-time Dashboards
| Tailwind CSS | PostgreSQL with RLS | Custom Agricultural Prompts | ETL Pipelines | Predictive Modeling

## Quick Stats

- **89% Average Confidence**: High-accuracy disease detection
- **Real-time Processing**: Instant analysis and recommendations
- **Multi-cloud Support**: Azure, AWS, and GCP integration options
- **Comprehensive Analytics**: Disease patterns, market correlations, yield predictions

## Getting Started

1. Upload crop image through the web interface
2. AI analyzes image and identifies potential diseases
3. Receive detailed assessment with treatment recommendations
4. Access analytics dashboard for broader insights
5. Monitor disease patterns and market impacts

---

📖 [**View Complete Technical Documentation**](https://www.notion.so/Market-Matching-System-Documentation-1fefecc0d34a80b68c37dbd3c90fdca0?pvs=21)

*The full documentation includes detailed system architecture, API specifications, database schemas, setup instructions for multiple cloud providers, security considerations, cost optimization strategies, and implementation roadmaps.*

## 🔒 Security & Testing

- ✅ **Authentication**: Clerk handles secure user authentication
- ✅ **Authorization**: Role-based access control (RBAC)
- ✅ **Data Protection**: Row Level Security in Supabase
- ✅ **API Security**: Protected endpoints and rate limiting
- ✅ **Input Validation**: Client and server-side validation
- ✅ Manual testing of flows (signup → match → chat)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- **Vera Nyagaka** – nyagakavera@gmail.com
- **Osborn Nyakaru -** osbornnyakaru44@gmail.com
    
    *Built for the Vibe Coding Hackathon by PLP, 2025.*
    

---

**Made with ❤️ for farmers and sustainable agriculture**

*Empowering small-scale farmers through technology and transparent markets.*