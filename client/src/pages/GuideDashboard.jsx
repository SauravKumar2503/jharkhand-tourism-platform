import { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import bookingService from '../services/bookingService';
import axios from 'axios';
import GuideStats from '../components/guide/GuideStats';

import ManagePackages from '../components/guide/ManagePackages';
import AvailabilityCalendar from '../components/guide/AvailabilityCalendar';

const GuideDashboard = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [guideFeedback, setGuideFeedback] = useState({ feedback: [], summary: null });
    const [feedbackLoading, setFeedbackLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const fetchBookings = async () => {
        try {
            const token = user.token;
            const data = await bookingService.getMyBookings(token);
            setBookings(data);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };

    const fetchGuideFeedback = async () => {
        setFeedbackLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const res = await axios.get('http://localhost:5001/api/feedback/guide', {
                headers: { 'x-auth-token': token }
            });
            setGuideFeedback(res.data);
        } catch (err) {
            console.error("Error fetching guide feedback:", err);
        }
        setFeedbackLoading(false);
    };

    useEffect(() => {
        if (activeTab === 'feedback' && user) {
            fetchGuideFeedback();
        }
    }, [activeTab]);

    const renderFeedbackTab = () => {
        if (feedbackLoading) {
            return (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                </div>
            );
        }

        const { feedback, summary } = guideFeedback;

        return (
            <div className="space-y-6">
                {/* Summary Cards */}
                {summary && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-500">
                            <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Total Reviews</p>
                            <p className="text-3xl font-black text-gray-800 mt-1">{summary.total}</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-yellow-500">
                            <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Avg Rating</p>
                            <p className="text-3xl font-black text-yellow-600 mt-1">⭐ {summary.avgRating}</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-green-500">
                            <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Positive</p>
                            <p className="text-3xl font-black text-green-600 mt-1">{summary.positive}</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-gray-400">
                            <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Neutral</p>
                            <p className="text-3xl font-black text-gray-600 mt-1">{summary.neutral}</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-red-500">
                            <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Negative</p>
                            <p className="text-3xl font-black text-red-600 mt-1">{summary.negative}</p>
                        </div>
                    </div>
                )}

                {/* Feedback List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold text-gray-800">Tourist Reviews & Feedback</h2>
                        <p className="text-sm text-gray-500 mt-1">Feedback from tourists who booked your services</p>
                    </div>

                    {feedback.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-5xl mb-4">💬</div>
                            <p className="text-gray-500 text-lg">No feedback received yet.</p>
                            <p className="text-gray-400 text-sm mt-1">Reviews will appear here when tourists leave feedback on their bookings.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {feedback.map((f, i) => (
                                <div key={i} className="p-5 hover:bg-gray-50 transition">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                                                {f.userId?.name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{f.userId?.name || 'Anonymous'}</p>
                                                <p className="text-xs text-gray-400">{f.userId?.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className="text-yellow-500 text-sm">{'⭐'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</div>
                                            <p className="text-xs text-gray-400 mt-1">{new Date(f.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mt-3 leading-relaxed">{f.comment}</p>
                                    <div className="flex items-center gap-3 mt-3">
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${f.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                                            f.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {f.sentiment === 'positive' ? '😊' : f.sentiment === 'negative' ? '😞' : '😐'} {f.sentiment.toUpperCase()}
                                        </span>
                                        {f.bookingId && (
                                            <span className="text-xs text-gray-400">
                                                Booking: {new Date(f.bookingId.date).toLocaleDateString()} • {f.bookingId.duration}h • ₹{f.bookingId.totalPrice}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (!user) return <div className="p-10 text-center">Loading...</div>;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <>
                        <GuideStats token={user.token} />
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
                            {bookings.length === 0 ? (
                                <p className="text-gray-500">No bookings yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {bookings.map(booking => (
                                        <div key={booking._id} className="border p-4 rounded-lg flex justify-between items-center hover:bg-gray-50">
                                            <div>
                                                <p className="font-bold text-lg">{booking.tourist?.name || 'Guest'}</p>
                                                <p className="text-gray-600 text-sm">📅 {new Date(booking.date).toLocaleDateString()} • ⏳ {booking.duration} Hours</p>
                                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold mt-1 ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {booking.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-xl text-primary">₹{booking.totalPrice}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                );
            case 'calendar':
                return <AvailabilityCalendar token={user.token} userProfile={user} />;
            case 'packages':
                return <ManagePackages token={user.token} />;
            case 'cancelled':
                const cancelledBookings = bookings.filter(b => b.status === 'cancelled');
                return (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 text-red-600">Cancelled Bookings</h2>
                        {cancelledBookings.length === 0 ? (
                            <p className="text-gray-500">No cancelled bookings.</p>
                        ) : (
                            <div className="space-y-4">
                                {cancelledBookings.map(booking => (
                                    <div key={booking._id} className="border border-red-100 bg-red-50 p-4 rounded-lg flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-lg">{booking.tourist?.name || 'Guest'}</p>
                                            <p className="text-gray-600 text-sm">📅 {new Date(booking.date).toLocaleDateString()} • ⏳ {booking.duration} Hours</p>
                                            <span className="inline-block px-2 py-0.5 rounded text-xs font-bold mt-1 bg-red-200 text-red-800">
                                                CANCELLED
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-xl text-gray-500 line-through">₹{booking.totalPrice}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'feedback':
                return renderFeedbackTab();
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white shadow-sm mb-8">
                <div className="container mx-auto px-6 py-6">
                    <h1 className="text-3xl font-bold text-gray-800">Guide Dashboard</h1>
                    <p className="text-gray-500">Welcome back, {user.name} 👋</p>
                </div>

                {/* Tabs */}
                <div className="container mx-auto px-6">
                    <div className="flex space-x-6 overflow-x-auto">
                        {['overview', 'calendar', 'packages', 'feedback', 'cancelled'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 px-2 text-sm font-medium capitalize transition border-b-2 ${activeTab === tab
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 animate-fade-in-up">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default GuideDashboard;
