import React, { useState, useEffect } from 'react';
import { Users, Dices, Trophy, CheckCircle, HeartHandshake } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export default function Admin() {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [drawResult, setDrawResult] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        // Generate some mock users for the demo + add the current user
        const mockUsers = [
            { id: '1', name: 'John Doe', email: 'john@example.com', sub: 'active', scores: [72, 75, 78, 80, 71] },
            { id: '2', name: 'Jane Smith', email: 'jane@example.com', sub: 'inactive', scores: [82, 85, 90] },
            { id: '3', name: 'Tiger Woods', email: 'tiger@example.com', sub: 'active', scores: [65, 68, 70, 67, 72] }
        ];

        if (user) {
            const myScoresStr = localStorage.getItem(`scores_${user.id}`);
            let userScores = [];
            if (myScoresStr) {
                userScores = JSON.parse(myScoresStr).map(s => s.value);
            }
            mockUsers.unshift({
                id: user.id,
                name: user.user_metadata?.full_name || 'You (Current User)',
                email: user.email,
                sub: 'active',
                scores: userScores
            });
        }

        setUsers(mockUsers);
    }, [user]);

    const handleRunDraw = () => {
        setIsDrawing(true);
        setDrawResult(null);

        // Simulate drawing time for excitement
        setTimeout(() => {
            // Simple logic: generate 5 random jackpot numbers between 60 and 100
            const jackpotNumbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * (100 - 60 + 1)) + 60);

            const winners = users.map(u => {
                if (u.scores.length < 5 || u.sub !== 'active') return null;

                // Check matches
                let matches = 0;
                u.scores.forEach(score => {
                    if (jackpotNumbers.includes(score)) matches++;
                });

                if (matches >= 3) {
                    let prize = '';
                    if (matches === 5) prize = 'Jackpot ($50,000)';
                    if (matches === 4) prize = '2nd Prize ($5,000)';
                    if (matches === 3) prize = '3rd Prize ($500)';
                    return { ...u, matches, prize };
                }
                return null;
            }).filter(Boolean);

            setDrawResult({ jackpotNumbers, winners });
            setIsDrawing(false);
            toast.success('Monthly Draw Completed!');
        }, 2000);
    };

    return (
        <div className="page-container animate-fade-in container">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Users className="text-primary" /> Admin Portal
            </h1>
            <p className="text-muted mb-8 text-sm">Manage users, run draws, and verify winners.</p>

            {/* DRAW COMPONENT */}
            <div className="card mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Dices className="text-warning" /> Run Monthly Draw
                </h2>
                <p className="text-muted mb-6 text-sm">
                    Selects 5 random scores. Users with 5 active scores are checked. Matches: 5 = Jackpot, 4 = 2nd Prize, 3 = 3rd Prize.
                </p>

                <button
                    onClick={handleRunDraw}
                    disabled={isDrawing}
                    className="btn btn-primary"
                    style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}
                >
                    {isDrawing ? 'Generating Results...' : 'Run Simulation'}
                </button>

                {drawResult && (
                    <div className="mt-8 p-6" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
                        <h3 className="text-xl font-bold mb-4 text-warning">Winning Numbers</h3>
                        <div className="flex gap-4 mb-6 flex-wrap">
                            {drawResult.jackpotNumbers.map((num, idx) => (
                                <div key={idx} className="flex justify-center items-center font-bold text-2xl" style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--warning), #D97706)', color: '#fff', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)' }}>
                                    {num}
                                </div>
                            ))}
                        </div>

                        <h3 className="text-lg font-bold mb-4 border-b border-[rgba(255,255,255,0.1)] pb-2 flex items-center gap-2">
                            <Trophy className="text-primary" /> Winners List
                        </h3>
                        {drawResult.winners.length === 0 ? (
                            <p className="text-muted">No winners in this draw. The jackpot rolls over!</p>
                        ) : (
                            <ul className="flex flex-col gap-3">
                                {drawResult.winners.map(w => (
                                    <li key={w.id} className="flex justify-between items-center bg-[rgba(255,255,255,0.05)] p-3 rounded-lg border border-[rgba(16,185,129,0.2)]">
                                        <div>
                                            <p className="font-bold">{w.name}</p>
                                            <p className="text-xs text-muted flex gap-2">
                                                {w.matches} Matches • <span className="text-primary font-bold">{w.prize}</span>
                                            </p>
                                        </div>
                                        <button className="btn btn-secondary text-xs" style={{ padding: '0.3rem 0.8rem' }} onClick={() => toast.success(`Payment verified for ${w.name}`)}>
                                            <CheckCircle size={14} className="mr-1" inline /> Verify
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* USERS LIST */}
                <div className="card">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Users className="text-primary" /> User Operations
                    </h2>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Player Name</th>
                                    <th>Sub Status</th>
                                    <th>Scores</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id}>
                                        <td>
                                            <p className="font-bold text-sm">{u.name}</p>
                                            <p className="text-xs text-muted">{u.email}</p>
                                        </td>
                                        <td>
                                            {u.sub === 'active' ? (
                                                <span className="badge badge-success text-[10px]">Active</span>
                                            ) : (
                                                <span className="badge badge-danger text-[10px]">Inactive</span>
                                            )}
                                        </td>
                                        <td className="text-sm">
                                            {u.scores.length}/5
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* CHARITY MANAGEMENT */}
                <div className="card">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <HeartHandshake className="text-danger" /> Managed Charities
                    </h2>
                    <div className="alert alert-success mt-2">
                        Total System Donations: <strong>$12,450.00</strong>
                    </div>
                    <ul className="mt-4 flex flex-col gap-2">
                        {['Cancer Foundation', 'Global Education Fund', 'Green Earth Initiative'].map(c => (
                            <li key={c} className="flex justify-between items-center p-3" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                <span className="text-sm font-semibold">{c}</span>
                                <button className="text-xs font-bold text-primary">Edit</button>
                            </li>
                        ))}
                    </ul>
                    <button className="btn btn-secondary w-full mt-4 text-sm" style={{ padding: '0.5rem' }} onClick={() => toast.info('Add charity dialog opened')}>
                        Add New Charity Partner
                    </button>
                </div>
            </div>
        </div>
    );
}
