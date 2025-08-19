# StonkMaster2K1 Project Architecture

## Technology Stack Summary

### Frontend
- **Framework**: Next.js 14+ with TypeScript
- **Charting**: TradingView Lightweight Charts
- **Styling**: Tailwind CSS
- **State Management**: Zustand + SWR
- **Real-time**: Custom WebSocket hooks

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **WebSockets**: Socket.io
- **Database**: PostgreSQL (user data) + Redis (real-time cache)
- **Indicators**: trading-signals library

### Data Provider
- **Primary**: Alpaca Markets API
- **WebSocket**: Real-time price streaming
- **Backup**: EODHD for redundancy

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                             │
├─────────────────────────────────────────────────────────────────┤
│  Next.js App Router  │  TradingView Charts  │  Drawing Tools     │
│  - Dashboard Pages   │  - Candlestick       │  - Canvas Overlay  │
│  - Trading Interface │  - Technical Lines   │  - SVG Annotations │
│  - User Management   │  - Volume Indicators │  - Shape Tools     │
└─────────────────┬───────────────────────────────────────────────┘
                  │ HTTP/WebSocket
┌─────────────────▼───────────────────────────────────────────────┐
│                     API Gateway                                 │
├─────────────────────────────────────────────────────────────────┤
│  Express.js Router   │  Authentication     │  Rate Limiting     │
│  - REST Endpoints    │  - JWT Tokens       │  - Request Quotas  │
│  - WebSocket Manager │  - Session Control  │  - DDoS Protection │
└─────────────────┬───────────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────────┐
│                   Microservices Layer                           │
├─────────────────────────────────────────────────────────────────┤
│ Market Data      │ Indicator Service │ Trading Engine │ Portfolio│
│ - Price Streams  │ - SMA, EMA, RSI   │ - Order Mgmt   │ - P&L    │
│ - WebSocket Mgr  │ - MACD, Bollinger │ - Risk Checks  │ - Metrics│
│ - Data Validation│ - Custom Algos    │ - Execution    │ - Reports│
└─────────────────┬───────────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────────┐
│                      Data Layer                                 │
├─────────────────────────────────────────────────────────────────┤
│  Redis Cache        │  PostgreSQL         │  External APIs      │
│  - Price Data       │  - User Accounts    │  - Alpaca Markets   │
│  - Session Store    │  - Trading History  │  - Market Data      │
│  - Indicator Cache  │  - Portfolio Data   │  - News Feeds       │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

### Real-Time Price Updates
```
Alpaca WebSocket → Redis Pub/Sub → Socket.io → Client
                      ↓
                 Indicator Service → Chart Updates
```

### User Trading Flow
```
User Action → Next.js → API Gateway → Trading Engine → Alpaca API
                                         ↓
                              Portfolio Service → Database
```

### Chart Rendering Flow
```
Historical Data → TradingView Charts → Canvas Drawing Layer
     ↓                   ↓                    ↓
Price Updates → Real-time Updates → Drawing Persistence
```

## Component Architecture

### Frontend Components
```
app/
├── dashboard/
│   ├── page.tsx              # Main trading dashboard
│   ├── layout.tsx            # Dashboard layout
│   └── loading.tsx           # Loading states
├── charts/
│   ├── [symbol]/page.tsx     # Individual chart view
│   └── components/
│       ├── TradingChart.tsx  # Main chart component
│       ├── DrawingTools.tsx  # Drawing interface
│       ├── IndicatorPanel.tsx# Indicator controls
│       └── OrderPanel.tsx    # Trading interface
└── api/
    ├── auth/                 # Authentication endpoints
    ├── market-data/          # Market data proxy
    ├── indicators/           # Custom indicator APIs
    └── trading/              # Trading execution APIs
```

### Backend Services
```
services/
├── market-data/
│   ├── AlpacaClient.ts      # Primary data source
│   ├── WebSocketManager.ts  # Real-time connections
│   └── DataValidator.ts     # Data quality checks
├── indicators/
│   ├── IndicatorService.ts  # Calculation engine
│   ├── CustomIndicators.ts  # User-defined algos
│   └── TechnicalAnalysis.ts # Pattern recognition
├── trading/
│   ├── OrderService.ts      # Order management
│   ├── RiskManager.ts       # Risk controls
│   └── ExecutionEngine.ts   # Trade execution
└── portfolio/
    ├── PositionTracker.ts   # Position management
    ├── PnLCalculator.ts     # P&L calculations
    └── ReportGenerator.ts   # Performance reports
```

## Security Architecture

### Authentication Flow
```
Client → JWT Token → API Gateway → Service Authorization
                        ↓
                   Rate Limiting → Request Processing
```

### Data Security
- **Encryption**: TLS 1.3 for all communications
- **API Keys**: Secure storage in environment variables
- **Database**: Encrypted at rest, SSL connections
- **Sessions**: Redis-based session management
- **CORS**: Strict origin validation

## Deployment Architecture

### Development Environment
```
Local Machine
├── Next.js Dev Server (3000)
├── Node.js API Server (8000)
├── Redis Container (6379)
├── PostgreSQL Container (5432)
└── WebSocket Server (8001)
```

### Production Environment
```
Load Balancer
├── Next.js App (Vercel/CloudFlare)
├── API Gateway Cluster (AWS/Railway)
├── Redis Cluster (AWS ElastiCache)
├── PostgreSQL (AWS RDS)
└── WebSocket Servers (Multiple instances)
```

## Performance Optimizations

### Frontend
- **Code splitting**: Lazy load chart components
- **Image optimization**: Next.js built-in optimization
- **Caching**: SWR for API responses
- **WebSocket pooling**: Shared connections across components

### Backend
- **Connection pooling**: Database and Redis connections
- **Horizontal scaling**: Multiple API server instances
- **CDN**: Static assets and chart data
- **Compression**: Gzip/Brotli for API responses

## Monitoring & Observability

### Metrics
- **Application**: Response times, error rates, throughput
- **Business**: Trading volume, user activity, P&L
- **Infrastructure**: CPU, memory, network usage
- **Real-time**: WebSocket connection health

### Logging
- **Structured logging**: JSON format with Winston
- **Correlation IDs**: Track requests across services
- **Error tracking**: Sentry for error monitoring
- **Audit trails**: Trading activity logging

This architecture provides a scalable, maintainable foundation for building a professional stock trading web application with real-time capabilities.