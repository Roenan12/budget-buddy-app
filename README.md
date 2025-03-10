# Budget Buddy

A modern, user-friendly financial management application built to help you track your budgets and expenses effectively.

🔗 **[Live Demo](https://budget-buddy-app-roenan.vercel.app)** | Deployed on [Vercel](https://vercel.com)

## 📸 Preview

- ![Dashboard Preview](/public/screenshots/dashboard.png)
- ![Budget Management](/public/screenshots/budgets.png)
- ![Expense Tracking](/public/screenshots/expenses.png)

## 🌟 Features

- **Dashboard Overview**: Get a quick snapshot of your financial analytics with interactive charts and statistics
- **Budget Management**: Create, track, and manage multiple budgets across different categories
- **Expense Tracking**: Log and monitor your expenses with detailed categorization
- **Real-time Analytics**: Visual representation of your spending patterns and budget utilization
- **Responsive Design**: Seamless experience across desktop and mobile devices
- **User Authentication**: Secure sign-in and sign-up functionality
- **Profile Management**: Update user information and profile picture
- **Search & Filtering**: Easy-to-use search filtering for both budgets and expenses
- **Pagination**: Efficient handling of large datasets with customizable page sizes
- **Dark/Light Theme**: Support for system and user-preferred color themes

## 🛠️ Technologies Used

### Frontend

- [Next.js 14](https://nextjs.org/) - React framework for production
- [React](https://reactjs.org/) - JavaScript library for user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Static type checking
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - Re-usable components
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [Recharts](https://recharts.org/) - Composable charting library
- [Lucide Icons](https://lucide.dev/) - Beautiful open-source icons

### Development Environment

- [Cursor](https://cursor.sh/) - AI-powered code editor for development assistance
- v0 - Initial frontend setup and core components implementation

### Form Management & Validation

- [React Hook Form](https://react-hook-form.com/) - Performant form management
- [Zod](https://zod.dev/) - TypeScript-first schema validation
- [@hookform/resolvers](https://github.com/react-hook-form/resolvers) - Zod integration for React Hook Form

### Authentication & Data Management

- [NextAuth.js](https://next-auth.js.org/) - Authentication solution
- [Supabase](https://supabase.com/) - Backend and database platform
- Server-side data fetching with Next.js API routes

### Development Tools

- ESLint - Code linting
- Prettier - Code formatting

## 🚀 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/Roenan12/budget-buddy-app.git
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Configure environment variables:

```bash
cp .env.example .env
```

Then update the `.env` file with your own url and keys.

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📱 Application Structure

- `/app` - Next.js 14 app directory containing all routes and layouts
- `/components` - Reusable React components
- `/lib` - Utility functions, hooks, and services
- `/config` - Application configuration files
- `/styles` - Global styles and Tailwind CSS configuration
- `/public` - Static assets

## 🔄 Future Improvements

### Features

- Bulk actions (multiple deletion for budgets and expenses)
- Import/Export data through CSV files
- Multi-currency support

### Technical

- Testing setup (Jest, React Testing Library)
- Server-side caching optimization
- Route handlers optimization
- Mobile app with React Native
- Enhance security and authentication (2FA, rate limiting, password reset)
- Automated CI/CD pipeline

## 📄 License [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
