# StonkMaster2K1 🚀

A professional-grade stock trading platform with real-time data, advanced charting, and intelligent technical analysis.

## Features

- **Real-time Market Data**: Live price streaming with sub-second latency via Alpaca Markets API
- **Advanced Charting**: TradingView Lightweight Charts with professional drawing tools
- **Technical Analysis**: 15+ built-in indicators including SMA, EMA, RSI, MACD, Bollinger Bands
- **Order Management**: Market, limit, and stop orders with risk management
- **Portfolio Tracking**: Real-time P&L, position management, and performance analytics
- **WebSocket Integration**: Real-time data streaming and order updates

## Tech Stack

### Frontend
- **Next.js 14** with TypeScript and App Router
- **TradingView Lightweight Charts** for high-performance charting
- **Tailwind CSS** for modern, responsive UI
- **Zustand** for state management
- **SWR** for server state synchronization

### Backend
- **Node.js** with TypeScript
- **Express.js** API server
- **Socket.io** for WebSocket connections
- **Redis** for real-time data caching
- **PostgreSQL** for persistent storage
- **Alpaca Markets API** for market data and trading

### Technical Indicators
- **trading-signals** library for technical analysis
- Custom indicator implementations
- Real-time signal generation

## Getting Started

### Prerequisites

- Node.js 18+
- Redis server
- PostgreSQL database
- Alpaca Markets account (paper trading supported)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Magzor2k/stonkmaster2k1.git
   cd stonkmaster2k1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Redis and PostgreSQL**
   ```bash
   # Using Docker
   docker run -d -p 6379:6379 redis:alpine
   docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:alpine
   ```

5. **Run the development servers**
   ```bash
   # Start the backend API server
   npm run server:dev

   # Start the Next.js development server (in another terminal)
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## Configuration

### Alpaca Markets Setup

1. Create an account at [Alpaca Markets](https://alpaca.markets/)
2. Generate API keys (paper trading recommended for testing)
3. Add your credentials to `.env`:
   ```
   ALPACA_API_KEY=your_api_key
   ALPACA_API_SECRET=your_api_secret
   ALPACA_PAPER=true
   ```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ALPACA_API_KEY` | Alpaca API key | - |
| `ALPACA_API_SECRET` | Alpaca API secret | - |
| `ALPACA_PAPER` | Use paper trading | `true` |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `PORT` | API server port | `8000` |
| `WS_PORT` | WebSocket server port | `8001` |
| `JWT_SECRET` | JWT signing secret | - |

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │  Express API    │    │  Market Data    │
│                 │───▶│                 │───▶│     Service     │
│  - Dashboard    │    │  - REST API     │    │                 │
│  - Charts       │    │  - WebSocket    │    │  - Alpaca API   │
│  - Trading UI   │    │  - Auth         │    │  - Real-time    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   WebSocket     │    │     Redis       │    │   PostgreSQL    │
│  Connection     │    │   (Cache)       │    │  (Persistence)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## API Endpoints

### Market Data
- `GET /api/market-data/quote/:symbol` - Get latest quote
- `GET /api/market-data/bars/:symbol` - Get historical bars
- `GET /api/market-data/watchlist` - Get watchlist quotes

### Trading
- `POST /api/trading/orders` - Place order
- `GET /api/trading/orders` - Get orders
- `DELETE /api/trading/orders/:id` - Cancel order
- `GET /api/trading/positions` - Get positions
- `GET /api/trading/portfolio` - Get portfolio summary

### Technical Indicators
- `GET /api/indicators/:symbol` - Get indicator values
- `POST /api/indicators/:symbol/signals` - Get trading signals

## Development

### Scripts

```bash
npm run dev          # Start Next.js development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript compiler

npm run server:dev   # Start backend development server
npm run server:build # Build backend for production
npm run server:start # Start production backend server
```

### Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Trading dashboard
│   ├── charts/           # Chart pages
│   └── api/              # API route handlers
├── components/           # React components
│   ├── charts/          # Chart components
│   ├── trading/         # Trading interface
│   └── ui/              # Reusable UI components
├── server/              # Backend server
│   ├── routes/         # Express routes
│   ├── services/       # Business logic
│   └── websocket/      # WebSocket handling
├── services/           # Client-side services
├── types/              # TypeScript type definitions
└── lib/                # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Disclaimer

This software is for educational and demonstration purposes only. Real money trading involves substantial risk. Always conduct thorough testing with paper trading before using real funds.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using Next.js, TypeScript, and the power of modern financial APIs**