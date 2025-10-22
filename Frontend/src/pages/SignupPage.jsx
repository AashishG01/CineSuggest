import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { registerUser } from '../app/features/authSlice';
import { Film, Mail, Lock, User, AlertCircle, Eye, EyeOff, CheckCircle, Loader } from 'lucide-react';

const SignupPage = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [clientError, setClientError] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { status, error: apiError } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setClientError('Passwords do not match');
            return false;
        }
        if (formData.password.length < 6) {
            setClientError('Password must be at least 6 characters long');
            return false;
        }
        setClientError('');
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        dispatch(registerUser({ username: formData.username, email: formData.email, password: formData.password }))
            .then(unwrapResult)
            .then(() => {
                setSuccessMessage('Account created! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            })
            .catch((err) => console.error("Registration failed:", err));
    };
    
    // Your great password strength logic, now with themed colors
    const passwordStrength = () => {
        const password = formData.password;
        if (password.length === 0) return null;
        if (password.length < 6) return { label: 'Weak', color: 'bg-red-500', textColor: 'text-red-500' };
        if (password.length < 10) return { label: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-500' };
        return { label: 'Strong', color: 'bg-green-500', textColor: 'text-green-500' };
    };
    const strength = passwordStrength();

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center px-4 py-12">
            <div className="relative w-full max-w-md">
                <Link to="/" className="flex items-center justify-center mb-8">
                    <div className="bg-indigo-600 p-3 rounded-xl shadow-2xl shadow-indigo-500/40">
                        <Film className="w-10 h-10 text-white" />
                    </div>
                    <span className="ml-3 text-4xl font-bold text-slate-800 dark:text-white">CineSuggest</span>
                </Link>

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 md:p-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Create an Account</h1>
                        <p className="text-slate-600 dark:text-slate-400">Start your cinematic journey today.</p>
                    </div>

                    {(apiError || clientError) && status === 'failed' && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-red-600 dark:text-red-400 text-sm">{clientError || apiError}</p>
                        </div>
                    )}
                    {successMessage && (
                         <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <p className="text-green-600 dark:text-green-400 text-sm">{successMessage}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">Username</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                                <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30" placeholder="johndoe" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30" placeholder="you@example.com" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} className="w-full pl-12 pr-12 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30" placeholder="Create a password" required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"><EyeOff className="w-5 h-5" /></button>
                            </div>
                            {strength && (
                                <div className="mt-2">
                                    <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`}></div>
                                    </div>
                                    <p className={`text-xs mt-1 font-medium ${strength.textColor}`}>{strength.label} password</p>
                                </div>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                                <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full pl-12 pr-12 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30" placeholder="Confirm your password" required />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"><EyeOff className="w-5 h-5" /></button>
                            </div>
                            {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                <div className="flex items-center space-x-1 mt-2 text-green-600 dark:text-green-500 text-xs font-medium">
                                    <CheckCircle className="w-3 h-3" />
                                    <span>Passwords match</span>
                                </div>
                            )}
                        </div>

                        <button type="submit" disabled={status === 'loading' || successMessage} className="w-full pt-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/40">
                             {status === 'loading' ? ( <div className="flex items-center justify-center"><Loader className="w-5 h-5 animate-spin" /></div> ) : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-8">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;