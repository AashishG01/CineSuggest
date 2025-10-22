import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // If the user is authenticated, redirect them away from the guest page (e.g., login)
  // to the home page.
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If not authenticated, render the child component (the login/signup page)
  return children;
};

export default GuestRoute;