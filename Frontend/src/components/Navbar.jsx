import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../app/features/authSlice';
import { Film, User, LogOut, List, Home, Search } from 'lucide-react';
// No need for useDebounce

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');

  // Effect for scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- MANUAL SEARCH LOGIC ---

  // Effect to clear the search bar if we navigate AWAY from search page
  useEffect(() => {
    if (location.pathname !== '/search') {
      if (searchQuery !== '') {
        setSearchQuery('');
      }
    }
  }, [location.pathname]); // Only depends on pathname

  // Handler for form submission (Enter key or button click)
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) { // Only navigate if there's a non-empty query
      navigate(`/search?query=${trimmedQuery}`);
    } else {
      // If search is submitted empty while on search page, navigate home
      if (location.pathname === '/search') {
        navigate('/');
      }
    }
  };

  // --- END OF MANUAL SEARCH LOGIC ---

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 mr-4">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/30">
              <Film className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-800 dark:text-white hidden sm:block">
              CineSuggest
            </span>
          </Link>

          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit} // Trigger search on submit
            className="relative w-full max-w-xs mx-4 hidden sm:flex items-center"
          >
            {/* Input field */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search..." // Shortened placeholder
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-transparent rounded-lg text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            {/* Visible Submit Button */}
            <button
              type="submit"
              className="ml-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex-shrink-0"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Desktop Navigation Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-4 flex-shrink-0 ml-4">
              <NavLink to="/" className={navLinkClass}> <Home className="w-5 h-5" /> Home </NavLink>
              <NavLink to="/mylist" className={navLinkClass}> <List className="w-5 h-5" /> My List </NavLink>
              <NavLink to="/my-lists" className={navLinkClass}> <List className="w-5 h-5" /> Custom Lists </NavLink>
            </div>
          )}

          {/* User Actions */}
          <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
            {isAuthenticated ? (
              <>
                 <div className="hidden md:flex items-center gap-2 text-slate-800 dark:text-white">
                  <User className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  <span className="font-medium text-sm">{user?.username || 'User'}</span>
                </div>
                <button onClick={handleLogout} className="..."> <LogOut className="w-4 h-4 md:hidden" /> <span className="hidden md:inline">Logout</span> </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                 <Link to="/login" className="..."> Sign In </Link>
                 <Link to="/signup" className="..."> Sign Up </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      {isAuthenticated && (
         <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around z-40">
           {/* Consider adding mobile search here */}
          <NavLink to="/" className={navLinkClass}> <Home className="w-6 h-6" /> </NavLink>
          <NavLink to="/mylist" className={navLinkClass}> <List className="w-6 h-6" /> </NavLink>
          <NavLink to="/my-lists" className={navLinkClass}> <List className="w-6 h-6" /> </NavLink>
          <button onClick={handleLogout} className="..."> <LogOut className="w-6 h-6" /> </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;