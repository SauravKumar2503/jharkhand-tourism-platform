import { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE from '../../config';

const ManagePackages = ({ token }) => {
    const [packages, setPackages] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newItem, setNewItem] = useState({
        title: '',
        description: '',
        price: '',
        duration: '',
        locations: ''
    });

    const config = { headers: { 'x-auth-token': token } };

    useEffect(() => {
        fetchPackages();
    }, [token]);

    const fetchPackages = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/guides/packages`, config);
            setPackages(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...newItem,
                price: Number(newItem.price),
                duration: Number(newItem.duration),
                locations: newItem.locations.split(',').map(l => l.trim())
            };
            await axios.post(`${API_BASE}/api/guides/packages`, payload, config);
            setShowForm(false);
            setNewItem({ title: '', description: '', price: '', duration: '', locations: '' });
            fetchPackages();
        } catch (err) {
            alert('Failed to add package');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this package?")) return;
        try {
            await axios.delete(`${API_BASE}/api/guides/packages/${id}`, config);
            fetchPackages();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">My Tour Packages</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                    {showForm ? 'Cancel' : '+ Create Package'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-6 rounded-xl border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                            placeholder="Package Title (e.g. Heritage Walk)"
                            className="border p-2 rounded"
                            value={newItem.title}
                            onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Price (₹)"
                            type="number"
                            className="border p-2 rounded"
                            value={newItem.price}
                            onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Duration (Hours)"
                            type="number"
                            className="border p-2 rounded"
                            value={newItem.duration}
                            onChange={e => setNewItem({ ...newItem, duration: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Locations (comma separated)"
                            className="border p-2 rounded"
                            value={newItem.locations}
                            onChange={e => setNewItem({ ...newItem, locations: e.target.value })}
                        />
                    </div>
                    <textarea
                        placeholder="Description"
                        className="w-full border p-2 rounded mb-4"
                        rows="3"
                        value={newItem.description}
                        onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                        required
                    />
                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Save Package</button>
                </form>
            )}

            <div className="grid grid-cols-1 gap-4">
                {packages.length === 0 ? <p className="text-gray-500">No packages created yet.</p> : packages.map(pkg => (
                    <div key={pkg._id} className="border p-4 rounded-xl flex justify-between items-start hover:shadow-md transition">
                        <div>
                            <h3 className="font-bold text-lg">{pkg.title}</h3>
                            <p className="text-gray-600 text-sm mt-1">{pkg.description}</p>
                            <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                <span>⏳ {pkg.duration} Hours</span>
                                <span>📍 {pkg.locations.join(', ')}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-primary">₹{pkg.price}</p>
                            <button
                                onClick={() => handleDelete(pkg._id)}
                                className="text-red-500 text-sm mt-2 hover:underline"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManagePackages;
