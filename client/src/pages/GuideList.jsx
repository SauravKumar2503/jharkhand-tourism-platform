import { useEffect, useState, useContext } from 'react';
import guideService from '../services/guideService';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../config';
import Avatar from '../components/common/Avatar';

const GuideList = () => {
    const [guides, setGuides] = useState([]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [expandedGuide, setExpandedGuide] = useState(null);
    const [guidePackages, setGuidePackages] = useState({});
    const [loadingPackages, setLoadingPackages] = useState(null);

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const data = await guideService.getAllGuides();
                setGuides(data);
            } catch (error) {
                console.error("Error fetching guides:", error);
            }
        };
        fetchGuides();
    }, []);

    const handleViewPackages = async (guideId) => {
        if (expandedGuide === guideId) {
            setExpandedGuide(null);
            return;
        }
        setExpandedGuide(guideId);

        if (guidePackages[guideId]) return; // already fetched

        setLoadingPackages(guideId);
        try {
            const data = await guideService.getPackagesByGuideId(guideId);
            setGuidePackages(prev => ({ ...prev, [guideId]: data }));
        } catch (err) {
            console.error("Error fetching packages:", err);
            setGuidePackages(prev => ({ ...prev, [guideId]: [] }));
        }
        setLoadingPackages(null);
    };

    const handleBook = (guideId, pkg = null) => {
        if (!user) {
            alert("Please login to book a guide");
            navigate('/login');
            return;
        }
        if (pkg) {
            navigate(`/book/${guideId}?package=${pkg._id}`);
        } else {
            navigate(`/book/${guideId}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero */}
            <div className="relative h-[350px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-900 via-emerald-800 to-teal-700">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
                <div className="relative z-10 text-center px-4 animate-fade-in-up">
                    <div className="text-6xl mb-4">🧭</div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-2xl">
                        Meet Our <span className="text-teal-300">Experts</span>
                    </h1>
                    <p className="text-xl text-green-100 max-w-2xl mx-auto font-medium">
                        Explore Jharkhand with locals who know every hidden gem and story.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-16 relative z-20">
                {/* Search / Filters placeholder if needed in the future */}
                <div className="bg-white/90 backdrop-blur-xl p-4 md:p-6 rounded-[2rem] shadow-2xl border border-white/20 mb-10 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 px-4">Available Guides ({guides.length})</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {guides.map((guide, index) => (
                        <div key={guide._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-100 flex flex-col" style={{ animationDelay: `${index * 100}ms` }}>
                            {/* Card Header */}
                            <div className="h-32 bg-gradient-to-r from-primary to-green-600 relative">
                                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white flex items-center justify-center">
                                        <Avatar src={guide.profilePicture} name={guide.name} />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-16 pb-6 px-6 flex-grow flex flex-col text-center">
                                <h2 className="text-2xl font-bold text-gray-800 mb-1 flex items-center justify-center gap-2">
                                    {guide.name}
                                </h2>
                                <p className="text-sm text-primary font-semibold mb-4 uppercase tracking-wide">Professional Guide</p>

                                <p className="text-gray-600 mb-4 italic line-clamp-3">"{guide.guideProfile?.bio || "No bio available."}"</p>

                                <div className="flex flex-wrap justify-center gap-2 mb-4">
                                    {guide.guideProfile?.languages?.map(lang => (
                                        <span key={lang} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold border border-green-100">
                                            {lang}
                                        </span>
                                    ))}
                                </div>

                                {/* View Packages Button */}
                                <button
                                    onClick={() => handleViewPackages(guide._id)}
                                    className="mb-4 text-sm font-semibold text-primary hover:text-green-700 transition flex items-center justify-center gap-1 mx-auto"
                                >
                                    📦 {expandedGuide === guide._id ? 'Hide Packages' : 'View Packages'}
                                    <svg className={`w-4 h-4 transition-transform ${expandedGuide === guide._id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>

                                {/* Expanded Packages Section */}
                                {expandedGuide === guide._id && (
                                    <div className="bg-gray-50 rounded-xl p-4 mb-4 text-left animate-fade-in-up">
                                        <h3 className="font-bold text-sm text-gray-800 mb-3 uppercase tracking-wider">Tour Packages</h3>
                                        {loadingPackages === guide._id ? (
                                            <div className="flex justify-center py-4">
                                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                                            </div>
                                        ) : (guidePackages[guide._id] || []).length === 0 ? (
                                            <p className="text-gray-400 text-sm text-center py-2">No packages available yet.</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {(guidePackages[guide._id] || []).map(pkg => (
                                                    <div key={pkg._id} className="bg-white border border-gray-200 rounded-lg p-3 hover:border-primary transition">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <p className="font-bold text-gray-800 text-sm">{pkg.title}</p>
                                                                <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{pkg.description}</p>
                                                                <div className="flex gap-3 mt-1.5 text-xs text-gray-400">
                                                                    <span>⏳ {pkg.duration}h</span>
                                                                    {pkg.locations?.length > 0 && <span>📍 {pkg.locations.join(', ')}</span>}
                                                                </div>
                                                            </div>
                                                            <div className="text-right ml-3 flex-shrink-0">
                                                                <p className="text-lg font-black text-primary">₹{pkg.price}</p>
                                                                <button
                                                                    onClick={() => handleBook(guide._id, pkg)}
                                                                    className="mt-1 bg-secondary hover:bg-orange-600 text-white text-xs px-3 py-1.5 rounded-full font-bold transition"
                                                                >
                                                                    Book This
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="mt-auto border-t pt-6 flex justify-between items-center bg-gray-50 -mx-6 px-6 -mb-6 py-4">
                                    <div className="text-left">
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Hourly Rate</p>
                                        <p className="text-xl font-bold text-primary">₹{guide.guideProfile?.hourlyRate || 500}</p>
                                    </div>
                                    <button
                                        onClick={() => handleBook(guide._id)}
                                        className="bg-secondary hover:bg-orange-600 text-white px-6 py-2 rounded-full font-bold shadow-md transition transform hover:scale-105"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GuideList;
