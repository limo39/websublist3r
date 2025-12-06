# Sublist3r Web

Advanced subdomain enumeration tool with a modern web interface built with Next.js.

## Overview

Sublist3r Web is a web-based frontend for the popular Sublist3r subdomain enumeration tool. It provides a user-friendly interface for discovering subdomains, analyzing DNS records, and exporting results in multiple formats.

## Features

- 🔍 **Subdomain Discovery** - Enumerate subdomains using multiple search engines
- 📊 **Results Visualization** - Interactive graphs and tables for subdomain data
- 💾 **Multiple Export Formats** - Export results as JSON, CSV, or TXT
- ⚡ **Real-time Progress** - Live scan progress updates
- 🛡️ **Rate Limiting** - Built-in API rate limiting for responsible scanning
- 📜 **Scan History** - Track and review previous scans
- 🌐 **Domain Information** - WHOIS data and DNS information

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod schema validation
- **Caching**: Mock Redis (development)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL (for production)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd websublist3r
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/sublist3r"
NEXT_PUBLIC_WS_URL="http://localhost:3001"
```

4. Set up the database:
```bash
npx prisma migrate dev
```

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   └── scan/         # Scan endpoints
│   ├── components/       # React components
│   ├── lib/              # Utility functions and services
│   │   ├── database.ts   # Prisma client
│   │   ├── sublist3r.ts  # Subdomain scanning service
│   │   ├── types.ts      # TypeScript interfaces
│   │   ├── utils.ts      # Validation utilities
│   │   ├── rate-limiter.ts
│   │   └── redis.ts      # Mock Redis
│   ├── prisma/           # Database schema
│   ├── page.tsx          # Main page
│   └── layout.tsx        # Root layout
├── public/               # Static assets
├── next.config.ts        # Next.js configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies
```

## API Endpoints

### POST /api/scan
Start a new subdomain scan.

**Request:**
```json
{
  "domain": "example.com",
  "options": {
    "engines": ["google", "bing"],
    "ports": [80, 443],
    "threads": 10,
    "enableBruteforce": false
  }
}
```

**Response:**
```json
{
  "scanId": "scan_1234567890_abc123",
  "domain": "example.com",
  "status": "pending",
  "estimatedTime": "2-5 minutes"
}
```

### GET /api/scan/:scanId
Get scan results and status.

### GET /api/scan
List all scans with pagination.

## Configuration

### Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_WS_URL` - WebSocket server URL (optional)

### Next.js Config

The project uses Turbopack for faster builds and includes:
- CORS headers for API routes
- Server-side external packages configuration
- TypeScript strict mode

## Database Schema

### ScanResult
- `id` - Unique identifier
- `scanId` - Scan reference ID
- `domain` - Target domain
- `subdomains` - JSON array of discovered subdomains
- `status` - Scan status (pending, running, completed, failed)
- `scanOptions` - Scan configuration
- `subdomainCount` - Number of discovered subdomains
- `createdAt` - Scan start time
- `completedAt` - Scan completion time

### DomainHistory
- `id` - Unique identifier
- `domain` - Domain name
- `scanId` - Associated scan ID
- `timestamp` - Record timestamp

### User
- `id` - Unique identifier
- `email` - User email
- `apiKey` - API authentication key
- `createdAt` - Account creation time

## Development Notes

### Current Limitations

1. **Database**: Requires PostgreSQL setup for full functionality
2. **Python Integration**: Sublist3r Python package not yet integrated (using mock DNS lookups)
3. **WebSocket**: Real-time updates not yet implemented

### Future Enhancements

- [ ] Full Python Sublist3r integration
- [ ] WebSocket support for real-time updates
- [ ] User authentication and API keys
- [ ] Advanced filtering and search
- [ ] Batch scanning
- [ ] Email notifications
- [ ] API documentation UI

## Troubleshooting

### Dev Server Won't Start
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

### Database Connection Issues
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env.local`
- Run migrations: `npx prisma migrate dev`

### Import Errors
- Verify path aliases in `tsconfig.json`
- Clear TypeScript cache: `rm -rf .next`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This tool is for authorized security testing only. Unauthorized access to computer systems is illegal. Always obtain proper authorization before scanning domains you don't own.

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Sublist3r GitHub](https://github.com/aboul3la/Sublist3r)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
