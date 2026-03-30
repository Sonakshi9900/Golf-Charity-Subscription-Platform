import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [charity, setCharity] = useState('Cancer Foundation');
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create user in Auth
            const { data: authData, error: authError } = await signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        charity_selected: charity
                    }
                }
            });

            if (authError) throw authError;

            // Note: Ideally, a Postgres function running via trigger creates the profile row 
            // when Auth signs up. However, since many won't set up triggers, we try to manually insert:
            if (authData?.user) {
                try {
                    // Dummy subscription logic (free month)
                    await supabase.from('subscriptions').insert([{
                        user_id: authData.user.id,
                        plan_type: 'monthly',
                        status: 'active'
                    }]);
                } catch (subErr) {
                    console.error("Subscription insert failed (expected if tables missing)", subErr);
                }

                toast.success('Account created successfully');
                navigate('/dashboard');
            }
        } catch (err) {
            if (err.message?.includes('URL is required')) {
                toast.error('Supabase not configured. Please add keys to .env file.');
            } else {
                toast.error(err.message || 'Failed to sign up');
            }
        } finally {
            setLoading(false);
        }
    };

    const charities = [
        'Cancer Foundation',
        'Global Education Fund',
        'Green Earth Initiative',
        'Save The Children Ocean',
        'Red Cross Local'
    ];

    return (
        <div className="page-container flex items-center justify-center animate-fade-in" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
            <div className="card w-full" style={{ maxWidth: '500px' }}>
                <div className="text-center mb-6">
                    <div className="mx-auto flex justify-center items-center" style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(124, 58, 237, 0.1)', marginBottom: '1rem' }}>
                        <UserPlus size={28} className="text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Create Account</h2>
                    <p className="text-muted text-sm mt-2">Join to play and support charities</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            className="input"
                            placeholder="Enter your name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>

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

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="input"
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="6"
                        />
                    </div>

                    <div className="form-group mb-6">
                        <label className="form-label" htmlFor="charity">Select a Charity for Donations</label>
                        <select
                            id="charity"
                            className="select"
                            value={charity}
                            onChange={(e) => setCharity(e.target.value)}
                        >
                            {charities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <p className="text-xs text-muted mt-2">10% of your subscription goes to this charity automatically.</p>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-muted">
                    Already have an account? <Link to="/login" className="text-primary" style={{ fontWeight: '500' }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
}
