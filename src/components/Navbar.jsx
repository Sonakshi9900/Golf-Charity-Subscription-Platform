import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Target, Trophy, LogOut, User, ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export default function Navbar() {
    const { user, isAdmin, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut();
            toast.success('Logged out successfully');
            navigate('/');
        } catch (error) {
            toast.error('Failed to log out');
        }
    };

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="logo">
                    <Target className="text-primary" />
                    <span>Golf<span className="text-primary">Charity</span></span>
                </Link>
                <div className="nav-links">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="flex items-center gap-2">
                                <Trophy size={18} /> Dashboard
                            </Link>
                            {isAdmin && (
                                <Link to="/admin" className="flex items-center gap-2 text-warning">
                                    <ShieldAlert size={18} /> Admin Panel
                                </Link>
                            )}
                            <button onClick={handleLogout} className="btn btn-secondary flex items-center gap-2" style={{ padding: '0.4rem 1rem' }}>
                                <LogOut size={16} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-secondary" style={{ padding: '0.4rem 1rem' }}>
                                Login
                            </Link>
                            <Link to="/signup" className="btn btn-primary" style={{ padding: '0.4rem 1rem' }}>
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
