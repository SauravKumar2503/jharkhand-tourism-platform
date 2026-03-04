import { useEffect, useState } from 'react';
import axios from 'axios';

const GuideStats = ({ token }) => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setError(null);
                const config = { headers: { 'x-auth-token': token } };
                const res = await axios.get('http://localhost:5001/api/guides/stats', config);
                setStats(res.data);
            } catch (err) {
                console.error("Error fetching stats:", err);
                // On error, set default zero stats instead of showing error message
                setStats({
                    totalEarnings: 0,
                    completedTours: 0,
                    upcomingTours: 0,
                    totalBookings: 0
                });
            }
        };
        fetchStats();
    }, [token]);

    // Removed error UI block as per user request

    if (!stats) return <div className="text-center p-4">Loading Stats...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium uppercase">Total Earnings</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">₹{stats.totalEarnings}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium uppercase">Completed Tours</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.completedTours}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium uppercase">Upcoming</h3>
                <p className="text-3xl font-bold text-orange-600 mt-2">{stats.upcomingTours}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium uppercase">Total Bookings</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalBookings}</p>
            </div>
        </div>
    );
};

export default GuideStats;
