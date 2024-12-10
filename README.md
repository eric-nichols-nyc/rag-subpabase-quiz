# RAG Quiz Generator

An AI-powered quiz generation application built with Next.js, Supabase, and Clerk authentication. This application allows users to create custom quizzes from various content sources including PDFs, text, and URLs.

## Features

- 📝 Generate quizzes from multiple content sources:
  - PDF documents
  - Plain text
  - URLs
- 🔐 Secure authentication with Clerk
- 💾 Data persistence with Supabase
- 🎯 Interactive quiz taking experience
- 📊 Immediate feedback and explanations
- 📱 Responsive design
- 🔄 Real-time updates

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Backend**: Next.js API Routes
- **Database**: Supabase
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Type Safety**: TypeScript

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account and project
- A Clerk account and project
- Environment variables configured (see below)

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rag-supabase-quiz.git
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── actions/        # Server actions
├── app/           # Next.js app router pages
├── components/    # React components
├── config/        # Configuration files
├── lib/          # Utility functions and setup
├── types/        # TypeScript type definitions
└── utils/        # Helper functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
