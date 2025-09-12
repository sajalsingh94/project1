# Welcome to your EzSite project

A clean, modern React template with TypeScript, Vite, TailwindCSS, and ShadCN UI components. This template provides a solid foundation for building web applications with best practices in mind.

## Tech Features

- ⚡️ **Vite** - Lightning fast build tool
- 🔥 **React 18** - Latest React features
- 🧩 **TypeScript** - Type safety for better developer experience
- 🎨 **TailwindCSS** - Utility-first CSS framework
- 🧰 **ShadCN UI** - Accessible and customizable UI components
- 📱 **Responsive Design** - Mobile-first approach
- 🧭 **React Router** - Easy client-side routing
- 🔄 **React Query** - Data fetching and state management
- 🧪 **Form Handling** - React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm

### Installation

1. Clone this repository:
```bash
git clone https://github.com/your-username/react-template-project.git
cd react-template-project
```

2. Install dependencies:
```bash
npm install
# or
yarn
# or
pnpm install
```

3. Create a .env file (see .env.example):
```
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open your browser and visit `http://localhost:5173`

## Environment variables

Required in production:
- `JWT_SECRET`
- `REFRESH_TOKEN_SECRET`

Optional:
- `MONGODB_URI`, `MONGODB_DB`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` (for password reset and email verification)
- `APP_BASE_URL` (used to build action links in emails)

## Auth notes

- Access token expires in 15 minutes and is returned on login as `data.token`.
- Refresh token is an HttpOnly cookie (`refresh_token`), Secure, SameSite=Lax.
- `POST /api/auth/refresh` rotates and returns a new access token.
- `POST /api/auth/logout` clears the refresh cookie.
- Password reset: `POST /api/auth/forgot-password`, then `POST /api/auth/reset-password/:token`.
- Email verification: link sent on register; verify via `GET /api/auth/verify-email/:token`.

## Project Structure

```
react-template-project/
├── public/              # Static assets
│   ├── components/      # Reusable components
│   │   └── ui/          # UI components from ShadCN
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and libraries
│   ├── pages/           # Page components
│   ├── App.tsx          # Main application component
│   ├── index.css        # Global styles
│   └── main.tsx         # Application entry point
├── .gitignore
├── package.json         # Project dependencies and scripts
├── tailwind.config.ts   # TailwindCSS configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## Customization

- **Styling**: Modify `tailwind.config.ts` to customize your design tokens
- **Components**: Add or modify components in the `src/components` directory
- **Pages**: Create new pages in the `src/pages` directory
- **Routing**: Update routes in `src/App.tsx`

## Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The built files will be in the `dist` directory, ready to be deployed.
