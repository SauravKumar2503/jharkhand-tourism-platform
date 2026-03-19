import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useContext, useEffect, useState } from 'react';
import AuthContext from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import TouristDashboard from './pages/TouristDashboard';
import GuideDashboard from './pages/GuideDashboard';
import GuideList from './pages/GuideList';
import Itinerary from './pages/Itinerary';
import Chatbot from './components/Chatbot';
import VRExperience from './pages/VRExperience';
import VRDestinationDetail from './pages/VRDestinationDetail';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Marketplace from './pages/Marketplace';
import TransportInfo from './pages/TransportInfo';

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (!user) return <Navigate to="/login" />;
  const role = user.user?.role || user.role;
  if (role === 'admin') return <AdminDashboard />;
  if (role === 'guide') return <GuideDashboard />;
  return <TouristDashboard />;
}

// Protected Admin Route
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  const role = user?.user?.role || user?.role;
  if (user && role === 'admin') {
    return children;
  }
  return <Navigate to="/" />;
};

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const isHome = pathname === '/';

  const userName = user?.user?.name || user?.name;

  const [showLogoutMessage, setShowLogoutMessage] = useState(false);

  const handleLogout = () => {
    setShowLogoutMessage(true);
    setTimeout(() => {
      logout();
      setShowLogoutMessage(false);
      navigate('/');
    }, 2500); // Wait 2.5 seconds before logging out
  };

  return (
    <>
      {showLogoutMessage && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 animate-fade-in-up">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl transform scale-105 transition-all">
            <div className="text-6xl mb-4">🌲✨</div>
            <h2 className="text-2xl font-bold text-primary mb-2">See You Soon!</h2>
            <p className="text-gray-600 text-lg">
              We'll miss you! Come back soon to explore more of Jharkhand.
            </p>
          </div>
        </div>
      )}

      <nav className={`absolute top-0 w-full z-50 transition-all duration-300 ${isHome && !showLogoutMessage ? 'bg-transparent text-white pt-4' : 'glass-nav text-dark py-4'}`}>
        <div className="container mx-auto flex justify-between items-center px-6">
          <Link to="/" className="text-2xl font-bold font-display tracking-wide">
            Jharkhand<span className="text-secondary">Connect</span>
          </Link>
          <div className="space-x-8 font-medium flex items-center">
            {/* Show these links only for tourists (not guides or admins) */}
            {(!user || (user.user?.role !== 'guide' && user.role !== 'guide' && user.user?.role !== 'admin' && user.role !== 'admin')) && (
              <>
                <Link to="/guides" className="hover:text-secondary transition">Guides</Link>
                <Link to="/vr" className="hover:text-secondary transition">VR Tours</Link>
                <Link to="/itinerary" className="hover:text-secondary transition">Plan Trip</Link>
                <Link to="/marketplace" className="hover:text-secondary transition">Marketplace</Link>
                <Link to="/transport" className="hover:text-secondary transition">Transport</Link>
              </>
            )}

            {/* Admin-specific nav links */}
            {user && (user.user?.role === 'admin' || user.role === 'admin') && (
              <>
                <Link to="/dashboard" className="hover:text-secondary transition font-bold">🛡️ Admin Panel</Link>
              </>
            )}
            {/* Dashboard link for non-admin users */}
            {(!user || (user.user?.role !== 'admin' && user.role !== 'admin')) && (
              <Link to="/dashboard" className="hover:text-secondary transition">Dashboard</Link>
            )}
            {user ? (
              <>
                <Link to="/profile" className="flex items-center space-x-2 text-primary font-bold hover:underline">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300">
                    {(user.user?.profilePicture || user.profilePicture) ? (
                      <img
                        src={`${API_BASE}${user.user?.profilePicture || user.profilePicture}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/20 flex items-center justify-center text-xs text-primary font-bold">
                        {userName ? userName.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                  </div>
                  <span>Hello, {userName}</span>
                </Link>
                <button onClick={handleLogout} className="px-4 py-2 border border-secondary text-secondary rounded-full hover:bg-secondary hover:text-white transition">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 border border-secondary text-secondary rounded-full hover:bg-secondary hover:text-white transition">Login</Link>
                <Link to="/register" className="px-4 py-2 bg-primary text-white rounded-full hover:bg-green-700 transition shadow-md">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

const Home = () => {
  const { user } = useContext(AuthContext);
  const isGuide = user && (user.role === 'guide' || user.user?.role === 'guide');
  const isAdmin = user && (user.role === 'admin' || user.user?.role === 'admin');

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img
          src="/images/hero-jharkhand.png"
          alt="Jharkhand Landscape - Hundru Falls"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-20 text-center text-white max-w-4xl px-4 animate-fade-in-up">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 drop-shadow-lg">
            {isAdmin ? (
              <>
                Admin <span className="text-accent">Panel</span>
              </>
            ) : isGuide ? (
              <>
                Welcome <span className="text-accent">Guide</span>
              </>
            ) : (
              <>
                Discover <span className="text-accent">Jharkhand</span>
              </>
            )}
          </h1>
          <p className="text-xl md:text-2xl mb-10 font-light tracking-wider drop-shadow-md">
            {isAdmin
              ? "Manage heritage sites, users, bookings & platform settings."
              : isGuide
                ? "Share the beauty of Jharkhand with the world."
                : "Experience the Land of Forests through AI & VR"}
          </p>
          <div className="flex justify-center gap-4">
            {isAdmin ? (
              <>
                <Link to="/admin" className="bg-primary hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-lg transition transform hover:scale-105 shadow-lg">
                  ⚙️ Manage Platform
                </Link>
                <Link to="/admin" className="bg-white/10 backdrop-blur-md border border-white/50 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition transform hover:scale-105 shadow-lg">
                  📊 View Analytics
                </Link>
              </>
            ) : isGuide ? (
              <>
                <Link to="/dashboard" className="bg-primary hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-lg transition transform hover:scale-105 shadow-lg">
                  Go to Dashboard
                </Link>
                <Link to="/profile" className="bg-white/10 backdrop-blur-md border border-white/50 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition transform hover:scale-105 shadow-lg">
                  Edit Profile
                </Link>
              </>
            ) : (
              <>
                <Link to="/guides" className="bg-primary hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-lg transition transform hover:scale-105 shadow-lg">
                  Find a Guide
                </Link>
                <Link to="/vr" className="bg-white/10 backdrop-blur-md border border-white/50 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition transform hover:scale-105 shadow-lg">
                  Virtual Tour
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section - Only for Tourists */}
      {!isGuide && !isAdmin && (
        <div className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16 text-primary">Immersive Experiences</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <Link to="/guides" className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition cursor-pointer">
                <img src="/images/cultural-guide.png" alt="Jharkhand Cultural Guide" className="w-full h-80 object-cover group-hover:scale-110 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end p-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Cultural Guides</h3>
                    <p className="text-gray-200 text-sm">Connect with locals who know the stories of the land.</p>
                  </div>
                </div>
              </Link>
              <Link to="/vr" className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition cursor-pointer">
                <img src="/images/heritage-temple.png" alt="Baidyanath Temple Heritage" className="w-full h-80 object-cover group-hover:scale-110 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end p-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">VR Heritage</h3>
                    <p className="text-gray-200 text-sm">Step into history without leaving your home.</p>
                  </div>
                </div>
              </Link>
              <Link to="/itinerary" className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition cursor-pointer">
                <img src="/images/nature-travel.png" alt="Netarhat Sunrise Point" className="w-full h-80 object-cover group-hover:scale-110 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end p-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">AI Planner</h3>
                    <p className="text-gray-200 text-sm">Personalized itineraries crafted just for you.</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import Footer from './components/Footer';

import Profile from './pages/Profile';
import BookingPage from './pages/BookingPage';
import API_BASE from './config';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<div className="pt-24"><Login /></div>} />
              <Route path="/register" element={<div className="pt-24"><Register /></div>} />
              <Route path="/guides" element={<div className="pt-24"><GuideList /></div>} />
              <Route path="/dashboard" element={<div className="pt-24"><Dashboard /></div>} />
              <Route path="/itinerary" element={<div className="pt-24"><Itinerary /></div>} />
              <Route path="/vr" element={<div className="pt-24"><VRExperience /></div>} />
              <Route path="/vr/:id" element={<div className="pt-24"><VRDestinationDetail /></div>} />
              <Route path="/profile" element={<div className="pt-24"><Profile /></div>} />
              <Route path="/admin" element={<div className="pt-24"><AdminRoute><AdminDashboard /></AdminRoute></div>} />
              <Route path="/book/:guideId" element={<div className="pt-24"><BookingPage /></div>} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/marketplace" element={<div className="pt-24"><Marketplace /></div>} />
              <Route path="/transport" element={<div className="pt-24"><TransportInfo /></div>} />
            </Routes>
          </div>
          <Chatbot />
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
