import { useState, useEffect } from 'react';
import { popularDestinations } from '../data/transportData';
import { transportData as staticTransportData } from '../data/transportData';
import axios from 'axios';
import API_BASE from '../config';

const typeIcons = { airport: '✈️', railway: '🚆', bus: '🚌' };
const typeLabels = { airport: 'Airport', railway: 'Railway Station', bus: 'Bus Stand' };
const typeColors = { airport: 'from-blue-500 to-indigo-600', railway: 'from-red-500 to-rose-600', bus: 'from-green-500 to-emerald-600' };

const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
};

const TransportInfo = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [nearbyHubs, setNearbyHubs] = useState([]);
    const [transportData, setTransportData] = useState([]);

    // Fetch transport data from API
    useEffect(() => {
        const fetchTransport = async () => {
            try {
                const res = await axios.get(``);
                setTransportData(res.data);
            } catch (err) {
                console.error("API failed, using static data:", err);
                setTransportData(staticTransportData);
            }
        };
        fetchTransport();
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                },
                (err) => {
                    setLocationError('Unable to get your location. Showing all transport hubs.');
                    setUserLocation({ lat: 23.3441, lng: 85.3096 });
                }
            );
        } else {
            setLocationError('Geolocation not supported. Showing default location.');
            setUserLocation({ lat: 23.3441, lng: 85.3096 });
        }
    }, []);

    useEffect(() => {
        if (userLocation && transportData.length > 0) {
            const withDistance = transportData.map(hub => ({
                ...hub,
                distance: getDistance(userLocation.lat, userLocation.lng, hub.lat, hub.lng)
            }));
            withDistance.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
            setNearbyHubs(withDistance);
        }
    }, [userLocation, transportData]);

    const filteredHubs = activeFilter === 'all'
        ? nearbyHubs
        : nearbyHubs.filter(h => h.type === activeFilter);

    const mapSrc = userLocation
        ? `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d50000!2d${userLocation.lng}!3d${userLocation.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin`
        : null;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero */}
            <div className="relative h-[350px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-700">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\' fill=\'%23fff\' fill-opacity=\'.1\'/%3E%3C/svg%3E")' }}></div>
                <div className="relative z-10 text-center px-4 animate-fade-in-up">
                    <div className="text-6xl mb-4">🗺️</div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-2xl">
                        Transport & <span className="text-cyan-300">Navigation</span>
                    </h1>
                    <p className="text-xl text-blue-200 max-w-2xl mx-auto font-medium">
                        Find airports, railway stations, and bus stands near you across Jharkhand.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-16 relative z-20">
                {/* Map + Controls Card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/20 mb-10 overflow-hidden">
                    {/* Embedded Map */}
                    <div className="h-[300px] md:h-[400px] bg-gray-200 relative">
                        {mapSrc ? (
                            <iframe src={mapSrc} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="Your Location"></iframe>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-500"></div>
                                <span className="ml-3 text-gray-500">Detecting your location...</span>
                            </div>
                        )}
                        {userLocation && (
                            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg text-sm font-medium text-gray-700">
                                📍 Your Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                            </div>
                        )}
                    </div>

                    {/* Filter Buttons */}
                    <div className="p-6 flex flex-wrap gap-3">
                        {[{ id: 'all', icon: '🏪', label: 'All Hubs' }, { id: 'airport', icon: '✈️', label: 'Airports' }, { id: 'railway', icon: '🚆', label: 'Railway' }, { id: 'bus', icon: '🚌', label: 'Bus Stands' }].map(f => (
                            <button
                                key={f.id}
                                onClick={() => setActiveFilter(f.id)}
                                className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${activeFilter === f.id
                                    ? 'bg-gray-900 text-white shadow-lg scale-105'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <span className="text-lg">{f.icon}</span> {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {locationError && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
                        ⚠️ {locationError}
                    </div>
                )}

                {/* Transport Hubs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {filteredHubs.map((hub, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:-translate-y-1 animate-fade-in-up"
                            style={{ animationDelay: `${index * 60}ms` }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeColors[hub.type]} flex items-center justify-center text-xl text-white shadow-lg`}>
                                        {typeIcons[hub.type]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{hub.name}</h3>
                                        <p className="text-sm text-gray-500">{typeLabels[hub.type]} • {hub.city}</p>
                                    </div>
                                </div>
                                {hub.distance && (
                                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                                        {hub.distance} km
                                    </span>
                                )}
                            </div>
                            {hub.facilities && (
                                <div className="flex flex-wrap gap-1.5">
                                    {hub.facilities.map((f, i) => (
                                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Popular Destinations */}
                <div className="mb-16">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Distance to Popular Destinations</h2>
                        <div className="h-1.5 w-24 bg-gradient-to-r from-blue-400 to-indigo-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {popularDestinations.map((dest, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedDestination(dest)}
                                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-5 border border-gray-100 cursor-pointer hover:-translate-y-1 group"
                            >
                                <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">{dest.name}</h3>
                                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{dest.description}</p>
                                {userLocation && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-blue-500">📍</span>
                                        <span className="text-lg font-bold text-blue-700">
                                            {getDistance(userLocation.lat, userLocation.lng, dest.lat, dest.lng)} km
                                        </span>
                                        <span className="text-xs text-gray-400">from you</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransportInfo;
