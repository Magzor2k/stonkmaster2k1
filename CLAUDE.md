# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StonkMaster2K1 is a stock trading web application built with modern technologies for real-time trading, charting, and technical analysis.

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ with TypeScript
- **Charting**: TradingView Lightweight Charts (45KB canvas-based)
- **Styling**: Tailwind CSS
- **State Management**: Zustand + SWR for server state
- **Real-time**: Custom WebSocket hooks

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **WebSockets**: Socket.io
- **Database**: PostgreSQL (user data) + Redis (real-time cache)
- **Indicators**: trading-signals library for technical analysis

### Data Provider
- **Primary**: Alpaca Markets API (200 API calls/min free tier)
- **WebSocket**: Real-time price streaming with sub-second latency
- **Backup**: EODHD for redundancy

## Architecture Pattern

The application follows a microservices architecture with clear separation of concerns:

```
Client Layer (Next.js) → API Gateway (Express) → Microservices → Data Layer
```

### Core Services
- **Market Data Service**: Price streams, WebSocket management, data validation
- **Indicator Service**: SMA, EMA, RSI, MACD, Bollinger Bands, custom algorithms
- **Trading Engine**: Order management, risk checks, execution
- **Portfolio Service**: P&L tracking, metrics, reports

## Real-Time Data Flow

```
Alpaca WebSocket → Redis Pub/Sub → Socket.io → Client
                      ↓
                 Indicator Service → Chart Updates
```

## Project Structure

The codebase follows Next.js App Router conventions:

```
app/
├── dashboard/              # Main trading dashboard
├── charts/[symbol]/        # Individual chart views  
├── api/                    # Backend API routes
│   ├── auth/              # Authentication endpoints
│   ├── market-data/       # Market data proxy
│   ├── indicators/        # Custom indicator APIs
│   └── trading/           # Trading execution APIs
components/
├── charts/                # Chart components (TradingChart, DrawingTools)
├── trading/               # Trading interface (OrderPanel, IndicatorPanel)
└── ui/                    # Reusable UI components
services/
├── market-data/           # AlpacaClient, WebSocketManager, DataValidator
├── indicators/            # IndicatorService, CustomIndicators, TechnicalAnalysis
├── trading/               # OrderService, RiskManager, ExecutionEngine
└── portfolio/             # PositionTracker, PnLCalculator, ReportGenerator
```

## Development Environment Setup

### Local Development Ports
- Next.js Dev Server: 3000
- Node.js API Server: 8000
- WebSocket Server: 8001
- Redis Container: 6379
- PostgreSQL Container: 5432

### Key Development Considerations

- **Financial Accuracy**: Use arbitrary precision arithmetic for all financial calculations
- **Real-time Performance**: Canvas-based rendering for high-frequency data updates
- **WebSocket Management**: Shared connections across components to avoid rate limits
- **Security**: TLS 1.3, JWT tokens, encrypted database connections
- **Monitoring**: Structured logging with correlation IDs for trading activity audit trails

## Performance Optimizations

- Code splitting for chart components (lazy loading)
- WebSocket connection pooling
- Redis caching for real-time market data
- Connection pooling for database operations
- Horizontal scaling support for API servers

Note: This project is currently in the planning/documentation phase. The actual implementation will follow the architectural decisions documented in `docs/context/`.