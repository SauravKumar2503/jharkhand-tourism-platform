import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import API_BASE from '../config';
import bookingService from '../services/bookingService';

const Profile = () => {
    const { user, login } = useContext(AuthContext); // login used to update context
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        location: '',
        phone: ''
    });
    const [profileImage, setProfileImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [hotelCount, setHotelCount] = useState(0);

    useEffect(() => {
        if (user) {
            const userData = user.user || user;
            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                bio: userData.bio || '',
                location: userData.location || '',
                phone: userData.phone || ''
            });
            if (userData.profilePicture) {
                setPreview(`${API_BASE}${userData.profilePicture}`);
            }
        }
    }, [user]);

    // Fetch bookings to show on profile
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const userObj = JSON.parse(localStorage.getItem('user'));
                if (!userObj?.token) return;
                const data = await bookingService.getMyBookings(userObj.token);
                if (Array.isArray(data)) setBookings(data);
            } catch (err) {
                console.error('Error fetching bookings for profile:', err);
            }
        };

        const fetchHotelCount = async () => {
            try {
                const userObj = JSON.parse(localStorage.getItem('user'));
                if (!userObj?.token) return;
                const userData = user.user || user;
                if (userData.role === 'guide') {
                    const res = await axios.get(`${API_BASE}/api/hotels`, {
                        headers: { 'x-auth-token': userObj.token }
                    });
                    setHotelCount(res.data.length);
                }
            } catch (err) {
                console.error('Error fetching hotel count:', err);
            }
        };

        if (user) {
            fetchBookings();
            fetchHotelCount();
        }
    }, [user]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onFileChange = e => {
        setProfileImage(e.target.files[0]);
        setPreview(URL.createObjectURL(e.target.files[0]));
    };

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        };

        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('bio', formData.bio);
        data.append('location', formData.location);
        data.append('phone', formData.phone);
        if (profileImage) {
            data.append('profilePicture', profileImage);
        } else if (formData.removeProfilePicture) {
            data.append('removeProfilePicture', 'true');
        }

        try {
            const res = await axios.put(`${API_BASE}/api/auth/profile`, data, config);

            // Update local storage and context
            const updatedUser = { token: user.token, user: res.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            // We need a way to update context without full reload, but for now re-login simulates it or just reload
            // Ideally AuthContext should have an updateProfile method.
            // For simplicity, we can reload or just assume usage of new data on next mount
            window.location.reload();

            setIsEditing(false);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
            const errorMessage = err.response?.data?.message || err.message || 'Error updating profile';
            alert(`Failed: ${errorMessage}`);
        }
    };

    if (!user) return <div className="pt-32 text-center">Please login to view profile.</div>;

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-6">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-primary to-orange-400 relative">
                    <div className="absolute -bottom-16 left-8">
                        <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                            {preview ? (
                                <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                                    {formData.name.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="absolute top-4 right-4">
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-white/30 transition"
                            >
                                ✎ Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                <div className="pt-20 px-8 pb-8">
                    {isEditing ? (
                        <form onSubmit={onSubmit} className="space-y-6 animate-fade-in-up">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={onChange} className="w-full px-4 py-2 border rounded-lg focus:border-primary focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={onChange} className="w-full px-4 py-2 border rounded-lg focus:border-primary focus:outline-none" disabled />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input type="text" name="phone" value={formData.phone} onChange={onChange} className="w-full px-4 py-2 border rounded-lg focus:border-primary focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <input type="text" name="location" value={formData.location} onChange={onChange} className="w-full px-4 py-2 border rounded-lg focus:border-primary focus:outline-none" />
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                    <textarea name="bio" value={formData.bio} onChange={onChange} rows="3" className="w-full px-4 py-2 border rounded-lg focus:border-primary focus:outline-none"></textarea>
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                                    <div className="flex items-center space-x-4">
                                        <input
                                            type="file"
                                            id="fileInput"
                                            onChange={onFileChange}
                                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                        />
                                        {preview && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPreview(null);
                                                    setProfileImage(null);
                                                    setFormData({ ...formData, removeProfilePicture: true });
                                                    document.getElementById('fileInput').value = ''; // Clear input
                                                }}
                                                className="text-red-500 hover:text-red-700 text-sm font-semibold"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-orange-600" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="col-span-2 space-y-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{formData.name}</h1>
                                    <p className="text-primary font-medium">{formData.location || 'Location not set'}</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">About</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {formData.bio || 'No bio added yet. Click edit to tell us about yourself!'}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium text-gray-900">{formData.email}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-medium text-gray-900">{formData.phone || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-1">
                                <div className="bg-white border rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-bold text-gray-900 mb-4">Role</h3>
                                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold capitalize">
                                        {(user.user || user).role}
                                    </span>

                                    <h3 className="font-bold text-gray-900 mt-6 mb-4">Account Status</h3>
                                    <div className="flex items-center text-green-600 text-sm">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                        Active
                                    </div>

                                    {/* Quick Stats */}
                                    <h3 className="font-bold text-gray-900 mt-6 mb-3">Quick Stats</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">📅 Total Bookings</span>
                                            <span className="font-bold">{bookings.length}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">🏨 Hotel Stays</span>
                                            <span className="font-bold">{bookings.filter(b => b.hotelStay).length}</span>
                                        </div>
                                        {(user.user || user).role === 'guide' && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">🏨 Hotels Listed</span>
                                                <span className="font-bold">{hotelCount}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Bookings with Hotel Stay Details */}
                        {bookings.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Recent Bookings</h3>
                                <div className="space-y-3">
                                    {bookings.slice(0, 5).map(booking => (
                                        <div key={booking._id} className="border rounded-xl p-4 hover:bg-gray-50 transition">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-bold text-gray-800">
                                                        {(user.user || user).role === 'guide'
                                                            ? `Tourist: ${booking.tourist?.name || 'Guest'}`
                                                            : `Guide: ${booking.guide?.name || 'Unknown'}`
                                                        }
                                                    </p>
                                                    <p className="text-gray-500 text-sm">📅 {new Date(booking.date).toLocaleDateString()} • ⏳ {booking.duration}h</p>
                                                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold mt-1 ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {booking.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-xl text-primary">₹{booking.totalPrice}</p>
                                                    {booking.hotelPrice > 0 && <p className="text-xs text-gray-400">incl. ₹{booking.hotelPrice} hotel</p>}
                                                </div>
                                            </div>
                                            {booking.hotelStay && (
                                                <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg p-3">
                                                    <p className="text-sm font-bold text-blue-700">🏨 {booking.hotelStay.hotelName} — {booking.hotelStay.roomType}</p>
                                                    <p className="text-xs text-blue-600 mt-1">
                                                        📅 Check-in: {new Date(booking.hotelCheckIn).toLocaleDateString()} → Check-out: {new Date(booking.hotelCheckOut).toLocaleDateString()}
                                                        {' '}• {booking.hotelNights} night{booking.hotelNights > 1 ? 's' : ''} • ₹{booking.hotelPrice}
                                                    </p>
                                                    {booking.hotelStay.amenities?.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {booking.hotelStay.amenities.map((a, i) => (
                                                                <span key={i} className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px]">{a}</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
