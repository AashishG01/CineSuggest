import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../app/features/authSlice'; // LOGIC CHANGE: Import the async thunk
import { Film, Mail, Lock, AlertCircle, Eye, EyeOff, Loader } from 'lucide-react';

const LoginPage = () => {
    // UI state remains in the component
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // LOGIC CHANGE: Get loading status and errors from the Redux store
    const { isAuthenticated, status, error } = useSelector((state) => state.auth);

    // LOGIC CHANGE: useEffect to redirect on successful login
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/'); // Redirect to homepage if user is authenticated
        }
    }, [isAuthenticated, navigate]);

    // LOGIC CHANGE: handleSubmit now dispatches the async thunk
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    return (
        // DESIGN CHANGE: Switched to our theme-aware background
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center px-4 py-12">
            <div className="relative w-full max-w-md">
                {/* DESIGN CHANGE: Logo updated with indigo accent */}
                <Link to="/" className="flex items-center justify-center mb-8">
                    <div className="bg-indigo-600 p-3 rounded-xl shadow-2xl shadow-indigo-500/40">
                        <Film className="w-10 h-10 text-white" />
                    </div>
                    <span className="ml-3 text-4xl font-bold text-slate-800 dark:text-white">
                        CineSuggest
                    </span>
                </Link>

                {/* DESIGN CHANGE: Themed card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 md:p-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Welcome Back</h1>
                        <p className="text-slate-600 dark:text-slate-400">Sign in to continue your cinematic journey.</p>
                    </div>

                    {/* LOGIC CHANGE: Display error from Redux state */}
                    {status === 'failed' && error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* DESIGN CHANGE: Themed input fields */}
                        <div>
                            <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-300"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-300"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors duration-300">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* DESIGN CHANGE: Themed submit button */}
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/40"
                        >
                            {status === 'loading' ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <Loader className="w-5 h-5 animate-spin" />
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="text-center my-6">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            New to CineSuggest?{' '}
                            <Link to="/signup" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;