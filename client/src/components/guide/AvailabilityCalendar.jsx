import { useState, useEffect } from 'react';
import axios from 'axios';
import guideService from '../../services/guideService';

const AvailabilityCalendar = ({ token, userProfile }) => {
    // blockedDates comes from userProfile, but we need local state to manage updates
    const [blockedDates, setBlockedDates] = useState([]);
    const [dateInput, setDateInput] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            // Handle both direct user object and auth wrapper object
            const userId = userProfile?._id || userProfile?.id || userProfile?.user?._id || userProfile?.user?.id;
            if (userId) {
                try {
                    const freshProfile = await guideService.getGuideById(userId);
                    if (freshProfile && freshProfile.guideProfile && freshProfile.guideProfile.blockedDates) {
                        setBlockedDates(freshProfile.guideProfile.blockedDates.map(d => d.split('T')[0]));
                    }
                } catch (error) {
                    console.error("Error fetching guide profile:", error);
                    // Fallback to props
                    if (userProfile.guideProfile && userProfile.guideProfile.blockedDates) {
                        setBlockedDates(userProfile.guideProfile.blockedDates.map(d => d.split('T')[0]));
                    }
                }
            }
        };
        fetchProfile();
    }, [userProfile]);

    const handleBlockDate = async () => {
        if (!dateInput) return;
        if (blockedDates.includes(dateInput)) {
            alert("Date already blocked");
            return;
        }

        const newBlocked = [...blockedDates, dateInput];
        try {
            await updateProfile(newBlocked);
            setBlockedDates(newBlocked);
            setDateInput('');
        } catch (err) {
            alert('Failed to block date');
        }
    };

    const handleUnblock = async (dateStr) => {
        const newBlocked = blockedDates.filter(d => d !== dateStr);
        try {
            await updateProfile(newBlocked);
            setBlockedDates(newBlocked);
        } catch (err) {
            alert('Failed to unblock date');
        }
    };

    const updateProfile = async (dates) => {
        const config = { headers: { 'x-auth-token': token } };
        await axios.put('http://localhost:5001/api/guides/profile', { blockedDates: dates }, config);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Availability Calendar</h2>
            <div className="flex gap-4 mb-6">
                <input
                    type="date"
                    className="border p-2 rounded-lg"
                    min={new Date().toISOString().split('T')[0]}
                    value={dateInput}
                    onChange={e => setDateInput(e.target.value)}
                />
                <button
                    onClick={handleBlockDate}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                    Block Date
                </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-semibold mb-3">Blocked Dates (Unavailable)</h3>
                {blockedDates.length === 0 ? (
                    <p className="text-gray-500">No dates blocked. You are available every day.</p>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {blockedDates.map(date => (
                            <div key={date} className="bg-white border rounded-full px-4 py-1 flex items-center gap-2 shadow-sm">
                                <span>{new Date(date).toLocaleDateString()}</span>
                                <button
                                    onClick={() => handleUnblock(date)}
                                    className="text-red-500 hover:text-red-700 font-bold"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AvailabilityCalendar;
