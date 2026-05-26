import * as React from 'react';
import { useState, useEffect } from 'react'; // Added useEffect import
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import RegisterModal from './RegisterModal';

// Simple Google "G" SVG icon
function GoogleIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [error, setError] = useState('');
    const [resetEmail, setResetEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState('');

    // Handle registration modal event
    useEffect(() => {
        const handleOpenModal = () => setShowRegisterModal(true);
        window.addEventListener('openRegisterModal', handleOpenModal);
        return () => window.removeEventListener('openRegisterModal', handleOpenModal);
    }, []); // Empty dependency array is fine here

    // Clear success message after 5 seconds
    useEffect(() => {
        if (registrationSuccess) {
            const timer = setTimeout(() => setRegistrationSuccess(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [registrationSuccess]);

    // --- sanitisation functions ---
    const sanitizeUsername = (input) => {
        return input.trim().replace(/[<>]/g, '');
    };

    const validateUsername = (user) => {
        const trimmed = user.trim();
        return trimmed.length >= 3 && trimmed.length <= 20 && /^[a-zA-Z0-9_]+$/.test(trimmed);
    };

    const validatePassword = (pass) => {
        return pass.length >= 6;
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.trim());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Password reset flow
        if (isReset) {
            const safeEmail = resetEmail.trim().toLowerCase();
            if (!validateEmail(safeEmail)) {
                setError('Please enter a valid email address');
                return;
            }
            alert(`Password reset link sent to "${safeEmail}"`);
            setResetEmail('');
            setIsReset(false);
            return;
        }

        // Login flow
        const safeUsername = sanitizeUsername(username);
        const safePassword = password.trim();

        if (!validateUsername(safeUsername)) {
            setError('Username must be 3-20 alphanumeric characters (underscore allowed)');
            return;
        }
        if (!validatePassword(safePassword)) {
            setError('Password must be at least 6 characters');
            return;
        }

        // Rate limiting (client side)
        if (attempts >= 5) {
            setError('Too many failed attempts. Please wait 5 minutes.');
            setTimeout(() => setAttempts(0), 300000);
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/v1/auth/login', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: safeUsername, password: safePassword })
            });

            const data = await res.json();

            if (!res.ok) {
                setAttempts(prev => prev + 1);
                setError(data.error || data.message || 'Invalid credentials');
                return;
            }

            // Verify session
            const meRes = await fetch('/api/v1/auth/me', { credentials: 'include' });
            if (!meRes.ok) {
                setError('Authentication failed. Please try again.');
                return;
            }

            navigate('/dashboard');

        } catch (err) {
            setError(err?.message || 'Server error');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        // Use the default tenant
        const tenantParam = 'landscapes_integrity_solutions';
        console.log('[Login] Starting Google auth with tenant:', tenantParam);
        window.location.href = `/api/v1/auth/google?tenant=${encodeURIComponent(tenantParam)}`;
    };

    const handleMasterGoogleLogin = () => {
        window.location.href = '/api/v1/auth/master/google';
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-950">
            <div className="w-full max-w-md">
                {/* Logo + Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-500 shadow-lg mb-4">
                        <LogIn size={28} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {isReset ? 'Reset Password' : 'Welcome Back'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {isReset 
                            ? 'Enter your email to receive a reset link' 
                            : 'Sign in to access the admin dashboard'}
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
                    {/* Success message for registration */}
                    {registrationSuccess && (
                        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                            <p className="text-green-600 dark:text-green-400 text-sm text-center">{registrationSuccess}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {isReset ? (
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        placeholder="admin@example.com"
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                        <input
                                            type="text"
                                            required
                                            value={username}
                                            onChange={(e) => { setUsername(e.target.value); setError(''); setAttempts(0); }}
                                            placeholder="admin"
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-12 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-2.5 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : (isReset ? 'Send Reset Link' : 'Sign In')}
                        </button>
                    </form>

                    {!isReset && (
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white dark:bg-gray-900 px-4 text-gray-500 dark:text-gray-400">Or continue with</span>
                                </div>
                            </div>

                            <button
                                onClick={handleGoogleLogin}
                                className="mt-4 w-full py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-3"
                            >
                                <GoogleIcon />
                                Google
                            </button>
                            <button
                                onClick={handleMasterGoogleLogin}
                                className="mt-2 w-full py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-3"
                            >
                                <GoogleIcon /> Master Login
                            </button>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => { setIsReset(!isReset); setError(''); setResetEmail(''); }}
                            className="text-sm text-accent-600 dark:text-accent-400 hover:underline font-medium"
                        >
                            {isReset ? 'Back to Login' : 'Forgot Password?'}
                        </button>
                    </div>

                    {/* Request Access Link */}
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <button
                                onClick={() => {
                                    setShowRegisterModal(true);
                                }}
                                className="text-accent-600 dark:text-accent-400 hover:underline font-medium"
                            >
                                Request access
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            {/* Registration Modal */}
            <RegisterModal 
                isOpen={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                onSuccess={(message) => {
                    setRegistrationSuccess(message || 'Registration request submitted! Please check your email for approval status.');
                    setShowRegisterModal(false);
                }}
            />
        </div>
    );
}