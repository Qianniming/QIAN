# WELL-LI Cases - Professional Protective Cases Website

A modern, full-stack web application for WELL-LI Plastic Products Co., Ltd., showcasing their professional protective cases and enabling customer inquiries.

## 🌟 Features

- **Modern React/Next.js Frontend** with responsive design
- **MongoDB Database** for data persistence
- **Email Integration** for customer inquiries
- **Product Catalog** with detailed specifications
- **Contact Forms** with validation and security
- **SEO Optimized** with meta tags and structured data
- **Docker Support** for easy deployment
- **Security Features** including rate limiting and input validation
- **Performance Optimized** with caching and lazy loading

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nanuk
   ```

2. **Copy environment file**
   ```bash
   cp .env.example .env.local
   ```

3. **Configure environment variables**
   Edit `.env.local` with your settings:
   ```env
   MONGODB_URI=mongodb://localhost:27017/wellLiCases
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ADMIN_EMAIL=admin@well-li.com
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Initialize database** (optional)
   ```bash
   npm run db:init
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🐳 Docker Deployment

### Development with Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Deployment

1. **Prepare environment**
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

2. **Deploy with script**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh deploy
   ```

3. **Monitor deployment**
   ```bash
   ./deploy.sh status
   ./deploy.sh health
   ```

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── common/           # Common components
│   ├── home/             # Home page components
│   ├── layout/           # Layout components
│   ├── products/         # Product components
│   └── seo/              # SEO components
├── lib/                  # Utility libraries
│   ├── mongodb.ts        # Database connection
│   ├── models.ts         # Data models
│   ├── cache.ts          # Caching utilities
│   └── error-handler.ts  # Error handling
└── scripts/              # Utility scripts
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `EMAIL_USER` | SMTP email username | Yes |
| `EMAIL_PASSWORD` | SMTP email password | Yes |
| `ADMIN_EMAIL` | Admin email for notifications | Yes |
| `NEXT_PUBLIC_SITE_URL` | Public site URL | Yes |
| `SECRET_KEY` | Application secret key | Recommended |

### Email Configuration

The application supports Gmail SMTP by default. To use Gmail:

1. Enable 2-factor authentication
2. Generate an app password
3. Use the app password in `EMAIL_PASSWORD`

For other email providers, update the SMTP settings in the API routes.

## 🛡️ Security Features

- **Input Validation** - Server and client-side validation
- **Rate Limiting** - API endpoint protection
- **CSRF Protection** - Cross-site request forgery prevention
- **SQL Injection Protection** - Parameterized queries
- **XSS Prevention** - Input sanitization
- **Security Headers** - Content Security Policy and others

## 📊 Performance

- **Caching** - In-memory and client-side caching
- **Image Optimization** - Next.js Image component
- **Code Splitting** - Automatic code splitting
- **Compression** - Gzip compression in production
- **CDN Ready** - Static asset optimization

## 🔍 SEO Features

- **Meta Tags** - Dynamic meta descriptions
- **Structured Data** - JSON-LD for search engines
- **Sitemap** - Automatic sitemap generation
- **Robots.txt** - Search engine directives
- **Open Graph** - Social media sharing

## 📝 API Endpoints

### Products
- `GET /api/products` - Get products with filtering
- `POST /api/products` - Create product (admin)

### Inquiries
- `POST /api/contact` - Submit contact form
- `POST /api/inquiries` - Submit product inquiry
- `GET /api/inquiries` - Get inquiries (admin)

### Health
- `GET /api/health` - Application health check

## 🧪 Testing

```bash
# Run development checks
npm run lint
npm run type-check

# Test API endpoints
curl http://localhost:3000/api/health
```

## 📈 Monitoring

The application includes monitoring setup with:

- **Prometheus** - Metrics collection
- **Grafana** - Visualization dashboards  
- **Loki** - Log aggregation
- **AlertManager** - Alert notifications

Start monitoring stack:
```bash
docker-compose -f monitoring.yml up -d
```

Access dashboards:
- Grafana: http://localhost:3001 (admin/admin)
- Prometheus: http://localhost:9090

## 🚀 Production Checklist

- [ ] Configure environment variables
- [ ] Set up SSL certificates
- [ ] Configure email settings
- [ ] Set up database backups
- [ ] Configure monitoring
- [ ] Test all forms and API endpoints
- [ ] Verify SEO meta tags
- [ ] Check mobile responsiveness
- [ ] Test error handling
- [ ] Verify security headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software for WELL-LI Plastic Products Co., Ltd.

## 🆘 Support

For technical support or questions:

- Email: dev@well-li.com
- Documentation: [Internal Wiki]
- Issues: [GitHub Issues]

## 📝 Changelog

### v1.0.0 (2024-01-XX)
- Initial release
- Product catalog
- Contact forms
- Admin dashboard
- Docker deployment
- Security features
- Performance optimization