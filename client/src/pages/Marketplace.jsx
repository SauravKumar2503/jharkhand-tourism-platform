import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE from '../config';

const categories = [
    { id: 'all', label: 'All', icon: '🏪', color: 'from-gray-600 to-gray-800' },
    { id: 'handicraft', label: 'Handicrafts', icon: '🎨', color: 'from-amber-500 to-orange-600' },
    { id: 'homestay', label: 'Homestays', icon: '🏡', color: 'from-green-500 to-emerald-600' },
    { id: 'event', label: 'Events', icon: '🎭', color: 'from-purple-500 to-indigo-600' },
    { id: 'ecotourism', label: 'Ecotourism', icon: '🌿', color: 'from-teal-500 to-cyan-600' }
];

const Marketplace = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);

    // Order form state
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [orderStep, setOrderStep] = useState(1); // 1=details, 2=payment, 3=success
    const [orderForm, setOrderForm] = useState({ buyerName: '', email: '', phone: '', address: '', quantity: 1 });
    const [paymentMethod, setPaymentMethod] = useState('');
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
    const [upiId, setUpiId] = useState('');
    const [orderResult, setOrderResult] = useState(null);
    const [orderLoading, setOrderLoading] = useState(false);

    const handleBuyNow = () => {
        setShowOrderForm(true);
        setOrderStep(1);
        setOrderForm({ buyerName: '', email: '', phone: '', address: '', quantity: 1 });
        setPaymentMethod('');
        setCardDetails({ number: '', expiry: '', cvv: '', name: '' });
        setUpiId('');
        setOrderResult(null);
    };

    const handlePlaceOrder = async () => {
        if (!paymentMethod) return alert('Please select a payment method');
        if (paymentMethod === 'card' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv)) return alert('Please fill card details');
        if (paymentMethod === 'upi' && !upiId) return alert('Please enter UPI ID');

        setOrderLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/api/marketplace/order`, {
                ...orderForm,
                itemId: selectedItem._id,
                paymentMethod
            });
            setOrderResult(res.data);
            setOrderStep(3);
        } catch (err) {
            alert(err.response?.data?.message || 'Error placing order');
        }
        setOrderLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, [activeCategory]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            let url = `${API_BASE}/api/marketplace`;
            const params = new URLSearchParams();
            if (activeCategory !== 'all') params.append('category', activeCategory);
            if (searchQuery) params.append('search', searchQuery);
            if (params.toString()) url += `?${params.toString()}`;

            const res = await axios.get(url);
            setItems(res.data);
        } catch (err) {
            console.error('Error fetching marketplace items:', err);
        }
        setLoading(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchItems();
    };

    const getCategoryBadge = (cat) => {
        const found = categories.find(c => c.id === cat);
        return found ? `${found.icon} ${found.label}` : cat;
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero */}
            <div className="relative h-[350px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-900 via-orange-800 to-yellow-700">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
                <div className="relative z-10 text-center px-4 animate-fade-in-up">
                    <div className="text-6xl mb-4">🏪</div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-2xl">
                        Local <span className="text-yellow-300">Marketplace</span>
                    </h1>
                    <p className="text-xl text-amber-100 max-w-2xl mx-auto font-medium">
                        Discover tribal handicrafts, cozy homestays, cultural events, and eco-adventures across Jharkhand.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-16 relative z-20">
                {/* Search + Category Filter Card */}
                <div className="bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-2xl border border-white/20 mb-10">
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex gap-3 mb-6">
                        <div className="flex-1 relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search handicrafts, homestays, events..."
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-lg"
                            />
                        </div>
                        <button type="submit" className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition shadow-lg">
                            Search
                        </button>
                    </form>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-3">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${activeCategory === cat.id
                                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg scale-105`
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <span className="text-lg">{cat.icon}</span>
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <div className="flex justify-between items-center mb-6 px-2">
                    <p className="text-gray-500 font-medium">
                        {loading ? 'Loading...' : `${items.length} items found`}
                    </p>
                </div>

                {/* Items Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500"></div>
                            <p className="text-gray-500 font-medium">Loading marketplace...</p>
                        </div>
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🏜️</div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No items found</h3>
                        <p className="text-gray-500">Try a different category or search term.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {items.map((item, index) => (
                            <div
                                key={item._id}
                                onClick={() => setSelectedItem(item)}
                                className="group bg-white rounded-[1.5rem] shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer hover:-translate-y-2 border border-gray-100 animate-fade-in-up"
                                style={{ animationDelay: `${index * 80}ms` }}
                            >
                                {/* Image */}
                                <div className="h-56 relative overflow-hidden bg-gray-200">
                                    {item.images && item.images[0] ? (
                                        <img
                                            src={item.images[0]}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">📷</div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${categories.find(c => c.id === item.category)?.color || 'from-gray-500 to-gray-700'} shadow-lg`}>
                                            {getCategoryBadge(item.category)}
                                        </span>
                                    </div>
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                                        <span className="text-yellow-500">⭐</span>
                                        <span className="text-sm font-bold text-gray-800">{item.rating}</span>
                                        <span className="text-xs text-gray-400">({item.reviewCount})</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors line-clamp-1">{item.name}</h3>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description}</p>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-2xl font-black text-gray-900">₹{item.price.toLocaleString()}</span>
                                            <span className="text-xs text-gray-400 ml-1">
                                                {item.category === 'homestay' ? '/night' : item.category === 'event' ? '/person' : ''}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-400 text-sm">
                                            <span>📍</span>
                                            <span className="truncate max-w-[120px]">{item.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Item Detail Modal */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedItem(null)}>
                    <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                        {/* Modal Image */}
                        <div className="h-72 relative overflow-hidden rounded-t-[2rem] bg-gray-200">
                            {selectedItem.images && selectedItem.images[0] ? (
                                <img src={selectedItem.images[0]} alt={selectedItem.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">📷</div>
                            )}
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/40 transition"
                            >
                                ✕
                            </button>
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-2 bg-gradient-to-r ${categories.find(c => c.id === selectedItem.category)?.color}`}>
                                    {getCategoryBadge(selectedItem.category)}
                                </span>
                                <h2 className="text-3xl font-extrabold text-white">{selectedItem.name}</h2>
                            </div>
                        </div>

                        <div className="p-8 space-y-6">
                            {/* Price & Rating */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-4xl font-black text-gray-900">₹{selectedItem.price.toLocaleString()}</span>
                                    <span className="text-sm text-gray-400 ml-2">
                                        {selectedItem.category === 'homestay' ? 'per night' : selectedItem.category === 'event' ? 'per person' : ''}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full">
                                    <span className="text-yellow-500 text-xl">⭐</span>
                                    <span className="font-bold text-lg">{selectedItem.rating}</span>
                                    <span className="text-gray-400 text-sm">({selectedItem.reviewCount} reviews)</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="font-bold text-gray-800 mb-2">Description</h3>
                                <p className="text-gray-600 leading-relaxed">{selectedItem.description}</p>
                            </div>

                            {/* Location */}
                            <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-2xl">
                                <span className="text-2xl">📍</span>
                                <div>
                                    <p className="font-bold text-gray-800">{selectedItem.location}</p>
                                    <p className="text-sm text-gray-500">Jharkhand, India</p>
                                </div>
                            </div>

                            {/* Seller & Contact */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded-2xl">
                                    <p className="text-xs uppercase tracking-wider text-blue-600 font-bold mb-1">Seller</p>
                                    <p className="font-bold text-blue-900">{selectedItem.sellerName || 'Local Vendor'}</p>
                                </div>
                                {selectedItem.contact && (
                                    <div className="bg-green-50 p-4 rounded-2xl">
                                        <p className="text-xs uppercase tracking-wider text-green-600 font-bold mb-1">Contact</p>
                                        {selectedItem.contact.phone && <p className="font-bold text-green-900">📞 {selectedItem.contact.phone}</p>}
                                        {selectedItem.contact.email && <p className="text-sm text-green-700">✉️ {selectedItem.contact.email}</p>}
                                    </div>
                                )}
                            </div>

                            {/* Tags */}
                            {selectedItem.tags && selectedItem.tags.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-2">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedItem.tags.map((tag, i) => (
                                            <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CTA */}
                            <div className="pt-4 border-t">
                                <button
                                    onClick={handleBuyNow}
                                    className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all hover:scale-[1.02]"
                                >
                                    {selectedItem.category === 'homestay' ? '🏡 Book Now' :
                                        selectedItem.category === 'event' ? '🎫 Reserve Spot' :
                                            selectedItem.category === 'ecotourism' ? '🌿 Book Experience' : '🛒 Buy Now'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* =================== ORDER FORM MODAL =================== */}
            {showOrderForm && selectedItem && (
                <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowOrderForm(false)}>
                    <div className="bg-white rounded-[2rem] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>

                        {/* Header */}
                        <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6 rounded-t-[2rem] text-white relative">
                            <button onClick={() => setShowOrderForm(false)} className="absolute top-4 right-4 bg-white/20 p-2 rounded-full hover:bg-white/40">✕</button>
                            <h2 className="text-2xl font-extrabold">
                                {orderStep === 1 ? '📋 Your Details' : orderStep === 2 ? '💳 Payment' : '✅ Order Confirmed!'}
                            </h2>
                            <p className="text-white/80 text-sm mt-1">{selectedItem.name} — ₹{selectedItem.price.toLocaleString()}</p>
                            {/* Step indicator */}
                            <div className="flex gap-2 mt-4">
                                {[1, 2, 3].map(s => (
                                    <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= orderStep ? 'bg-white' : 'bg-white/30'}`}></div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6">
                            {/* STEP 1: Buyer Details */}
                            {orderStep === 1 && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Full Name *</label>
                                        <input type="text" value={orderForm.buyerName} onChange={e => setOrderForm({ ...orderForm, buyerName: e.target.value })}
                                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition" placeholder="Enter your full name" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Email *</label>
                                        <input type="email" value={orderForm.email} onChange={e => setOrderForm({ ...orderForm, email: e.target.value })}
                                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition" placeholder="your@email.com" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Mobile Number *</label>
                                        <input type="tel" value={orderForm.phone} onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })}
                                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition" placeholder="+91 98765 43210" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Delivery Address *</label>
                                        <textarea value={orderForm.address} onChange={e => setOrderForm({ ...orderForm, address: e.target.value })}
                                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition" rows={3} placeholder="Full delivery address" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Quantity</label>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setOrderForm({ ...orderForm, quantity: Math.max(1, orderForm.quantity - 1) })}
                                                className="w-10 h-10 bg-gray-100 rounded-xl font-bold text-xl hover:bg-gray-200">−</button>
                                            <span className="text-2xl font-bold w-12 text-center">{orderForm.quantity}</span>
                                            <button onClick={() => setOrderForm({ ...orderForm, quantity: orderForm.quantity + 1 })}
                                                className="w-10 h-10 bg-gray-100 rounded-xl font-bold text-xl hover:bg-gray-200">+</button>
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="bg-orange-50 p-4 rounded-2xl space-y-2">
                                        <div className="flex justify-between text-sm"><span className="text-gray-600">Item Price</span><span>₹{selectedItem.price.toLocaleString()}</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-gray-600">Quantity</span><span>×{orderForm.quantity}</span></div>
                                        <div className="border-t pt-2 flex justify-between font-bold text-lg"><span>Total</span><span className="text-orange-600">₹{(selectedItem.price * orderForm.quantity).toLocaleString()}</span></div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            if (!orderForm.buyerName || !orderForm.email || !orderForm.phone || !orderForm.address) return alert('Please fill all fields');
                                            setOrderStep(2);
                                        }}
                                        className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all"
                                    >
                                        Continue to Payment →
                                    </button>
                                </div>
                            )}

                            {/* STEP 2: Payment Method */}
                            {orderStep === 2 && (
                                <div className="space-y-4">
                                    <h3 className="font-bold text-gray-800 text-lg">Select Payment Method</h3>

                                    {/* UPI */}
                                    <div onClick={() => setPaymentMethod('upi')}
                                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">📱</span>
                                            <div>
                                                <p className="font-bold text-gray-800">UPI Payment</p>
                                                <p className="text-sm text-gray-500">Google Pay, PhonePe, Paytm</p>
                                            </div>
                                            <div className={`ml-auto w-5 h-5 rounded-full border-2 ${paymentMethod === 'upi' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
                                                {paymentMethod === 'upi' && <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5"></div>}
                                            </div>
                                        </div>
                                        {paymentMethod === 'upi' && (
                                            <div className="mt-3 pt-3 border-t">
                                                <input type="text" value={upiId} onChange={e => setUpiId(e.target.value)}
                                                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none" placeholder="yourname@upi" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Card */}
                                    <div onClick={() => setPaymentMethod('card')}
                                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">💳</span>
                                            <div>
                                                <p className="font-bold text-gray-800">Credit / Debit Card</p>
                                                <p className="text-sm text-gray-500">Visa, Mastercard, RuPay</p>
                                            </div>
                                            <div className={`ml-auto w-5 h-5 rounded-full border-2 ${paymentMethod === 'card' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
                                                {paymentMethod === 'card' && <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5"></div>}
                                            </div>
                                        </div>
                                        {paymentMethod === 'card' && (
                                            <div className="mt-3 pt-3 border-t space-y-3">
                                                <input type="text" value={cardDetails.number} onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })}
                                                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none" placeholder="Card Number" maxLength={19} />
                                                <input type="text" value={cardDetails.name} onChange={e => setCardDetails({ ...cardDetails, name: e.target.value })}
                                                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none" placeholder="Cardholder Name" />
                                                <div className="flex gap-3">
                                                    <input type="text" value={cardDetails.expiry} onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                                        className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none" placeholder="MM/YY" maxLength={5} />
                                                    <input type="password" value={cardDetails.cvv} onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                                        className="w-24 p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none" placeholder="CVV" maxLength={4} />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* QR Scan & Pay */}
                                    <div onClick={() => setPaymentMethod('qr')}
                                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'qr' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">📷</span>
                                            <div>
                                                <p className="font-bold text-gray-800">QR Code — Scan & Pay</p>
                                                <p className="text-sm text-gray-500">Scan with any UPI app to pay instantly</p>
                                            </div>
                                            <div className={`ml-auto w-5 h-5 rounded-full border-2 ${paymentMethod === 'qr' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
                                                {paymentMethod === 'qr' && <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5"></div>}
                                            </div>
                                        </div>
                                        {paymentMethod === 'qr' && (
                                            <div className="mt-4 pt-4 border-t flex flex-col items-center">
                                                <div className="bg-white p-3 rounded-2xl shadow-md border-2 border-gray-100">
                                                    <img
                                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=jharkhandtourism@upi&pn=Jharkhand%20Tourism&am=${selectedItem.price * orderForm.quantity}&cu=INR&tn=Order-${selectedItem.name}`)}`}
                                                        alt="UPI QR Code"
                                                        className="w-48 h-48"
                                                    />
                                                </div>
                                                <p className="text-sm font-bold text-gray-700 mt-3">Scan with Google Pay, PhonePe, Paytm</p>
                                                <p className="text-xs text-gray-400 mt-1">Amount: ₹{(selectedItem.price * orderForm.quantity).toLocaleString()}</p>
                                                <div className="mt-3 bg-green-50 px-4 py-2 rounded-full">
                                                    <p className="text-xs text-green-700 font-bold">✅ After scanning, click "Pay & Place Order" below</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* COD */}
                                    <div onClick={() => setPaymentMethod('cod')}
                                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">🏠</span>
                                            <div>
                                                <p className="font-bold text-gray-800">Cash on Delivery</p>
                                                <p className="text-sm text-gray-500">Pay when you receive the item</p>
                                            </div>
                                            <div className={`ml-auto w-5 h-5 rounded-full border-2 ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
                                                {paymentMethod === 'cod' && <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5"></div>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className="bg-orange-50 p-4 rounded-2xl flex justify-between font-bold text-lg">
                                        <span>Total Payable</span>
                                        <span className="text-orange-600">₹{(selectedItem.price * orderForm.quantity).toLocaleString()}</span>
                                    </div>

                                    <div className="flex gap-3">
                                        <button onClick={() => setOrderStep(1)} className="flex-1 py-3 border-2 border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-50">← Back</button>
                                        <button
                                            onClick={handlePlaceOrder}
                                            disabled={orderLoading}
                                            className="flex-[2] bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-2xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50"
                                        >
                                            {orderLoading ? '⏳ Processing...' : paymentMethod === 'cod' ? '✅ Place Order (COD)' : '🔒 Pay & Place Order'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: Success */}
                            {orderStep === 3 && orderResult && (
                                <div className="text-center space-y-4 py-4">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-4xl">✅</div>
                                    <h3 className="text-2xl font-extrabold text-gray-800">Order Placed Successfully!</h3>
                                    <p className="text-gray-500">Thank you, {orderForm.buyerName}!</p>

                                    <div className="bg-gray-50 p-4 rounded-2xl text-left space-y-2">
                                        <div className="flex justify-between text-sm"><span className="text-gray-500">Item</span><span className="font-bold">{selectedItem.name}</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-gray-500">Quantity</span><span className="font-bold">{orderForm.quantity}</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-gray-500">Total</span><span className="font-bold text-orange-600">₹{(selectedItem.price * orderForm.quantity).toLocaleString()}</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-gray-500">Payment</span><span className="font-bold">{paymentMethod === 'upi' ? '📱 UPI' : paymentMethod === 'card' ? '💳 Card' : paymentMethod === 'qr' ? '📷 QR Scan' : '🏠 COD'}</span></div>
                                        {orderResult.order?.transactionId && (
                                            <div className="flex justify-between text-sm"><span className="text-gray-500">Transaction ID</span><span className="font-bold text-green-600">{orderResult.order.transactionId}</span></div>
                                        )}
                                        <div className="flex justify-between text-sm"><span className="text-gray-500">Status</span><span className="font-bold text-green-600">✅ Confirmed</span></div>
                                    </div>

                                    <p className="text-sm text-gray-400">A confirmation will be sent to {orderForm.email}</p>

                                    <button onClick={() => { setShowOrderForm(false); setSelectedItem(null); }}
                                        className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all">
                                        🛍️ Continue Shopping
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Marketplace;
