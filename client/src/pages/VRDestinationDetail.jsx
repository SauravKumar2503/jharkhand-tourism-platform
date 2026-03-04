import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { vrToursData } from '../data/vrTours';
import VRViewer from '../components/VRViewer';

const VRDestinationDetail = () => {
    const { id } = useParams();
    const destination = vrToursData.find(d => d.id === parseInt(id));
    const [showVR, setShowVR] = useState(false);

    if (!destination) {
        return <div className="pt-24 text-center">Destination not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-8">
            {/* Navigation */}
            <div className="max-w-6xl mx-auto mb-6">
                <Link to="/vr" className="text-primary font-semibold hover:underline flex items-center gap-2">
                    &larr; Back to VR Tours
                </Link>
            </div>

            {/* Header Content */}
            <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden mb-12 animate-fade-in-up">
                <div className="h-64 md:h-96 relative bg-gray-900">
                    <img
                        src={destination.thumbnail}
                        alt={destination.title}
                        className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end pointer-events-none">
                        <div className="p-8 w-full">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">{destination.title}</h1>
                            <p className="text-gray-200 text-lg flex items-center gap-2 drop-shadow-md">
                                📍 {destination.location}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">About the Place</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">{destination.description}</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">History & Significance</h2>
                            <p className="text-gray-600 leading-relaxed">{destination.history}</p>
                        </div>

                        {/* VR Section Trigger */}
                        {/* VR Section Trigger */}
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-center shadow-lg transform hover:scale-[1.01] transition duration-300 border border-gray-700">
                            <h2 className="text-2xl font-bold text-white mb-4">Ready to step inside?</h2>
                            <p className="text-gray-300 mb-8">Experience {destination.title} in 360-degree virtual reality.</p>
                            <button
                                onClick={() => setShowVR(true)}
                                className="bg-primary hover:bg-orange-600 text-white text-lg font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center gap-3 mx-auto animate-pulse"
                            >
                                👓 Enter VR Experience
                            </button>
                        </div>


                    </div>

                    <div className="space-y-8">
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4 text-lg">Highlights</h3>
                            <ul className="space-y-3">
                                {destination.highlights.map((h, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-600">
                                        <span className="text-primary text-xl">✓</span> {h}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                            <h3 className="font-bold text-blue-900 mb-2">Best Time to Visit</h3>
                            <p className="text-blue-800">{destination.bestTime}</p>
                        </div>

                        {/* Connectivity Info */}
                        <div className="bg-green-50 p-6 rounded-2xl border border-green-100 space-y-4">
                            <h3 className="font-bold text-green-900 text-lg">How to Reach</h3>
                            <div className="space-y-3 text-xs">
                                <div className="flex items-center justify-between text-green-800 whitespace-nowrap">
                                    <span className="flex items-center gap-2">✈️ {destination.connectivity?.airport?.name}</span>
                                    <span className="font-bold">{destination.connectivity?.airport?.distance}</span>
                                </div>
                                <div className="flex items-center justify-between text-green-800 whitespace-nowrap">
                                    <span className="flex items-center gap-2">🚆 {destination.connectivity?.railway?.name}</span>
                                    <span className="font-bold">{destination.connectivity?.railway?.distance}</span>
                                </div>
                                <div className="flex items-center justify-between text-green-800 whitespace-nowrap">
                                    <span className="flex items-center gap-2">🚌 {destination.connectivity?.bus?.name}</span>
                                    <span className="font-bold">{destination.connectivity?.bus?.distance}</span>
                                </div>
                            </div>
                        </div>

                        {/* Google Map */}
                        {destination.mapEmbed && (
                            <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200 h-64">
                                <iframe
                                    src={destination.mapEmbed}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    title="Location Map"
                                ></iframe>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* VR Modal / Viewer Overlay */}
            {showVR && (
                <div className="fixed inset-0 z-[100] bg-black animate-fade-in flex flex-col">
                    <div className="absolute top-4 right-4 z-[101]">
                        <button
                            onClick={() => setShowVR(false)}
                            className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-3 rounded-full transition"
                        >
                            ✕ Close VR
                        </button>
                    </div>
                    <div className="flex-1 w-full h-full relative">
                        <VRViewer panoId={destination.panoId} lat={destination.lat} lng={destination.lng} title={destination.title} location={destination.location} />
                    </div>
                    {/* Instructions overlay handled inside VRViewer now for better z-index control */}
                </div>
            )}
        </div>
    );
};

export default VRDestinationDetail;
