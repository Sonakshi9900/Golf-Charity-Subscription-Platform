import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { LogIn } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await signIn({ email, password });

            if (error) {
                if (error.message.includes('URL is required')) {
                    toast.error('Supabase not configured. Add .env keys to test Auth.');
                } else {
                    toast.error(error.message);
                }
            } else if (data?.user) {
                toast.success('Logged in successfully');
                navigate('/dashboard');
            }
        } catch (err) {
            toast.error('Failed to log in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container flex items-center justify-center animate-fade-in">
            <div className="card w-full" style={{ maxWidth: '450px' }}>
                <div className="text-center mb-6">
                    <div className="mx-auto flex justify-center items-center" style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', marginBottom: '1rem' }}>
                        <LogIn size={28} className="text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Welcome Back</h2>
                    <p className="text-muted text-sm mt-2">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            className="input"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group mb-6">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-muted">
                    Don't have an account? <Link to="/signup" className="text-primary" style={{ fontWeight: '500' }}>Sign Up</Link>
                </p>
                <p className="text-center mt-2 text-xs text-muted">
                    (Use <strong>admin@test.com</strong> for Admin permissions in Supabase)
                </p>
            </div>
        </div>
    );
}
