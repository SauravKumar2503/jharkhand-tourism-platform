import { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE from '../../config';

const ManageHotels = ({ token }) => {
    const [hotels, setHotels] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newHotel, setNewHotel] = useState({
        hotelName: '',
        location: '',
        pricePerNight: '',
        roomType: 'Double',
        amenities: '',
        maxGuests: '2',
        description: ''
    });

    const config = { headers: { 'x-auth-token': token } };

    useEffect(() => {
        fetchHotels();
    }, [token]);

    const fetchHotels = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/hotels`, config);
            setHotels(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...newHotel,
                pricePerNight: Number(newHotel.pricePerNight),
                maxGuests: Number(newHotel.maxGuests),
                amenities: newHotel.amenities.split(',').map(a => a.trim()).filter(Boolean)
            };
            await axios.post(`${API_BASE}/api/hotels`, payload, config);
            setShowForm(false);
            setNewHotel({ hotelName: '', location: '', pricePerNight: '', roomType: 'Double', amenities: '', maxGuests: '2', description: '' });
            fetchHotels();
        } catch (err) {
            alert('Failed to add hotel');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this hotel listing?")) return;
        try {
            await axios.delete(`${API_BASE}/api/hotels/${id}`, config);
            fetchHotels();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    const roomTypeIcons = { Single: '🛏️', Double: '🛏️🛏️', Suite: '👑', Deluxe: '✨', Dormitory: '🏠' };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">🏨 My Hotel Listings</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                    {showForm ? 'Cancel' : '+ Add Hotel'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-6 rounded-xl border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                            placeholder="Hotel Name"
                            className="border p-2 rounded"
                            value={newHotel.hotelName}
                            onChange={e => setNewHotel({ ...newHotel, hotelName: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Location (e.g. Ranchi, Jharkhand)"
                            className="border p-2 rounded"
                            value={newHotel.location}
                            onChange={e => setNewHotel({ ...newHotel, location: e.target.value })}
                        />
                        <input
                            placeholder="Price per Night (₹)"
                            type="number"
                            className="border p-2 rounded"
                            value={newHotel.pricePerNight}
                            onChange={e => setNewHotel({ ...newHotel, pricePerNight: e.target.value })}
                            required
                        />
                        <select
                            className="border p-2 rounded"
                            value={newHotel.roomType}
                            onChange={e => setNewHotel({ ...newHotel, roomType: e.target.value })}
                        >
                            <option value="Single">Single Room</option>
                            <option value="Double">Double Room</option>
                            <option value="Suite">Suite</option>
                            <option value="Deluxe">Deluxe</option>
                            <option value="Dormitory">Dormitory</option>
                        </select>
                        <input
                            placeholder="Max Guests"
                            type="number"
                            className="border p-2 rounded"
                            value={newHotel.maxGuests}
                            onChange={e => setNewHotel({ ...newHotel, maxGuests: e.target.value })}
                        />
                        <input
                            placeholder="Amenities (WiFi, AC, Breakfast...)"
                            className="border p-2 rounded"
                            value={newHotel.amenities}
                            onChange={e => setNewHotel({ ...newHotel, amenities: e.target.value })}
                        />
                    </div>
                    <textarea
                        placeholder="Description"
                        className="w-full border p-2 rounded mb-4"
                        rows="3"
                        value={newHotel.description}
                        onChange={e => setNewHotel({ ...newHotel, description: e.target.value })}
                    />
                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Save Hotel</button>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hotels.length === 0 ? <p className="text-gray-500 col-span-2">No hotel listings yet. Add your first hotel!</p> : hotels.map(hotel => (
                    <div key={hotel._id} className="border rounded-xl p-5 hover:shadow-lg transition bg-gradient-to-br from-white to-blue-50">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    🏨 {hotel.hotelName}
                                </h3>
                                <p className="text-gray-500 text-sm">📍 {hotel.location || 'Location not set'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-primary">₹{hotel.pricePerNight}</p>
                                <p className="text-xs text-gray-400">per night</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                {roomTypeIcons[hotel.roomType] || '🏠'} {hotel.roomType}
                            </span>
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                👥 Max {hotel.maxGuests} guests
                            </span>
                        </div>

                        {hotel.amenities?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                                {hotel.amenities.map((a, i) => (
                                    <span key={i} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{a}</span>
                                ))}
                            </div>
                        )}

                        {hotel.description && <p className="text-gray-600 text-sm mb-3 line-clamp-2">{hotel.description}</p>}

                        <button
                            onClick={() => handleDelete(hotel._id)}
                            className="text-red-500 text-sm hover:underline"
                        >
                            🗑️ Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageHotels;
