import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, Target, LayoutDashboard, HeartHandshake, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="page-container animate-fade-in">
            <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
                <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Play Golf, Win Big, <br />
                        <span className="gradient-text">Change Lives</span>
                    </h1>
                    <p className="text-lg text-muted mb-8 font-light" style={{ lineHeight: 1.6 }}>
                        Join our exclusive community of golfers. Submit your latest scores, participate in our monthly charity draws, win amazing rewards, and support incredible causes—all with one powerful platform.
                    </p>
                    <div className="flex justify-center gap-4">
                        {user ? (
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/dashboard')}
                                style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
                            >
                                Go to Dashboard <ArrowRight size={20} />
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/signup')}
                                style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
                            >
                                Get Started Now <ArrowRight size={20} />
                            </button>
                        )}
                        <Link to="/login" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                            Learn More
                        </Link>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6" style={{ marginTop: '5rem' }}>
                    <div className="card text-center" style={{ padding: '2.5rem 1.5rem' }}>
                        <div className="mx-auto flex justify-center items-center" style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', marginBottom: '1.5rem' }}>
                            <Target size={32} className="text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Track Your Scores</h3>
                        <p className="text-muted text-sm" style={{ lineHeight: 1.5 }}>
                            Enter up to 5 of your most recent golf scores. Keep your progress updated and stay competitive in the draw.
                        </p>
                    </div>

                    <div className="card text-center" style={{ padding: '2.5rem 1.5rem', transform: 'translateY(-10px)' }}>
                        <div className="mx-auto flex justify-center items-center" style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', marginBottom: '1.5rem' }}>
                            <Trophy size={32} className="text-warning" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Monthly Jackpot</h3>
                        <p className="text-muted text-sm" style={{ lineHeight: 1.5 }}>
                            Match your scores with our monthly random draw to win the jackpot. Match 3, 4, or 5 to earn increasing rewards!
                        </p>
                    </div>

                    <div className="card text-center" style={{ padding: '2.5rem 1.5rem' }}>
                        <div className="mx-auto flex justify-center items-center" style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', marginBottom: '1.5rem' }}>
                            <HeartHandshake size={32} className="text-danger" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Charity Support</h3>
                        <p className="text-muted text-sm" style={{ lineHeight: 1.5 }}>
                            10% of all subscription proceeds go directly to a charity of your choice. Making a difference has never been easier.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
