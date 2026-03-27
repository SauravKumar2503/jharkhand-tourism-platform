import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import API_BASE from '../config';

const SENTIMENT_COLORS = { positive: '#22c55e', neutral: '#eab308', negative: '#ef4444' };
const API = `${API_BASE}/api`;

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const userRole = user?.user?.role || user?.role;
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({ users: 0, guides: 0, pendingGuides: 0, bookings: 0, revenue: 0, marketItems: 0, packages: 0 });
    const [users, setUsers] = useState([]);
    const [sites, setSites] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [marketItems, setMarketItems] = useState([]);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedbackAnalytics, setFeedbackAnalytics] = useState(null);
    const [applications, setApplications] = useState([]);
    const [orders, setOrders] = useState([]);
    const [adminHotels, setAdminHotels] = useState([]);
    const [guides, setGuides] = useState([]);

    // Modal States
    const [showUserModal, setShowUserModal] = useState(false);
    const [showSiteModal, setShowSiteModal] = useState(false);
    const [showMarketModal, setShowMarketModal] = useState(false);
    const [showTransportModal, setShowTransportModal] = useState(false);
    const [showHotelModal, setShowHotelModal] = useState(false);

    // Form States
    const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'tourist' });
    const [siteForm, setSiteForm] = useState({ name: '', description: '', location: '', vrLink: '', image: '' });
    const [marketForm, setMarketForm] = useState({ name: '', description: '', price: '', category: 'handicrafts', image: '', location: '', contact: '' });
    const [transportForm, setTransportForm] = useState({ name: '', type: 'railway', city: '', lat: '', lng: '', facilities: '' });
    const [transports, setTransports] = useState([]);
    const [hotelForm, setHotelForm] = useState({ guideId: '', hotelName: '', location: '', pricePerNight: '', roomType: 'Double', amenities: '', maxGuests: '2', description: '' });

    const token = JSON.parse(localStorage.getItem('user'))?.token;
    const config = { headers: { 'x-auth-token': token } };

    useEffect(() => {
        if (user && userRole === 'admin') fetchData();
    }, [user, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'overview') {
                const res = await axios.get(`${API}/admin/stats`, config);
                setStats(res.data);
            } else if (activeTab === 'approvals') {
                const res = await axios.get(`${API}/admin/users`, config);
                setUsers(res.data);
            } else if (activeTab === 'users') {
                const res = await axios.get(`${API}/admin/users`, config);
                setUsers(res.data);
            } else if (activeTab === 'bookings') {
                const res = await axios.get(`${API}/admin/bookings`, config);
                setBookings(res.data);
            } else if (activeTab === 'sites') {
                const res = await axios.get(`${API}/heritage`);
                setSites(res.data);
            } else if (activeTab === 'marketplace') {
                const res = await axios.get(`${API}/admin/marketplace`, config);
                setMarketItems(res.data);
            } else if (activeTab === 'feedback') {
                const res = await axios.get(`${API}/feedback/analytics`, config);
                setFeedbackAnalytics(res.data);
            } else if (activeTab === 'transport') {
                const res = await axios.get(`${API}/transport`);
                setTransports(res.data);
            } else if (activeTab === 'applications') {
                const res = await axios.get(`${API}/career/applications`, config);
                setApplications(res.data);
            } else if (activeTab === 'orders') {
                const res = await axios.get(`${API}/marketplace/orders`, config);
                setOrders(res.data);
            } else if (activeTab === 'hotels') {
                const [hotelsRes, guidesRes] = await Promise.all([
                    axios.get(`${API}/hotels/all`, config),
                    axios.get(`${API}/guides/`)
                ]);
                setAdminHotels(hotelsRes.data);
                setGuides(guidesRes.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setLoading(false);
    };

    // --- User Actions ---
    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/auth/register`, userForm);
            alert('User Created Successfully!');
            setShowUserModal(false);
            setUserForm({ name: '', email: '', password: '', role: 'tourist' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating user');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await axios.delete(`${API}/admin/users/${id}`, config);
            fetchData();
        } catch (err) {
            alert('Error deleting user');
        }
    };

    // --- Guide Approval ---
    const handleApproveGuide = async (id) => {
        try {
            await axios.put(`${API}/admin/guides/${id}/approve`, {}, config);
            alert('Guide approved successfully!');
            fetchData();
        } catch (err) {
            alert('Error approving guide');
        }
    };

    const handleRejectGuide = async (id) => {
        if (!window.confirm('Reject and remove this guide application?')) return;
        try {
            await axios.delete(`${API}/admin/guides/${id}/reject`, config);
            alert('Guide registration rejected.');
            fetchData();
        } catch (err) {
            alert('Error rejecting guide');
        }
    };


    // --- Booking Actions ---
    const handleUpdateBookingStatus = async (id, status) => {
        try {
            await axios.put(`${API}/admin/bookings/${id}/status`, { status }, config);
            fetchData();
        } catch (err) {
            alert('Error updating booking');
        }
    };

    // --- Site Actions ---
    const handleCreateSite = async (e) => {
        e.preventDefault();
        try {
            const images = siteForm.image ? [siteForm.image] : [];
            await axios.post(`${API}/heritage`, { ...siteForm, images }, config);
            alert('Heritage Site Added!');
            setShowSiteModal(false);
            setSiteForm({ name: '', description: '', location: '', vrLink: '', image: '' });
            fetchData();
        } catch (err) {
            alert('Error creating site');
        }
    };

    const handleDeleteSite = async (id) => {
        if (!window.confirm('Delete this site?')) return;
        try {
            await axios.delete(`${API}/heritage/${id}`, config);
            fetchData();
        } catch (err) { alert('Error deleting site'); }
    };

    // --- Marketplace Actions ---
    const handleCreateMarketItem = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...marketForm,
                price: Number(marketForm.price),
                images: marketForm.image ? [marketForm.image] : []
            };
            await axios.post(`${API}/admin/marketplace`, payload, config);
            alert('Marketplace item added!');
            setShowMarketModal(false);
            setMarketForm({ name: '', description: '', price: '', category: 'handicrafts', image: '', location: '', contact: '' });
            fetchData();
        } catch (err) { alert('Error creating marketplace item'); }
    };

    const handleDeleteMarketItem = async (id) => {
        if (!window.confirm('Delete this item?')) return;
        try {
            await axios.delete(`${API}/admin/marketplace/${id}`, config);
            fetchData();
        } catch (err) { alert('Error deleting item'); }
    };

    // --- Export CSV ---
    const exportCSV = () => {
        if (!feedbackAnalytics) return;
        const rows = [['Name', 'Rating', 'Comment', 'Sentiment', 'Date']];
        feedbackAnalytics.recentFeedback.forEach(f => {
            rows.push([f.userId?.name || '', f.rating, `"${f.comment}"`, f.sentiment, new Date(f.createdAt).toLocaleDateString()]);
        });
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'feedback_analytics.csv'; a.click();
    };

    // --- Transport Actions ---
    const handleCreateTransport = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...transportForm,
                lat: Number(transportForm.lat),
                lng: Number(transportForm.lng),
                facilities: transportForm.facilities.split(',').map(f => f.trim()).filter(Boolean)
            };
            await axios.post(`${API}/transport`, payload, config);
            alert('Transport hub added!');
            setShowTransportModal(false);
            setTransportForm({ name: '', type: 'railway', city: '', lat: '', lng: '', facilities: '' });
            fetchData();
        } catch (err) { alert('Error adding transport hub'); }
    };

    const handleDeleteTransport = async (id) => {
        if (!window.confirm('Delete this transport hub?')) return;
        try {
            await axios.delete(`${API}/transport/${id}`, config);
            fetchData();
        } catch (err) { alert('Error deleting transport hub'); }
    };

    // --- Hotel Actions ---
    const handleAdminCreateHotel = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...hotelForm,
                pricePerNight: Number(hotelForm.pricePerNight),
                maxGuests: Number(hotelForm.maxGuests),
                amenities: hotelForm.amenities.split(',').map(a => a.trim()).filter(Boolean)
            };
            await axios.post(`${API}/hotels/admin`, payload, config);
            alert('Hotel added!');
            setShowHotelModal(false);
            setHotelForm({ guideId: '', hotelName: '', location: '', pricePerNight: '', roomType: 'Double', amenities: '', maxGuests: '2', description: '' });
            fetchData();
        } catch (err) { alert(err.response?.data?.message || 'Error adding hotel'); }
    };

    const handleAdminDeleteHotel = async (id) => {
        if (!window.confirm('Delete this hotel?')) return;
        try {
            await axios.delete(`${API}/hotels/admin/${id}`, config);
            fetchData();
        } catch (err) { alert('Error deleting hotel'); }
    };

    if (!user || userRole !== 'admin') {
        return <div className="min-h-screen flex items-center justify-center text-xl font-bold text-red-500">🔒 Access Denied — Admin Only</div>;
    }

    const pendingGuides = users.filter(u => u.role === 'guide' && !u.isApproved);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'approvals', label: `Approvals ${pendingGuides.length > 0 || stats.pendingGuides > 0 ? `(${pendingGuides.length || stats.pendingGuides})` : ''}`, icon: '🔔' },
        { id: 'users', label: 'Users & Guides', icon: '👥' },
        { id: 'bookings', label: 'Bookings', icon: '📅' },
        { id: 'sites', label: 'Heritage Sites', icon: '🏛️' },
        { id: 'marketplace', label: 'Marketplace', icon: '🛍️' },
        { id: 'orders', label: `Orders${orders.length > 0 ? ` (${orders.length})` : ''}`, icon: '🛒' },
        { id: 'transport', label: 'Transport', icon: '🚆' },
        { id: 'feedback', label: 'Feedback', icon: '💬' },
        { id: 'applications', label: `Applications${applications.length > 0 ? ` (${applications.length})` : ''}`, icon: '📄' },
        { id: 'hotels', label: `Hotels${adminHotels.length > 0 ? ` (${adminHotels.length})` : ''}`, icon: '🏨' }
    ];

    const chartData = [
        { name: 'Users', count: stats.users },
        { name: 'Guides', count: stats.guides },
        { name: 'Bookings', count: stats.bookings },
        { name: 'Market Items', count: stats.marketItems },
        { name: 'Packages', count: stats.packages },
    ];

    const sentimentPieData = feedbackAnalytics ? [
        { name: 'Positive', value: feedbackAnalytics.sentimentBreakdown.positive },
        { name: 'Neutral', value: feedbackAnalytics.sentimentBreakdown.neutral },
        { name: 'Negative', value: feedbackAnalytics.sentimentBreakdown.negative },
    ] : [];

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                        <p className="text-gray-500 text-sm mt-1">Full platform management & control</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-3 py-2 rounded-lg font-medium transition flex items-center gap-1.5 text-xs md:text-sm ${activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}
                            >
                                <span>{tab.icon}</span> {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ==================== OVERVIEW TAB ==================== */}
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Total Users', value: stats.users, color: 'blue', icon: '👥' },
                                { label: 'Active Guides', value: stats.guides, color: 'green', icon: '🧭' },
                                { label: 'Pending Approvals', value: stats.pendingGuides, color: 'amber', icon: '🔔' },
                                { label: 'Total Bookings', value: stats.bookings, color: 'purple', icon: '📅' },
                                { label: 'Revenue', value: `₹${stats.revenue}`, color: 'emerald', icon: '💰' },
                                { label: 'Heritage Sites', value: sites.length || '—', color: 'teal', icon: '🏛️' },
                                { label: 'Marketplace Items', value: stats.marketItems, color: 'orange', icon: '🛍️' },
                                { label: 'Tour Packages', value: stats.packages, color: 'pink', icon: '📦' },
                            ].map((s, i) => (
                                <div key={i} className={`bg-white p-5 rounded-xl shadow-sm border-l-4 border-${s.color}-500`}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-gray-500 font-bold uppercase text-xs tracking-wider">{s.label}</p>
                                            <p className="text-2xl font-black text-gray-800 mt-1">{s.value}</p>
                                        </div>
                                        <span className="text-2xl">{s.icon}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-sm">
                            <h2 className="text-xl font-bold mb-6 text-gray-800">Platform Analytics</h2>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                        <Bar dataKey="count" fill="#0F9D58" radius={[4, 4, 0, 0]} barSize={50} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================== APPROVALS TAB ==================== */}
                {activeTab === 'approvals' && (
                    <div className="animate-fade-in-up">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b">
                                <h2 className="text-xl font-bold text-gray-800">🔔 Pending Guide Approvals</h2>
                                <p className="text-sm text-gray-500 mt-1">New guide registrations waiting for your approval</p>
                            </div>
                            {pendingGuides.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="text-5xl mb-4">✅</div>
                                    <p className="text-gray-500 text-lg">No pending approvals</p>
                                    <p className="text-gray-400 text-sm">All guide registrations have been processed.</p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {pendingGuides.map(guide => (
                                        <div key={guide._id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-amber-50 transition">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-lg">
                                                    {guide.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800 text-lg">{guide.name}</p>
                                                    <p className="text-gray-500 text-sm">{guide.email}</p>
                                                    <div className="flex gap-3 mt-1 text-xs text-gray-400">
                                                        <span>📅 Registered: {new Date(guide.createdAt).toLocaleDateString()}</span>
                                                        {guide.guideProfile?.languages?.length > 0 && (
                                                            <span>🌐 {guide.guideProfile.languages.join(', ')}</span>
                                                        )}
                                                        {guide.guideProfile?.experienceYears && (
                                                            <span>⏳ {guide.guideProfile.experienceYears} yrs exp</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleApproveGuide(guide._id)}
                                                    className="px-5 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition text-sm"
                                                >
                                                    ✅ Approve
                                                </button>
                                                <button
                                                    onClick={() => handleRejectGuide(guide._id)}
                                                    className="px-5 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition text-sm"
                                                >
                                                    ❌ Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ==================== USERS TAB ==================== */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-fade-in-up">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">User Management</h2>
                            <button onClick={() => setShowUserModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm font-bold">
                                + Add User
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.filter(u => u.isApproved !== false || u.role !== 'guide').map(u => (
                                        <tr key={u._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 font-medium text-gray-900">{u.name}</td>
                                            <td className="px-6 py-4 text-gray-600 text-sm">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-red-100 text-red-800' : u.role === 'guide' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                                    {u.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${u.isApproved ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                                                    {u.isApproved ? '✅ Active' : '⏳ Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {u.role !== 'admin' && (
                                                    <button onClick={() => handleDeleteUser(u._id)} className="text-red-500 hover:text-red-700 font-medium text-sm">Delete</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ==================== BOOKINGS TAB ==================== */}
                {activeTab === 'bookings' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-fade-in-up">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-800">📅 All Bookings</h2>
                            <p className="text-sm text-gray-500 mt-1">Manage all tourist-guide bookings</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Tourist</th>
                                        <th className="px-6 py-4">Guide</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Duration</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {bookings.map(b => (
                                        <tr key={b._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-900">{b.tourist?.name || 'N/A'}</p>
                                                <p className="text-xs text-gray-400">{b.tourist?.email}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-900">{b.guide?.name || 'N/A'}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{new Date(b.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{b.duration}h</td>
                                            <td className="px-6 py-4 font-bold text-primary">₹{b.totalPrice}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${b.status === 'confirmed' ? 'bg-green-100 text-green-800' : b.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {b.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <select
                                                    value={b.status}
                                                    onChange={(e) => handleUpdateBookingStatus(b._id, e.target.value)}
                                                    className="text-xs border rounded-lg px-2 py-1 focus:outline-none focus:border-primary"
                                                >
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                    <option value="pending">Pending</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {bookings.length === 0 && (
                                <div className="p-12 text-center text-gray-500">No bookings found.</div>
                            )}
                        </div>
                    </div>
                )}

                {/* ==================== HERITAGE SITES TAB ==================== */}
                {activeTab === 'sites' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-fade-in-up">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">🏛️ Heritage Sites</h2>
                            <button onClick={() => setShowSiteModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-bold">
                                + Add Site
                            </button>
                        </div>
                        {sites.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">No sites added yet.</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                                {sites.map(site => (
                                    <div key={site._id} className="border rounded-xl overflow-hidden hover:shadow-md transition">
                                        <div className="h-48 bg-gray-200 relative">
                                            {site.images && site.images[0] ? (
                                                <img src={site.images[0]} alt={site.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-lg text-gray-900">{site.name}</h3>
                                                <button onClick={() => handleDeleteSite(site._id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-1">📍 {site.location}</p>
                                            <p className="text-gray-600 text-sm line-clamp-2">{site.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ==================== MARKETPLACE TAB ==================== */}
                {activeTab === 'marketplace' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-fade-in-up">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">🛍️ Marketplace Management</h2>
                            <button onClick={() => setShowMarketModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-bold">
                                + Add Item
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Item</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Price</th>
                                        <th className="px-6 py-4">Location</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {marketItems.map(item => (
                                        <tr key={item._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-900">{item.name}</p>
                                                <p className="text-xs text-gray-400 line-clamp-1">{item.description}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-full capitalize">{item.category}</span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-primary">₹{item.price}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{item.location || '—'}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => handleDeleteMarketItem(item._id)} className="text-red-500 hover:text-red-700 font-medium text-sm">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {marketItems.length === 0 && (
                                <div className="p-12 text-center text-gray-500">No marketplace items.</div>
                            )}
                        </div>
                    </div>
                )}

                {/* ==================== ORDERS TAB ==================== */}
                {activeTab === 'orders' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-fade-in-up">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-800">🛒 Customer Orders</h2>
                            <p className="text-sm text-gray-500 mt-1">Manage all marketplace orders placed by tourists</p>
                        </div>
                        {loading ? (
                            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>
                        ) : orders.length === 0 ? (
                            <div className="p-12 text-center text-gray-400">
                                <p className="text-4xl mb-2">📦</p>
                                <p className="font-bold">No orders yet</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left p-3 font-bold text-gray-600">Buyer</th>
                                            <th className="text-left p-3 font-bold text-gray-600">Contact</th>
                                            <th className="text-left p-3 font-bold text-gray-600">Item</th>
                                            <th className="text-left p-3 font-bold text-gray-600">Qty</th>
                                            <th className="text-left p-3 font-bold text-gray-600">Total</th>
                                            <th className="text-left p-3 font-bold text-gray-600">Payment</th>
                                            <th className="text-left p-3 font-bold text-gray-600">Status</th>
                                            <th className="text-left p-3 font-bold text-gray-600">Date</th>
                                            <th className="text-left p-3 font-bold text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order._id} className="border-t hover:bg-gray-50">
                                                <td className="p-3">
                                                    <p className="font-bold text-gray-800">{order.buyerName}</p>
                                                    <p className="text-xs text-gray-500">{order.address?.substring(0, 30)}...</p>
                                                </td>
                                                <td className="p-3">
                                                    <p className="text-gray-700">{order.email}</p>
                                                    <p className="text-xs text-gray-500">📞 {order.phone}</p>
                                                </td>
                                                <td className="p-3 font-medium text-gray-800">{order.itemName}</td>
                                                <td className="p-3 font-bold">{order.quantity}</td>
                                                <td className="p-3 font-bold text-orange-600">₹{order.totalAmount?.toLocaleString()}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.paymentMethod === 'upi' ? 'bg-purple-100 text-purple-700' :
                                                        order.paymentMethod === 'card' ? 'bg-blue-100 text-blue-700' :
                                                            order.paymentMethod === 'qr' ? 'bg-teal-100 text-teal-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {order.paymentMethod === 'upi' ? '📱 UPI' : order.paymentMethod === 'card' ? '💳 Card' : order.paymentMethod === 'qr' ? '📷 QR Scan' : '🏠 COD'}
                                                    </span>
                                                    <span className={`ml-1 px-2 py-1 rounded-full text-xs font-bold ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {order.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
                                                    </span>
                                                    {order.transactionId && <p className="text-xs text-gray-400 mt-1">TXN: {order.transactionId}</p>}
                                                </td>
                                                <td className="p-3">
                                                    <select
                                                        value={order.orderStatus}
                                                        onChange={async (e) => {
                                                            try {
                                                                await axios.put(`${API}/marketplace/orders/${order._id}`, { orderStatus: e.target.value }, config);
                                                                fetchData();
                                                            } catch (err) { alert('Error updating status'); }
                                                        }}
                                                        className={`text-xs font-bold px-2 py-1 rounded-lg border ${order.orderStatus === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                                            order.orderStatus === 'shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                                order.orderStatus === 'confirmed' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                                    order.orderStatus === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                                                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                            }`}
                                                    >
                                                        <option value="pending">⏳ Pending</option>
                                                        <option value="confirmed">✅ Confirmed</option>
                                                        <option value="shipped">📦 Shipped</option>
                                                        <option value="delivered">🎉 Delivered</option>
                                                        <option value="cancelled">❌ Cancelled</option>
                                                    </select>
                                                </td>
                                                <td className="p-3 text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                <td className="p-3">
                                                    <button
                                                        onClick={async () => {
                                                            if (!window.confirm('Delete this order?')) return;
                                                            try {
                                                                await axios.delete(`${API}/marketplace/orders/${order._id}`, config);
                                                                fetchData();
                                                            } catch (err) { alert('Error deleting order'); }
                                                        }}
                                                        className="text-red-500 hover:text-red-700 font-bold text-xs"
                                                    >🗑️ Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ==================== TRANSPORT TAB ==================== */}
                {activeTab === 'transport' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-fade-in-up">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">🚆 Transport Management</h2>
                            <button onClick={() => setShowTransportModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-bold">
                                + Add Hub
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">City</th>
                                        <th className="px-6 py-4">Coordinates</th>
                                        <th className="px-6 py-4">Facilities</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {transports.map(t => (
                                        <tr key={t._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 font-medium text-gray-900">{t.name}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${t.type === 'airport' ? 'bg-blue-100 text-blue-800' : t.type === 'railway' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                    {t.type === 'airport' ? '✈️' : t.type === 'railway' ? '🚆' : '🚌'} {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{t.city}</td>
                                            <td className="px-6 py-4 text-xs text-gray-400 font-mono">{t.lat?.toFixed(4)}, {t.lng?.toFixed(4)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {t.facilities?.map((f, i) => (
                                                        <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">{f}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => handleDeleteTransport(t._id)} className="text-red-500 hover:text-red-700 font-medium text-sm">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {transports.length === 0 && (
                                <div className="p-12 text-center text-gray-500">No transport hubs found.</div>
                            )}
                        </div>
                    </div>
                )}

                {/* ==================== FEEDBACK TAB ==================== */}
                {activeTab === 'feedback' && (
                    <div className="space-y-8 animate-fade-in-up">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                            </div>
                        ) : feedbackAnalytics ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                                        <h3 className="text-gray-500 font-bold uppercase text-xs tracking-wider">Total Feedback</h3>
                                        <p className="text-3xl font-bold text-gray-800 mt-2">{feedbackAnalytics.totalFeedback}</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                                        <h3 className="text-gray-500 font-bold uppercase text-xs tracking-wider">Positive</h3>
                                        <p className="text-3xl font-bold text-green-600 mt-2">{feedbackAnalytics.sentimentBreakdown.positive}</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
                                        <h3 className="text-gray-500 font-bold uppercase text-xs tracking-wider">Avg Rating</h3>
                                        <p className="text-3xl font-bold text-yellow-600 mt-2">⭐ {feedbackAnalytics.avgRating?.toFixed(1)}</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
                                        <h3 className="text-gray-500 font-bold uppercase text-xs tracking-wider">Negative</h3>
                                        <p className="text-3xl font-bold text-red-600 mt-2">{feedbackAnalytics.sentimentBreakdown.negative}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white p-8 rounded-xl shadow-sm">
                                        <h2 className="text-xl font-bold mb-6 text-gray-800">Sentiment Distribution</h2>
                                        <div className="h-72">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={sentimentPieData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                                                        {sentimentPieData.map((entry, index) => (
                                                            <Cell key={index} fill={SENTIMENT_COLORS[entry.name.toLowerCase()]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                    <Legend />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    <div className="bg-white p-8 rounded-xl shadow-sm">
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-xl font-bold text-gray-800">Recent Reviews</h2>
                                            <button onClick={exportCSV} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-black transition">
                                                📥 Export CSV
                                            </button>
                                        </div>
                                        <div className="space-y-3 max-h-72 overflow-y-auto">
                                            {feedbackAnalytics.recentFeedback.map((f, i) => (
                                                <div key={i} className="border rounded-lg p-3 flex items-start gap-3">
                                                    <div className={`w-2 h-2 rounded-full mt-2 ${f.sentiment === 'positive' ? 'bg-green-500' : f.sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between">
                                                            <span className="font-bold text-sm text-gray-800">{f.userId?.name || 'User'}</span>
                                                            <span className="text-xs text-gray-400">{new Date(f.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 line-clamp-2">{f.comment}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-yellow-500 text-xs">{'⭐'.repeat(f.rating)}</span>
                                                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${f.sentiment === 'positive' ? 'bg-green-100 text-green-700' : f.sentiment === 'negative' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                                {f.sentiment.toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-20 text-gray-500">
                                <div className="text-6xl mb-4">📊</div>
                                <p>No feedback data available yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* ==================== JOB APPLICATIONS TAB ==================== */}
                {activeTab === 'applications' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800">📄 Job Applications</h2>
                            <span className="text-sm text-gray-500">{applications.length} total applications</span>
                        </div>
                        {applications.length === 0 ? (
                            <div className="text-center text-gray-400 py-16">
                                <div className="text-6xl mb-4">📭</div>
                                <p className="text-lg font-medium">No applications received yet.</p>
                                <p className="text-sm">Applications from the Careers page will appear here.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {applications.map((app) => (
                                    <div key={app._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                                                        {app.name?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-800 text-lg">{app.name}</h3>
                                                        <span className="inline-block px-3 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                                                            {app.jobTitle}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-13 flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                                                    <span>📧 {app.email}</span>
                                                    <span>📱 {app.phone}</span>
                                                    <span>📅 {new Date(app.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <a
                                                    href={`${API_BASE}${app.resume}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-bold text-sm hover:bg-blue-100 transition"
                                                >
                                                    📥 View Resume
                                                </a>
                                                <button
                                                    onClick={async () => {
                                                        if (!window.confirm('Delete this application?')) return;
                                                        try {
                                                            const token = user?.token || user?.user?.token;
                                                            await axios.delete(`${API}/career/applications/${app._id}`, {
                                                                headers: { Authorization: `Bearer ${token}` }
                                                            });
                                                            setApplications(applications.filter(a => a._id !== app._id));
                                                        } catch (err) {
                                                            alert('Failed to delete');
                                                        }
                                                    }}
                                                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg font-bold text-sm hover:bg-red-100 transition"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ==================== MODALS ==================== */}

            {/* CREATE USER MODAL */}
            {
                showUserModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl w-full max-w-md p-6">
                            <h2 className="text-xl font-bold mb-4">Add New User</h2>
                            <form onSubmit={handleCreateUser} className="space-y-4">
                                <input type="text" placeholder="Full Name" className="w-full border p-2 rounded-lg" value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} required />
                                <input type="email" placeholder="Email Address" className="w-full border p-2 rounded-lg" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} required />
                                <input type="password" placeholder="Password" className="w-full border p-2 rounded-lg" value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} required />
                                <select className="w-full border p-2 rounded-lg" value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
                                    <option value="tourist">Tourist</option>
                                    <option value="guide">Guide</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <div className="flex justify-end gap-2 mt-6">
                                    <button type="button" onClick={() => setShowUserModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg font-bold">Create User</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* CREATE SITE MODAL */}
            {
                showSiteModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl w-full max-w-lg p-6">
                            <h2 className="text-xl font-bold mb-4">Add Heritage Site</h2>
                            <form onSubmit={handleCreateSite} className="space-y-4">
                                <input type="text" placeholder="Site Name" className="w-full border p-2 rounded-lg" value={siteForm.name} onChange={e => setSiteForm({ ...siteForm, name: e.target.value })} required />
                                <input type="text" placeholder="Location" className="w-full border p-2 rounded-lg" value={siteForm.location} onChange={e => setSiteForm({ ...siteForm, location: e.target.value })} required />
                                <textarea placeholder="Description" rows="3" className="w-full border p-2 rounded-lg" value={siteForm.description} onChange={e => setSiteForm({ ...siteForm, description: e.target.value })} required></textarea>
                                <input type="text" placeholder="Image URL" className="w-full border p-2 rounded-lg" value={siteForm.image} onChange={e => setSiteForm({ ...siteForm, image: e.target.value })} />
                                <input type="text" placeholder="VR Link (Optional)" className="w-full border p-2 rounded-lg" value={siteForm.vrLink} onChange={e => setSiteForm({ ...siteForm, vrLink: e.target.value })} />
                                <div className="flex justify-end gap-2 mt-6">
                                    <button type="button" onClick={() => setShowSiteModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg font-bold">Add Site</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* CREATE MARKETPLACE ITEM MODAL */}
            {
                showMarketModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl w-full max-w-lg p-6">
                            <h2 className="text-xl font-bold mb-4">Add Marketplace Item</h2>
                            <form onSubmit={handleCreateMarketItem} className="space-y-4">
                                <input type="text" placeholder="Item Name" className="w-full border p-2 rounded-lg" value={marketForm.name} onChange={e => setMarketForm({ ...marketForm, name: e.target.value })} required />
                                <textarea placeholder="Description" rows="3" className="w-full border p-2 rounded-lg" value={marketForm.description} onChange={e => setMarketForm({ ...marketForm, description: e.target.value })} required></textarea>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="number" placeholder="Price (₹)" className="w-full border p-2 rounded-lg" value={marketForm.price} onChange={e => setMarketForm({ ...marketForm, price: e.target.value })} required />
                                    <select className="w-full border p-2 rounded-lg" value={marketForm.category} onChange={e => setMarketForm({ ...marketForm, category: e.target.value })}>
                                        <option value="handicrafts">Handicrafts</option>
                                        <option value="homestays">Homestays</option>
                                        <option value="events">Events</option>
                                        <option value="ecotourism">Ecotourism</option>
                                    </select>
                                </div>
                                <input type="text" placeholder="Location" className="w-full border p-2 rounded-lg" value={marketForm.location} onChange={e => setMarketForm({ ...marketForm, location: e.target.value })} />
                                <input type="text" placeholder="Contact Info" className="w-full border p-2 rounded-lg" value={marketForm.contact} onChange={e => setMarketForm({ ...marketForm, contact: e.target.value })} />
                                <input type="text" placeholder="Image URL" className="w-full border p-2 rounded-lg" value={marketForm.image} onChange={e => setMarketForm({ ...marketForm, image: e.target.value })} />
                                <div className="flex justify-end gap-2 mt-6">
                                    <button type="button" onClick={() => setShowMarketModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg font-bold">Add Item</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* CREATE TRANSPORT HUB MODAL */}
            {
                showTransportModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl w-full max-w-lg p-6">
                            <h2 className="text-xl font-bold mb-4">Add Transport Hub</h2>
                            <form onSubmit={handleCreateTransport} className="space-y-4">
                                <input type="text" placeholder="Hub Name (e.g. Ranchi Junction)" className="w-full border p-2 rounded-lg" value={transportForm.name} onChange={e => setTransportForm({ ...transportForm, name: e.target.value })} required />
                                <div className="grid grid-cols-2 gap-4">
                                    <select className="w-full border p-2 rounded-lg" value={transportForm.type} onChange={e => setTransportForm({ ...transportForm, type: e.target.value })}>
                                        <option value="airport">✈️ Airport</option>
                                        <option value="railway">🚆 Railway Station</option>
                                        <option value="bus">🚌 Bus Stand</option>
                                    </select>
                                    <input type="text" placeholder="City" className="w-full border p-2 rounded-lg" value={transportForm.city} onChange={e => setTransportForm({ ...transportForm, city: e.target.value })} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="number" step="any" placeholder="Latitude" className="w-full border p-2 rounded-lg" value={transportForm.lat} onChange={e => setTransportForm({ ...transportForm, lat: e.target.value })} required />
                                    <input type="number" step="any" placeholder="Longitude" className="w-full border p-2 rounded-lg" value={transportForm.lng} onChange={e => setTransportForm({ ...transportForm, lng: e.target.value })} required />
                                </div>
                                <input type="text" placeholder="Facilities (comma separated)" className="w-full border p-2 rounded-lg" value={transportForm.facilities} onChange={e => setTransportForm({ ...transportForm, facilities: e.target.value })} />
                                <div className="flex justify-end gap-2 mt-6">
                                    <button type="button" onClick={() => setShowTransportModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg font-bold">Add Hub</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* ==================== HOTELS TAB ==================== */}
            {activeTab === 'hotels' && (
                <div className="space-y-6 animate-fade-in-up">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">🏨 Hotel Listings ({adminHotels.length})</h2>
                        <button onClick={() => setShowHotelModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition">+ Add Hotel</button>
                    </div>

                    {adminHotels.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 text-center">
                            <div className="text-5xl mb-4">🏨</div>
                            <p className="text-gray-500">No hotels listed yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {adminHotels.map(hotel => (
                                <div key={hotel._id} className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold text-lg">🏨 {hotel.hotelName}</h3>
                                            <p className="text-gray-500 text-xs">📍 {hotel.location || 'N/A'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-black text-primary">₹{hotel.pricePerNight}</p>
                                            <p className="text-[10px] text-gray-400">per night</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mb-2">
                                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{hotel.roomType}</span>
                                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">👥 Max {hotel.maxGuests}</span>
                                    </div>
                                    {hotel.amenities?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {hotel.amenities.map((a, i) => (
                                                <span key={i} className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[10px]">{a}</span>
                                            ))}
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-500 mb-3">🧑‍🏫 Guide: <strong>{hotel.guide?.name || 'Unknown'}</strong></p>
                                    <button onClick={() => handleAdminDeleteHotel(hotel._id)} className="text-red-500 text-sm hover:underline">🗑️ Delete</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* CREATE HOTEL MODAL (Admin) */}
            {showHotelModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl w-full max-w-lg p-6">
                        <h2 className="text-xl font-bold mb-4">🏨 Add Hotel (Admin)</h2>
                        <form onSubmit={handleAdminCreateHotel} className="space-y-4">
                            <select className="w-full border p-2 rounded-lg" value={hotelForm.guideId} onChange={e => setHotelForm({ ...hotelForm, guideId: e.target.value })} required>
                                <option value="">Select Guide...</option>
                                {guides.map(g => (
                                    <option key={g._id} value={g._id}>{g.name} ({g.email})</option>
                                ))}
                            </select>
                            <input type="text" placeholder="Hotel Name" className="w-full border p-2 rounded-lg" value={hotelForm.hotelName} onChange={e => setHotelForm({ ...hotelForm, hotelName: e.target.value })} required />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Location" className="w-full border p-2 rounded-lg" value={hotelForm.location} onChange={e => setHotelForm({ ...hotelForm, location: e.target.value })} />
                                <input type="number" placeholder="Price/Night (₹)" className="w-full border p-2 rounded-lg" value={hotelForm.pricePerNight} onChange={e => setHotelForm({ ...hotelForm, pricePerNight: e.target.value })} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <select className="w-full border p-2 rounded-lg" value={hotelForm.roomType} onChange={e => setHotelForm({ ...hotelForm, roomType: e.target.value })}>
                                    <option value="Single">Single Room</option>
                                    <option value="Double">Double Room</option>
                                    <option value="Suite">Suite</option>
                                    <option value="Deluxe">Deluxe</option>
                                    <option value="Dormitory">Dormitory</option>
                                </select>
                                <input type="number" placeholder="Max Guests" className="w-full border p-2 rounded-lg" value={hotelForm.maxGuests} onChange={e => setHotelForm({ ...hotelForm, maxGuests: e.target.value })} />
                            </div>
                            <input type="text" placeholder="Amenities (WiFi, AC, Breakfast...)" className="w-full border p-2 rounded-lg" value={hotelForm.amenities} onChange={e => setHotelForm({ ...hotelForm, amenities: e.target.value })} />
                            <textarea placeholder="Description" className="w-full border p-2 rounded-lg" rows="2" value={hotelForm.description} onChange={e => setHotelForm({ ...hotelForm, description: e.target.value })} />
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setShowHotelModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg font-bold">Add Hotel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div >
    );
};

export default AdminDashboard;
