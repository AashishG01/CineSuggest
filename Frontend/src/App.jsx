import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import WatchList from './pages/WatchList.jsx';
import SearchPage from './pages/SearchPage.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import MovieDetailPage from './pages/MovieDetailPage.jsx';
import MyListsPage from './pages/MyListsPage';
import ListPageDetail from './pages/ListPageDetail';

function App() {
  return (
    <Router>
      <Navbar />
      
      <main>
        <Routes>
          {/* --- Public Routes (Accessible to everyone) --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} /> {/* <-- 2. Add the new route here */}
          <Route path="/movie/:imdbID" element={<MovieDetailPage />} />

          {/* --- Guest Routes (Only for non-logged-in users) --- */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestRoute>
                <SignupPage />
              </GuestRoute>
            }
          />
          
          {/* --- Protected Routes (Only for logged-in users) --- */}
          <Route
            path="/mylist"
            element={
              <ProtectedRoute>
                <WatchList />
              </ProtectedRoute>
            }
          />

          <Route // <-- 2. Add route for custom lists management page
            path="/my-lists"
            element={
              <ProtectedRoute>
                <MyListsPage />
              </ProtectedRoute>
            }
          />

          <Route // <-- 2. Add route for viewing a specific list detail page
            path="/list/:listId"
            element={
              <ProtectedRoute>
                <ListPageDetail />
              </ProtectedRoute>
            }
          />
          {/* We'll add the route for viewing a specific list later */}
           {/* <Route path="/list/:listId" element={ <ProtectedRoute> <ListPageDetail /> </ProtectedRoute> } /> */}

          {/* Catch-all route to redirect unknown paths to the homepage */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;