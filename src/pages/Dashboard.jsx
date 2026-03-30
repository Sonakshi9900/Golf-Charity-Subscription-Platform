import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Plus, CreditCard, HeartHandshake, Gift, Target } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
    const { user } = useAuth();
    const [scores, setScores] = useState([]);
    const [newScore, setNewScore] = useState('');
    const [subscription, setSubscription] = useState({ status: 'active', plan: 'monthly' });
    const [charity, setCharity] = useState('');
    const [winnings, setWinnings] = useState(0);

    // Load from local storage on mount (Mocking Supabase DB for demo reliability)
    useEffect(() => {
        if (user) {
            const storedScores = JSON.parse(localStorage.getItem(`scores_${user.id}`)) || [];
            setScores(storedScores);

            // Get charity from user metadata (Supabase stores this during signup if we used options.data)
            const userCharity = user.user_metadata?.charity_selected || 'Cancer Foundation';
            setCharity(userCharity);
        }
    }, [user]);

    const handleAddScore = (e) => {
        e.preventDefault();
        if (!newScore || Array.isNaN(parseInt(newScore))) {
            toast.error('Invalid score');
            return;
        }

        const scoreEntry = {
            id: Date.now().toString(),
            value: parseInt(newScore),
            date: new Date().toLocaleDateString()
        };

        // Keep max 5 scores, delete oldest
        let updatedScores = [scoreEntry, ...scores];
        if (updatedScores.length > 5) {
            updatedScores = updatedScores.slice(0, 5);
        }

        setScores(updatedScores);
        setNewScore('');
        localStorage.setItem(`scores_${user.id}`, JSON.stringify(updatedScores));
        toast.success('Score added successfully');
    };

    const handleSubscribe = () => {
        const newStatus = subscription.status === 'active' ? 'inactive' : 'active';
        setSubscription({ ...subscription, status: newStatus });
        toast.success(`Subscription is now ${newStatus}`);
    };

    return (
        <div className="page-container animate-fade-in container">
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Player Dashboard</h1>
                    <p className="text-muted mt-1">Welcome back, {user?.user_metadata?.full_name || user?.email}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="card">
                    <div className="flex justify-between items-start mb-4">
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
                            <CreditCard className="text-primary" size={24} />
                        </div>
                        {subscription.status === 'active' ? (
                            <span className="badge badge-success">Active</span>
                        ) : (
                            <span className="badge badge-danger">Inactive</span>
                        )}
                    </div>
                    <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-1">Subscription</h3>
                    <p className="text-2xl font-bold capitalize">{subscription.plan}</p>
                    <button
                        onClick={handleSubscribe}
                        className={`btn mt-4 w-full ${subscription.status === 'active' ? 'btn-danger' : 'btn-primary'}`}
                        style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                    >
                        {subscription.status === 'active' ? 'Cancel Plan' : 'Renew Plan'}
                    </button>
                </div>

                <div className="card">
                    <div className="flex justify-between items-start mb-4">
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
                            <HeartHandshake className="text-danger" size={24} />
                        </div>
                    </div>
                    <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-1">My Charity</h3>
                    <p className="text-xl font-bold truncate">{charity}</p>
                    <p className="text-xs text-muted mt-2">10% of subscription donated</p>
                </div>

                <div className="card">
                    <div className="flex justify-between items-start mb-4">
                        <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
                            <Gift className="text-warning" size={24} />
                        </div>
                    </div>
                    <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-1">My Winnings</h3>
                    <p className="text-2xl font-bold text-warning">${winnings}</p>
                    <p className="text-xs text-muted mt-2">From Monthly Draws</p>
                </div>

                <div className="card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(14, 165, 233, 0.1))', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    <div className="flex justify-between items-start mb-4">
                        <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
                            <Trophy className="text-primary" size={24} />
                        </div>
                        {scores.length === 5 ? (
                            <span className="badge badge-success">Eligible for Draw</span>
                        ) : (
                            <span className="badge badge-gray">{scores.length}/5 Scores</span>
                        )}
                    </div>
                    <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-1">Draw Status</h3>
                    <p className="text-xl font-bold uppercase">{scores.length === 5 ? 'Participating' : 'Need more scores'}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* ADD SCORE SECTION */}
                <div className="card">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Target className="text-primary" /> Add New Score
                    </h2>
                    <form onSubmit={handleAddScore} className="mb-6 flex gap-2">
                        <input
                            type="number"
                            className="input flex-1"
                            placeholder="Enter gross score (e.g., 72)"
                            value={newScore}
                            onChange={(e) => setNewScore(e.target.value)}
                            min="18"
                            max="200"
                            required
                        />
                        <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem' }}>
                            <Plus size={20} /> Add
                        </button>
                    </form>
                    <div className="alert alert-success text-sm">
                        You can keep a maximum of 5 scores. The oldest will be replaced automatically.
                    </div>
                </div>

                {/* SCORES LIST */}
                <div className="card">
                    <h2 className="text-xl font-bold mb-4">Recent Scores</h2>
                    {scores.length === 0 ? (
                        <div className="text-center py-8 text-muted border border-dashed border-[rgba(255,255,255,0.1)] rounded-lg">
                            No scores recorded yet. Submit your first score!
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Score</th>
                                        <th className="text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {scores.map((score, index) => (
                                        <tr key={score.id}>
                                            <td>{score.date}</td>
                                            <td className="font-bold text-lg">{score.value}</td>
                                            <td className="text-right">
                                                {index === 0 ? (
                                                    <span className="badge badge-success text-xs">Latest</span>
                                                ) : (
                                                    <span className="badge badge-gray text-xs">Logged</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
