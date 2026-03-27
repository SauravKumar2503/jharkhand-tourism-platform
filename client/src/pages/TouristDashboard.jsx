import { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import bookingService from '../services/bookingService';
import axios from 'axios';
import API_BASE from '../config';
import { Link } from 'react-router-dom';

const TouristDashboard = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [newDate, setNewDate] = useState('');
    const [newDuration, setNewDuration] = useState(1);
    const [newTotalPrice, setNewTotalPrice] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    // Feedback states
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackBooking, setFeedbackBooking] = useState(null);
    const [feedbackRating, setFeedbackRating] = useState(5);
    const [feedbackComment, setFeedbackComment] = useState('');
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const userObj = JSON.parse(localStorage.getItem('user'));
                if (!userObj || !userObj.token) return;
                const token = userObj.token;
                const data = await bookingService.getMyBookings(token);
                if (Array.isArray(data)) setBookings(data);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };
        if (user) fetchBookings();
    }, [user]);

    const handleCancel = async (bookingId) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                const token = user.token;
                await bookingService.cancelBooking(bookingId, token);
                setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
                alert("Booking Cancelled.");
            } catch (error) {
                alert("Failed to cancel booking.");
            }
        }
    };

    const handleRescheduleClick = (booking) => {
        setSelectedBooking(booking);
        setNewDate(booking.date.split('T')[0]);
        setNewDuration(booking.duration || 1);
        setNewTotalPrice(booking.totalPrice || 500);
        setShowRescheduleModal(true);
    };

    useEffect(() => {
        if (selectedBooking) {
            setNewTotalPrice(newDuration * 500);
        }
    }, [newDuration, selectedBooking]);

    const confirmReschedule = async () => {
        try {
            const token = user.token;
            const updatedBooking = await bookingService.rescheduleBooking(
                selectedBooking._id, newDate, Number(newDuration), Number(newTotalPrice), token
            );
            setBookings(bookings.map(b => b._id === selectedBooking._id ? updatedBooking : b));
            setShowRescheduleModal(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2500);
        } catch (error) {
            alert("Failed to reschedule.");
        }
    };

    const handleFeedbackSubmit = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            await axios.post(`${API_BASE}/api/feedback`, {
                bookingId: feedbackBooking._id,
                rating: feedbackRating,
                comment: feedbackComment
            }, { headers: { 'x-auth-token': token } });
            setFeedbackSubmitted(true);
            setTimeout(() => {
                setShowFeedbackModal(false);
                setFeedbackSubmitted(false);
                setFeedbackComment('');
                setFeedbackRating(5);
            }, 2000);
        } catch (err) {
            alert('Failed to submit feedback.');
        }
    };

    return (
        <div className="container mx-auto p-6 animate-fade-in-up">
            {showSuccess && (
                <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 animate-fade-in-up">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
                        <div className="text-6xl mb-4">🎉🗓️</div>
                        <h2 className="text-2xl font-bold text-primary mb-2">Rescheduling Confirmed!</h2>
                        <p className="text-gray-600">Your tour has been successfully updated.</p>
                    </div>
                </div>
            )}
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Dashboard</h1>

            {showRescheduleModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold mb-4">Reschedule Booking</h2>
                        <p className="text-gray-600 mb-4">Update details for your tour with {selectedBooking?.guide?.name}.</p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
                            <input type="date" value={newDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setNewDate(e.target.value)} className="w-full border p-2 rounded-lg" />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Hours)</label>
                            <div className="flex items-center space-x-4">
                                <input type="range" min="1" max="8" value={newDuration} onChange={(e) => setNewDuration(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg accent-primary" />
                                <span className="font-bold text-primary w-12 text-center">{newDuration} hr{newDuration > 1 ? 's' : ''}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mb-6 border-t pt-4">
                            <span className="text-gray-600">New Total Price</span>
                            <span className="text-2xl font-bold text-primary">₹{newTotalPrice}</span>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setShowRescheduleModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                            <button onClick={confirmReschedule} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700">Confirm Reschedule</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Feedback Modal */}
            {showFeedbackModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        {feedbackSubmitted ? (
                            <div className="text-center py-8">
                                <div className="text-6xl mb-4">🎉</div>
                                <h2 className="text-2xl font-bold text-primary mb-2">Thank You!</h2>
                                <p className="text-gray-600">Your feedback has been submitted with AI sentiment analysis.</p>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold mb-2">Leave Feedback</h2>
                                <p className="text-gray-500 text-sm mb-4">Tour with {feedbackBooking?.guide?.name}</p>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map(n => (
                                            <button key={n} onClick={() => setFeedbackRating(n)} className={`text-3xl transition-transform ${feedbackRating >= n ? 'scale-110' : 'opacity-30 hover:opacity-60'}`}>
                                                ⭐
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Experience</label>
                                    <textarea value={feedbackComment} onChange={(e) => setFeedbackComment(e.target.value)} placeholder="Tell us about your experience..." rows="4" className="w-full border p-3 rounded-xl focus:outline-none focus:border-primary"></textarea>
                                    <p className="text-xs text-gray-400 mt-1">Your feedback will be analyzed by our AI for continuous improvement.</p>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button onClick={() => setShowFeedbackModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                                    <button onClick={handleFeedbackSubmit} disabled={!feedbackComment.trim()} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700 disabled:opacity-50">Submit Feedback</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h2 className="text-xl font-bold border-b pb-4 mb-4">My Bookings</h2>
                {bookings.length === 0 ? (
                    <p className="text-gray-500">No bookings yet.</p>
                ) : (
                    <div className="space-y-4">
                        {bookings.map(booking => (
                            <div key={booking._id} className="border rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-gray-50 transition">
                                <div>
                                    <h3 className="font-bold text-lg">{booking.guide?.name || 'Unknown Guide'}</h3>
                                    <p className="text-gray-600">Date: {new Date(booking.date).toLocaleDateString()}</p>
                                    <p className="text-gray-600">Duration: {booking.duration || 1} hours</p>
                                    <p className="text-gray-600">Total: ₹{booking.totalPrice}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {booking.status.toUpperCase()}
                                        </span>
                                    </div>
                                    {booking.hotelStay && (
                                        <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg p-2">
                                            <p className="text-xs font-bold text-blue-700">🏨 {booking.hotelStay.hotelName} — {booking.hotelStay.roomType}</p>
                                            <p className="text-xs text-blue-600">
                                                📅 {new Date(booking.hotelCheckIn).toLocaleDateString()} → {new Date(booking.hotelCheckOut).toLocaleDateString()} • {booking.hotelNights} night{booking.hotelNights > 1 ? 's' : ''} • ₹{booking.hotelPrice}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                                    {booking.status === 'confirmed' && (
                                        <>
                                            <button onClick={() => handleRescheduleClick(booking)} className="px-4 py-2 text-sm border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition">Reschedule</button>
                                            <button onClick={() => handleCancel(booking._id)} className="px-4 py-2 text-sm border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition">Cancel</button>
                                            <button onClick={() => { setFeedbackBooking(booking); setShowFeedbackModal(true); }} className="px-4 py-2 text-sm border border-amber-500 text-amber-600 rounded-lg hover:bg-amber-50 transition">⭐ Feedback</button>
                                        </>
                                    )}
                                    {booking.status === 'cancelled' && (
                                        <button onClick={() => { setFeedbackBooking(booking); setShowFeedbackModal(true); }} className="px-4 py-2 text-sm border border-amber-500 text-amber-600 rounded-lg hover:bg-amber-50 transition">⭐ Feedback</button>
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

export default TouristDashboard;
