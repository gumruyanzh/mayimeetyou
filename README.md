# MayIMeetYou.io

A simple, fun, viral-friendly web app where users get a personal link that asks visitors "May I meet you?" with Yes/No buttons.

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS (mobile-first)
- **Database:** SQLite + Prisma (can be swapped for PostgreSQL)
- **Auth:** Custom JWT-based authentication with HTTP-only cookies
- **Deployment:** Vercel-ready

## Features

- Personal shareable links (`/username`)
- Email/password authentication
- User dashboard with profile editor
- Social links integration (Instagram, Twitter, LinkedIn, etc.)
- Basic analytics (visits, yes clicks, no clicks)
- Mobile-first responsive design
- WebView-friendly architecture

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and update the values:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-change-this-in-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Important:** Generate a strong random string for `JWT_SECRET` in production!

### 3. Set Up the Database

Generate Prisma client and create the database:

```bash
npm run db:generate
npm run db:push
```

This will:
- Generate the Prisma client
- Create the SQLite database file at `prisma/dev.db`
- Apply the schema to the database

### 4. Start the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create a new migration
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Project Structure

```
mayimeetyou/
├── app/
│   ├── api/
│   │   ├── auth/           # Authentication endpoints
│   │   └── profile/        # Profile and analytics endpoints
│   ├── auth/
│   │   ├── login/          # Login page
│   │   └── signup/         # Signup page
│   ├── dashboard/          # User dashboard
│   ├── [username]/         # Public profile pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── components/
│   ├── Navbar.tsx          # Navigation bar
│   └── Footer.tsx          # Footer
├── lib/
│   ├── auth.ts             # Authentication utilities
│   └── prisma.ts           # Prisma client
├── prisma/
│   └── schema.prisma       # Database schema
└── middleware.ts           # Route protection
```

## How to Use

### 1. Create an Account

1. Visit [http://localhost:3000](http://localhost:3000)
2. Click "Create My Link"
3. Fill in your details (name, email, username, password)
4. Click "Sign up"

### 2. Configure Your Profile

After signing up, you'll be redirected to the dashboard where you can:

- Copy your personal link
- View analytics (visits, yes/no clicks)
- Edit your profile info (name, tagline, avatar)
- Add social links (Instagram, Twitter, LinkedIn, website)
- Set contact email and calendar link
- Customize your messages (thank you message, rejection message)

### 3. Share Your Link

Share your link `http://localhost:3000/yourusername` anywhere:
- Social media bios
- Email signatures
- Business cards
- Direct messages

### 4. Track Analytics

Visit your dashboard to see:
- Total profile visits
- Number of "Yes" clicks
- Number of "No" clicks

## Switching to PostgreSQL

To use PostgreSQL instead of SQLite:

1. Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Update `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mayimeetyou"
```

3. Run migrations:

```bash
npm run db:migrate
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Set environment variables in Vercel:
   - `DATABASE_URL` - Your production database URL
   - `JWT_SECRET` - A secure random string
   - `NEXT_PUBLIC_APP_URL` - Your production URL
4. Deploy!

**Note:** You'll need to use PostgreSQL for production as Vercel doesn't support SQLite in production.

## Key Implementation Details

### Authentication

- Uses JWT tokens stored in HTTP-only cookies
- Passwords are hashed with bcrypt
- Protected routes use Next.js middleware
- Session management with `/api/auth/session`

### Analytics

- Page visits tracked on profile page load
- Yes/No clicks tracked via API endpoints
- All analytics stored in the Profile table
- Real-time updates in dashboard

### Mobile-First Design

- Responsive layouts using Tailwind CSS
- Touch-friendly button sizes
- Single-column layouts on mobile
- Optimized for small screens (375px+)

### WebView Compatibility

- No browser-specific APIs
- Simple URL-based navigation
- No intrusive popups
- Clean, minimal UI

## Future Enhancements

- Image upload for avatars
- Custom themes and colors
- Advanced analytics with charts
- Email notifications
- QR code generation
- Custom domains
- OAuth social login

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
