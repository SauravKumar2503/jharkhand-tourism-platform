import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import aiService from '../services/aiService';
import AuthContext from '../context/AuthContext';
import { vrToursData } from '../data/vrTours';

const Itinerary = () => {
    const [preferences, setPreferences] = useState([]);
    const [itinerary, setItinerary] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);

    const categories = [
        { id: 'Nature', label: 'Nature & Wildlife', icon: '🌲', color: 'from-green-400 to-emerald-600' },
        { id: 'Heritage', label: 'Heritage & History', icon: '🏰', color: 'from-amber-400 to-orange-600' },
        { id: 'Spiritual', label: 'Spiritual & Peaceful', icon: '🕉️', color: 'from-purple-400 to-indigo-600' },
        { id: 'Adventure', label: 'Adventure Sports', icon: '⛰️', color: 'from-blue-400 to-cyan-600' },
        { id: 'Culture', label: 'Local Culture', icon: '🎭', color: 'from-rose-400 to-pink-600' }
    ];

    const findMatchingDestination = (placeName) => {
        if (!placeName) return null;
        const normalizedPlace = placeName.toLowerCase();
        return vrToursData.find(dest =>
            normalizedPlace.includes(dest.title.toLowerCase()) ||
            dest.title.toLowerCase().includes(normalizedPlace)
        );
    };

    const handlePreferenceChange = (pref) => {
        if (preferences.includes(pref)) {
            setPreferences(preferences.filter(p => p !== pref));
        } else {
            setPreferences([...preferences, pref]);
        }
    };

    const handleGenerate = async () => {
        if (!user) {
            alert("Please login to generate itinerary");
            return;
        }

        if (preferences.length === 0) {
            alert("Please select at least one interest");
            return;
        }

        setLoading(true);
        try {
            const token = user.token || JSON.parse(localStorage.getItem('user')).token;
            const data = await aiService.generateItinerary(preferences, token);
            setItinerary(data.itinerary);
            // Smooth scroll to results
            setTimeout(() => {
                document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (error) {
            console.error("Itinerary Error:", error);
            alert("Failed to generate itinerary");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Header */}
            <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
                <img
                    src="/images/plan-trip-jharkhand.png"
                    alt="Jharkhand Travel Planning"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-gray-50"></div>

                <div className="relative z-10 text-center px-4 animate-fade-in-up">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-2xl">
                        Plan Your <span className="text-orange-400">Dream Journey</span>
                    </h1>
                    <p className="text-xl text-gray-200 max-w-2xl mx-auto font-medium">
                        Let our AI curate a personalized travel experience through the hidden gems of Jharkhand.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-20 relative z-20">
                {/* Interest Selector Card */}
                <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/20 mb-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl">✨</div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">What do you love?</h2>
                                <p className="text-gray-500">Select your interests to tailor your itinerary</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => handlePreferenceChange(cat.id)}
                                    className={`group relative p-6 rounded-3xl transition-all duration-500 overflow-hidden border-2 ${preferences.includes(cat.id)
                                        ? 'border-transparent shadow-lg scale-105'
                                        : 'border-gray-100 bg-gray-50/50 hover:bg-white hover:border-orange-200'
                                        }`}
                                >
                                    {preferences.includes(cat.id) && (
                                        <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-90 animate-fade-in`}></div>
                                    )}
                                    <div className="relative z-10 flex flex-col items-center gap-3">
                                        <span className={`text-4xl transition-transform duration-500 group-hover:scale-110 ${preferences.includes(cat.id) ? 'drop-shadow-md' : ''
                                            }`}>
                                            {cat.icon}
                                        </span>
                                        <span className={`font-bold text-sm tracking-wide text-center ${preferences.includes(cat.id) ? 'text-white' : 'text-gray-600'
                                            }`}>
                                            {cat.id}
                                        </span>
                                    </div>
                                    {preferences.includes(cat.id) && (
                                        <div className="absolute top-2 right-2 bg-white/20 p-1 rounded-full text-white text-[10px] animate-bounce">
                                            ✓
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className={`group relative px-12 py-5 rounded-2xl font-black text-xl tracking-tighter transition-all duration-500 flex items-center gap-4 overflow-hidden ${loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gray-900 text-white hover:bg-black hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating Magic...
                                    </>
                                ) : (
                                    <>
                                        Generate Itinerary
                                        <span className="text-2xl transition-transform group-hover:translate-x-2">🚀</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                {itinerary.length > 0 && (
                    <div id="results-section" className="max-w-4xl mx-auto animate-fade-in-up">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Your Curated Journey</h2>
                            <div className="h-1.5 w-24 bg-gradient-to-r from-orange-400 to-amber-600 mx-auto rounded-full"></div>
                        </div>

                        <div className="relative">
                            {/* Vertical Line */}
                            <div className="absolute left-[27px] md:left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-orange-100 via-orange-300 to-orange-100 hidden md:block"></div>

                            <div className="space-y-12">
                                {itinerary.map((place, index) => {
                                    const match = findMatchingDestination(place);
                                    return (
                                        <div key={index} className={`relative flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                            }`}>
                                            {/* Mobile Circle */}
                                            {match ? (
                                                <Link to={`/vr/${match.id}`} className="flex md:hidden absolute left-0 w-14 h-14 bg-white rounded-full shadow-lg border-4 border-orange-400 items-center justify-center z-10 hover:scale-110 transition-transform">
                                                    <span className="text-xl font-black text-orange-400">{index + 1}</span>
                                                </Link>
                                            ) : (
                                                <div className="flex md:hidden absolute left-0 w-14 h-14 bg-white rounded-full shadow-lg border-4 border-orange-400 items-center justify-center z-10">
                                                    <span className="text-xl font-black text-orange-400">{index + 1}</span>
                                                </div>
                                            )}

                                            {/* Content Card */}
                                            <div className={`flex-1 bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'
                                                }`}>
                                                <div className={`flex flex-col gap-2 ${index % 2 === 0 ? 'md:items-end' : 'md:items-start'
                                                    }`}>
                                                    <span className="px-4 py-1 bg-orange-50 text-orange-600 rounded-full text-sm font-bold tracking-wider uppercase">
                                                        Stop {index + 1}
                                                    </span>
                                                    {match ? (
                                                        <Link to={`/vr/${match.id}`} className="block group/title">
                                                            <h3 className="text-2xl font-bold text-gray-800 group-hover:text-orange-600 group-hover/title:underline transition-all">
                                                                {place} <span className="inline-block transition-transform group-hover/title:translate-x-1">→</span>
                                                            </h3>
                                                        </Link>
                                                    ) : (
                                                        <h3 className="text-2xl font-bold text-gray-800">
                                                            {place}
                                                        </h3>
                                                    )}
                                                    <p className="text-gray-500 leading-relaxed italic">
                                                        Explore the beauty and significance of this magnificent destination in Jharkhand.
                                                    </p>
                                                    {match && (
                                                        <div className="mt-2 text-xs font-bold text-orange-400 uppercase tracking-widest animate-pulse">
                                                            View Details & VR Tour
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Desktop Center Circle */}
                                            {match ? (
                                                <Link to={`/vr/${match.id}`} className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-full shadow-lg border-4 border-orange-400 items-center justify-center z-10 transition-transform hover:scale-125 hover:shadow-orange-200">
                                                    <span className="text-xl font-black text-orange-400">{index + 1}</span>
                                                </Link>
                                            ) : (
                                                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-full shadow-lg border-4 border-orange-400 items-center justify-center z-10 transition-transform hover:scale-125">
                                                    <span className="text-xl font-black text-orange-400">{index + 1}</span>
                                                </div>
                                            )}

                                            {/* Spacer for empty side */}
                                            <div className="hidden md:block flex-1"></div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ==================== VR TOURS SECTION ==================== */}
                        <div className="mt-16">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">🥽 VR Tours for Your Stops</h2>
                                <p className="text-gray-500">Experience every stop of your journey virtually!</p>
                                <div className="h-1.5 w-24 bg-gradient-to-r from-purple-400 to-fuchsia-600 mx-auto rounded-full mt-3"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {itinerary.map((place, index) => {
                                    const tour = findMatchingDestination(place);
                                    if (tour) {
                                        return (
                                            <Link
                                                to={`/vr/${tour.id}`}
                                                key={`vr-${index}`}
                                                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 block"
                                            >
                                                <div className="relative h-48 overflow-hidden">
                                                    <img
                                                        src={tour.thumbnail}
                                                        alt={tour.title}
                                                        className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition flex items-center justify-center">
                                                        <div className="w-14 h-14 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white text-xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition duration-300">
                                                            👓
                                                        </div>
                                                    </div>
                                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-purple-600 shadow-sm">
                                                        360° TOUR
                                                    </div>
                                                    <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                                        Stop {index + 1}
                                                    </div>
                                                </div>
                                                <div className="p-5">
                                                    <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-purple-600 transition">{tour.title}</h3>
                                                    <p className="text-gray-500 text-sm line-clamp-2">{tour.description}</p>
                                                    <div className="flex items-center text-purple-600 font-bold text-sm mt-3">
                                                        Start VR Experience &rarr;
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    }
                                    // Unmatched stop — show placeholder card
                                    return (
                                        <div
                                            key={`vr-${index}`}
                                            className="group bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 block"
                                        >
                                            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 flex items-center justify-center">
                                                <div className="text-center">
                                                    <div className="text-5xl mb-2">🏞️</div>
                                                    <p className="text-white/70 text-sm font-medium">Virtual Tour</p>
                                                </div>
                                                <div className="absolute top-3 left-3 bg-amber-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                                    ⏳ Coming Soon
                                                </div>
                                                <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                                    Stop {index + 1}
                                                </div>
                                            </div>
                                            <div className="p-5">
                                                <h3 className="text-lg font-bold text-gray-800 mb-1">{place}</h3>
                                                <p className="text-gray-500 text-sm">Explore the beauty and significance of this magnificent destination in Jharkhand.</p>
                                                <div className="flex items-center text-amber-500 font-bold text-sm mt-3">
                                                    VR Tour Coming Soon ✨
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Download PDF Button */}
                        <div className="mt-16 text-center">
                            <button
                                onClick={() => {
                                    const printWindow = window.open('', '_blank');
                                    const content = `
                                        <!DOCTYPE html>
                                        <html>
                                        <head>
                                            <title>My Jharkhand Itinerary</title>
                                            <style>
                                                body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1a1a1a; }
                                                h1 { text-align: center; color: #ea580c; font-size: 28px; margin-bottom: 5px; }
                                                .subtitle { text-align: center; color: #888; font-size: 14px; margin-bottom: 30px; }
                                                .divider { height: 3px; width: 80px; background: linear-gradient(to right, #ea580c, #f59e0b); margin: 0 auto 30px; border-radius: 4px; }
                                                .stop { margin-bottom: 24px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; page-break-inside: avoid; }
                                                .stop-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
                                                .stop-number { background: #ea580c; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; flex-shrink: 0; }
                                                .stop-name { font-size: 20px; font-weight: 700; color: #1a1a1a; }
                                                .stop-desc { color: #6b7280; font-style: italic; margin-left: 44px; font-size: 14px; }
                                                .vr-badge { display: inline-block; background: #f3e8ff; color: #7c3aed; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; margin-left: 10px; }
                                                .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px; }
                                            </style>
                                        </head>
                                        <body>
                                            <h1>🗺️ Your Curated Jharkhand Journey</h1>
                                            <p class="subtitle">Generated on ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            <div class="divider"></div>
                                            ${itinerary.map((place, i) => {
                                        const match = findMatchingDestination(place);
                                        return `<div class="stop">
                                                    <div class="stop-header">
                                                        <div class="stop-number">${i + 1}</div>
                                                        <span class="stop-name">${place}</span>
                                                        ${match ? '<span class="vr-badge">🥽 VR Tour Available</span>' : ''}
                                                    </div>
                                                    <p class="stop-desc">Explore the beauty and significance of this magnificent destination in Jharkhand.</p>
                                                </div>`;
                                    }).join('')}
                                            <div class="footer">
                                                <p>Jharkhand Tourism Platform • AI-Powered Itinerary</p>
                                                <p>www.jharkhandtourism.com</p>
                                            </div>
                                        </body>
                                        </html>
                                    `;
                                    printWindow.document.write(content);
                                    printWindow.document.close();
                                    printWindow.onload = () => {
                                        printWindow.print();
                                        printWindow.close();
                                    };
                                }}
                                className="bg-white border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-2xl font-bold hover:bg-gray-900 hover:text-white transition flex items-center gap-3 mx-auto shadow-md"
                            >
                                🖨️ Download as PDF
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Itinerary;
