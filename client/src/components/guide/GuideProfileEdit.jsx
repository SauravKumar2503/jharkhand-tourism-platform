import { useState, useEffect } from 'react';
import axios from 'axios';
import Avatar from '../common/Avatar';
import API_BASE from '../../config';

const GuideProfileEdit = ({ token, userProfile }) => {
    const [formData, setFormData] = useState({
        name: '',
        hourlyRate: 500,
        experienceYears: 0,
        bio: '',
        languages: ''
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');

    useEffect(() => {
        if (userProfile) {
            setFormData({
                name: userProfile.name || '',
                hourlyRate: userProfile.guideProfile?.hourlyRate || 500,
                experienceYears: userProfile.guideProfile?.experienceYears || 0,
                bio: userProfile.guideProfile?.bio || '',
                languages: userProfile.guideProfile?.languages ? userProfile.guideProfile.languages.join(', ') : ''
            });
            if (userProfile.profilePicture) {
                setPreview(`${API_BASE}${userProfile.profilePicture}`);
            }
        }
    }, [userProfile]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('hourlyRate', formData.hourlyRate);
            data.append('experienceYears', formData.experienceYears);
            data.append('bio', formData.bio);
            data.append('languages', formData.languages);
            if (file) {
                data.append('profilePicture', file);
            }

            const config = {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'multipart/form-data'
                }
            };

            const res = await axios.put(`${API_BASE}/api/guides/profile`, data, config);

            // Get existing data to preserve token
            const currentUser = JSON.parse(localStorage.getItem('user'));
            // Standardize structure: backend returns user object, we need { token, user: ... }
            const updatedUser = { ...currentUser, user: res.data };

            localStorage.setItem('user', JSON.stringify(updatedUser));

            alert("Profile Updated Successfully!");
            window.location.reload(); // Reload to reflect changes in layout
        } catch (err) {
            console.error(err);
            alert("Failed to update profile");
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Edit Profile & Rates</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Profile Image & Name */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 mb-4 relative group cursor-pointer">
                        <Avatar src={preview} name={formData.name} textClassName="text-4xl" />
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept="image/*"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition text-sm font-bold">
                            Change
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded-lg"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (₹)</label>
                        <input
                            type="number"
                            className="w-full border p-2 rounded-lg"
                            value={formData.hourlyRate}
                            onChange={e => setFormData({ ...formData, hourlyRate: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                        <input
                            type="number"
                            className="w-full border p-2 rounded-lg"
                            value={formData.experienceYears}
                            onChange={e => setFormData({ ...formData, experienceYears: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                        className="w-full border p-2 rounded-lg"
                        rows="3"
                        value={formData.bio}
                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Languages (comma separated)</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded-lg"
                        value={formData.languages}
                        onChange={e => setFormData({ ...formData, languages: e.target.value })}
                    />
                </div>

                <div className="text-right">
                    <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">Save Changes</button>
                </div>
            </form>
        </div>
    );
};

export default GuideProfileEdit;
