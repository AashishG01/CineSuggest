# CineSuggest - Netflix-Style Movie Streaming Web Application

A visually stunning, cinematic movie streaming web application built with React, featuring a premium UI/UX design inspired by Netflix.

## Features

- **Stunning Hero Banner**: Dynamic hero section with featured movies and gradient overlays
- **Movie Discovery**: Browse trending, popular, top-rated movies across multiple genres
- **User Authentication**: Secure login and signup functionality
- **Personal Watchlist**: Save and manage your favorite movies
- **Smooth Animations**: Premium transitions and micro-interactions throughout the app
- **Responsive Design**: Optimized for all screen sizes from mobile to desktop
- **Horizontal Scrolling**: Netflix-style movie rows with smooth scrolling

## Tech Stack

- **Frontend Framework**: React 18
- **Routing**: React Router DOM v7
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS with custom animations
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Build Tool**: Vite

## Prerequisites

Before you begin, ensure you have:

1. **Node.js** (version 16 or higher)
2. **TMDB API Key** - Get one free at [The Movie Database](https://www.themoviedb.org/settings/api)
3. **Backend API** - Set up your own backend server with the required endpoints (see below)

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd cinesuggest
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your credentials:
```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_BACKEND_URL=http://localhost:5000
```

5. Start the development server:
```bash
npm run dev
```

## Backend API Requirements

Your backend server should implement the following endpoints:

### Authentication
- `POST /api/auth/register` - Register a new user
  - Body: `{ name, email, password }`
  - Returns: `{ user, token }`

- `POST /api/auth/login` - Login existing user
  - Body: `{ email, password }`
  - Returns: `{ user, token }`

### Watchlist Management
- `GET /api/user/watchlist` - Get user's watchlist
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ watchlist: [] }`

- `POST /api/user/add` - Add movie to watchlist
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ movie }`
  - Returns: Success message

- `POST /api/user/remove` - Remove movie from watchlist
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ movieId }`
  - Returns: Success message

## Project Structure

```
src/
├── api/
│   ├── axios.js          # Axios instances configuration
│   └── requests.js       # TMDB API endpoints
├── app/
│   ├── features/
│   │   └── authSlice.js  # Authentication Redux slice
│   └── store.js          # Redux store configuration
├── components/
│   ├── Navbar.jsx        # Navigation bar component
│   ├── HeroBanner.jsx    # Hero banner with featured movie
│   ├── MovieRow.jsx      # Horizontal scrolling movie row
│   ├── MovieCard.jsx     # Individual movie card
│   └── ProtectedRoute.jsx # Route protection wrapper
├── pages/
│   ├── HomePage.jsx      # Main landing page
│   ├── LoginPage.jsx     # Login page
│   ├── SignupPage.jsx    # Registration page
│   └── MyListPage.jsx    # User's watchlist page
├── App.jsx               # Main app component with routing
├── main.jsx              # Application entry point
└── index.css             # Global styles and animations
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Key Features Breakdown

### Hero Banner
- Full-screen cinematic backdrop
- Dynamic content from trending movies
- Multi-layered gradient overlays
- Watchlist integration
- Smooth animations

### Movie Rows
- Horizontal scrolling with smooth navigation
- Left/right scroll buttons on hover
- Multiple genre categories
- Real-time watchlist status
- Lazy loading for optimal performance

### Movie Cards
- Hover effects with scale transformation
- Overlay with movie details
- Quick add/remove from watchlist
- Rating badges
- Play button interaction

### Authentication
- Beautiful glassmorphic design
- Form validation
- Password strength indicator
- Eye-catching error messages
- Secure token-based authentication

### Watchlist
- Grid layout with statistics
- Quick remove functionality
- Empty state with call-to-action
- Average rating calculation

## Design Philosophy

CineSuggest follows a premium, cinematic design approach with:

- **Dark Theme**: Deep blacks (#0a0a0a) for that cinema feel
- **Red Accent**: Vibrant red gradients for energy and action
- **Glass Morphism**: Frosted glass effects for modern aesthetics
- **Smooth Animations**: 300ms transitions on all interactions
- **Premium Typography**: Inter font family for clean readability
- **Micro-interactions**: Subtle hover states and button feedback
- **Responsive Layout**: Mobile-first approach with breakpoints

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Movie data provided by [The Movie Database (TMDB)](https://www.themoviedb.org/)
- Inspired by Netflix's user interface
- Icons by [Lucide](https://lucide.dev/)
