import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import guideService from '../services/guideService';
import bookingService from '../services/bookingService';
import AuthContext from '../context/AuthContext';
import API_BASE from '../config';
import axios from 'axios';

const BookingPage = () => {
    const { guideId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [guide, setGuide] = useState(null);
    const [packages, setPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [date, setDate] = useState('');
    const [duration, setDuration] = useState(1);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Hotel stay state
    const [hotels, setHotels] = useState([]);
    const [wantHotel, setWantHotel] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [hotelCheckIn, setHotelCheckIn] = useState('');
    const [hotelCheckOut, setHotelCheckOut] = useState('');
    const [hotelNights, setHotelNights] = useState(0);

    useEffect(() => {
        const fetchGuideAndPackages = async () => {
            try {
                const guideData = await guideService.getGuideById(guideId);
                setGuide(guideData);

                try {
                    const packagesData = await guideService.getPackagesByGuideId(guideId);
                    setPackages(packagesData);

                    // Auto-select package if passed via URL
                    const pkgId = searchParams.get('package');
                    if (pkgId) {
                        const matchedPkg = packagesData.find(p => p._id === pkgId);
                        if (matchedPkg) {
                            setSelectedPackage(matchedPkg);
                            setDuration(matchedPkg.duration);
                        }
                    }
                } catch (pkgErr) {
                    console.error("Error fetching packages:", pkgErr);
                }

                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchGuideAndPackages();

        // Fetch guide's hotel listings
        const fetchHotels = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/hotels/guide/${guideId}`);
                setHotels(res.data);
            } catch (err) {
                console.error('Error fetching hotels:', err);
            }
        };
        fetchHotels();
    }, [guideId]);

    const handleSelectPackage = (pkg) => {
        if (selectedPackage?._id === pkg._id) {
            setSelectedPackage(null);
            setDuration(1);
        } else {
            setSelectedPackage(pkg);
            setDuration(pkg.duration);
        }
    };

    // Calculate hotel nights when dates change
    useEffect(() => {
        if (hotelCheckIn && hotelCheckOut) {
            const cin = new Date(hotelCheckIn);
            const cout = new Date(hotelCheckOut);
            const diff = Math.max(1, Math.ceil((cout - cin) / (1000 * 60 * 60 * 24)));
            setHotelNights(diff);
        } else {
            setHotelNights(0);
        }
    }, [hotelCheckIn, hotelCheckOut]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const currentRate = guide?.guideProfile?.hourlyRate || 500;
        const tourPrice = selectedPackage ? selectedPackage.price : (currentRate * duration);
        const hotelCost = (wantHotel && selectedHotel) ? (selectedHotel.pricePerNight * hotelNights) : 0;
        const currentTotal = tourPrice + hotelCost;

        try {
            const bookingData = {
                guideId,
                date,
                duration,
                totalPrice: currentTotal,
                packageId: selectedPackage?._id
            };

            // Add hotel stay data if selected
            if (wantHotel && selectedHotel && hotelNights > 0) {
                bookingData.hotelStay = selectedHotel._id;
                bookingData.hotelCheckIn = hotelCheckIn;
                bookingData.hotelCheckOut = hotelCheckOut;
                bookingData.hotelNights = hotelNights;
                bookingData.hotelPrice = hotelCost;
            }

            await bookingService.createBooking(bookingData, user.token);

            setShowSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 2500);
        } catch (err) {
            console.error(err);
            alert('Booking Failed');
            setSubmitting(false);
        }
    };

    if (loading) return <div className="pt-32 text-center text-lg font-bold text-gray-500">Loading Guide Details...</div>;
    if (!guide) return <div className="pt-32 text-center text-lg font-bold text-red-500">Guide Not Found</div>;

    const hourlyRate = guide.guideProfile?.hourlyRate || 500;
    const tourPrice = selectedPackage ? selectedPackage.price : (hourlyRate * duration);
    const hotelCost = (wantHotel && selectedHotel) ? (selectedHotel.pricePerNight * hotelNights) : 0;
    const totalPrice = tourPrice + hotelCost;

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-6">
            {showSuccess && (
                <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 animate-fade-in-up">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl transform scale-105 transition-all">
                        <div className="text-6xl mb-4">🎉✈️</div>
                        <h2 className="text-2xl font-bold text-primary mb-2">Booking Confirmed!</h2>
                        <p className="text-gray-600 text-lg">
                            Get ready for an amazing adventure with {guide.name}.
                        </p>
                        {selectedPackage && (
                            <p className="text-sm text-primary font-semibold mt-2">Package: {selectedPackage.title}</p>
                        )}
                        <p className="text-sm text-gray-400 mt-4">Redirecting to Dashboard...</p>
                    </div>
                </div>
            )}

            <div className="max-w-3xl mx-auto">
                {/* Main Booking Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="bg-primary text-white p-8">
                        <h1 className="text-3xl font-bold">Book a Tour</h1>
                        <p className="text-white/80 mt-2">with {guide.name}</p>
                    </div>

                    <div className="p-8">
                        {/* Guide Info */}
                        <div className="flex items-center space-x-6 mb-8 p-4 bg-gray-50 rounded-xl">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary bg-gray-200 flex items-center justify-center">
                                {guide.profilePicture ? (
                                    <img src={`${API_BASE}${guide.profilePicture}`} alt={guide.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-xl font-bold text-gray-600">
                                        {guide.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{guide.name}</h2>
                                <p className="text-gray-600 text-sm">Rate: ₹{hourlyRate}/hour</p>
                            </div>
                        </div>

                        {/* Tour Packages Section */}
                        {packages.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    📦 Available Tour Packages
                                    <span className="text-xs font-normal text-gray-400">(Select a package or book by hourly rate below)</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {packages.map(pkg => (
                                        <div
                                            key={pkg._id}
                                            onClick={() => handleSelectPackage(pkg)}
                                            className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedPackage?._id === pkg._id
                                                    ? 'border-primary bg-green-50 shadow-md'
                                                    : 'border-gray-200 hover:border-primary/50 hover:shadow-sm'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold text-gray-800">{pkg.title}</h4>
                                                        {selectedPackage?._id === pkg._id && (
                                                            <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">Selected ✓</span>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-500 text-xs mt-1 line-clamp-2">{pkg.description}</p>
                                                    <div className="flex gap-3 mt-2 text-xs text-gray-400">
                                                        <span>⏳ {pkg.duration} Hours</span>
                                                        {pkg.locations?.length > 0 && (
                                                            <span>📍 {pkg.locations.join(', ')}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-xl font-black text-primary ml-3">₹{pkg.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {selectedPackage && (
                                    <button
                                        onClick={() => { setSelectedPackage(null); setDuration(1); }}
                                        className="mt-3 text-sm text-red-500 hover:text-red-700 font-medium transition"
                                    >
                                        ✕ Clear package selection (use hourly rate instead)
                                    </button>
                                )}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                                <input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={date}
                                    onChange={(e) => {
                                        const selectedDate = e.target.value;
                                        const blockedDates = guide.guideProfile?.blockedDates?.map(d => d.split('T')[0]) || [];
                                        if (blockedDates.includes(selectedDate)) {
                                            alert(`The guide is unavailable on ${selectedDate}. Please choose another date.`);
                                            setDate('');
                                        } else {
                                            setDate(selectedDate);
                                        }
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Hours)</label>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="range"
                                        min="1"
                                        max="8"
                                        disabled={!!selectedPackage}
                                        value={duration}
                                        onChange={(e) => setDuration(parseInt(e.target.value))}
                                        className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${!!selectedPackage ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-200 accent-primary'}`}
                                    />
                                    <span className="font-bold text-primary w-12 text-center">{duration} hr{duration > 1 ? 's' : ''}</span>
                                </div>
                                {selectedPackage && <p className="text-xs text-green-600 mt-1">Duration fixed by selected package: <strong>{selectedPackage.title}</strong></p>}
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">
                                        {selectedPackage ? (
                                            <span className="flex items-center gap-2">
                                                Package: <strong className="text-primary">{selectedPackage.title}</strong>
                                            </span>
                                        ) : 'Hourly Rate Booking'}
                                    </span>
                                    <span className="text-3xl font-bold text-primary">₹{totalPrice}</span>
                                </div>
                                {!selectedPackage && (
                                    <p className="text-xs text-gray-400 mb-4">₹{hourlyRate}/hr × {duration} hr{duration > 1 ? 's' : ''}</p>
                                )}

                                {/* Hotel Stay Section */}
                                {hotels.length > 0 && (
                                    <div className="border-t border-gray-100 pt-4 mb-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                                🏨 Add Hotel Stay?
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={() => { setWantHotel(!wantHotel); if (wantHotel) { setSelectedHotel(null); setHotelCheckIn(''); setHotelCheckOut(''); } }}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${wantHotel ? 'bg-primary' : 'bg-gray-300'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${wantHotel ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </div>

                                        {wantHotel && (
                                            <div className="space-y-3 animate-fade-in-up">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {hotels.map(hotel => (
                                                        <div
                                                            key={hotel._id}
                                                            onClick={() => setSelectedHotel(selectedHotel?._id === hotel._id ? null : hotel)}
                                                            className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedHotel?._id === hotel._id
                                                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                                                : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                                                            }`}
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <h4 className="font-bold text-gray-800">🏨 {hotel.hotelName}</h4>
                                                                        {selectedHotel?._id === hotel._id && (
                                                                            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">Selected ✓</span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-gray-500 text-xs mt-1">📍 {hotel.location || 'Location TBD'}</p>
                                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{hotel.roomType}</span>
                                                                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">👥 Max {hotel.maxGuests}</span>
                                                                    </div>
                                                                    {hotel.amenities?.length > 0 && (
                                                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                                                            {hotel.amenities.slice(0, 4).map((a, i) => (
                                                                                <span key={i} className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[10px]">{a}</span>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="text-right ml-3">
                                                                    <p className="text-lg font-black text-blue-600">₹{hotel.pricePerNight}</p>
                                                                    <p className="text-[10px] text-gray-400">per night</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {selectedHotel && (
                                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                                                        <p className="font-bold text-blue-800 text-sm">🗓️ Select Stay Dates</p>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-600 mb-1">Check-in</label>
                                                                <input
                                                                    type="date"
                                                                    value={hotelCheckIn}
                                                                    min={date || new Date().toISOString().split('T')[0]}
                                                                    onChange={(e) => setHotelCheckIn(e.target.value)}
                                                                    className="w-full px-3 py-2 border rounded-lg text-sm focus:border-blue-500 outline-none"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-600 mb-1">Check-out</label>
                                                                <input
                                                                    type="date"
                                                                    value={hotelCheckOut}
                                                                    min={hotelCheckIn || date || new Date().toISOString().split('T')[0]}
                                                                    onChange={(e) => setHotelCheckOut(e.target.value)}
                                                                    className="w-full px-3 py-2 border rounded-lg text-sm focus:border-blue-500 outline-none"
                                                                />
                                                            </div>
                                                        </div>
                                                        {hotelNights > 0 && (
                                                            <div className="flex justify-between items-center bg-white rounded-lg p-3">
                                                                <span className="text-sm text-gray-700">
                                                                    🏨 {selectedHotel.hotelName} • {hotelNights} night{hotelNights > 1 ? 's' : ''}
                                                                </span>
                                                                <span className="font-bold text-blue-600">₹{hotelCost}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Price Summary */}
                                {wantHotel && selectedHotel && hotelNights > 0 && (
                                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-4 space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">🧭 Tour ({selectedPackage ? selectedPackage.title : `${duration}h`})</span>
                                            <span className="font-semibold">₹{tourPrice}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">🏨 {selectedHotel.hotelName} ({hotelNights} night{hotelNights > 1 ? 's' : ''})</span>
                                            <span className="font-semibold">₹{hotelCost}</span>
                                        </div>
                                        <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2 mt-2">
                                            <span>Total</span>
                                            <span className="text-primary">₹{totalPrice}</span>
                                        </div>
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-primary hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Confirming...' : `Confirm Booking${selectedPackage ? ` — ${selectedPackage.title}` : ''}`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
