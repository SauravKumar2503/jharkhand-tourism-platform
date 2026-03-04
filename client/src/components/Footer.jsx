import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Footer = () => {
    const { user } = useContext(AuthContext);
    const isGuide = user && (user.role === 'guide' || user.user?.role === 'guide');

    return (
        <footer className="bg-dark text-white pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-2xl font-bold font-display tracking-wide mb-6 block">
                            Jharkhand<span className="text-secondary">Connect</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {isGuide
                                ? "Empowering local experts to share the hidden gems of Jharkhand with the world."
                                : "Discover the soul of India. From ancient forests to modern cities, experience Jharkhand like never before with AI & VR."
                            }
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-6 text-primary">{isGuide ? "Guide Tools" : "Explore"}</h3>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            {isGuide ? (
                                <>
                                    <li><Link to="/dashboard" className="hover:text-white transition">My Dashboard</Link></li>
                                    <li><Link to="/profile" className="hover:text-white transition">Edit Profile</Link></li>
                                    <li><Link to="/dashboard" className="hover:text-white transition">Manage Packages</Link></li>
                                    <li><Link to="/contact" className="hover:text-white transition">Guide Support</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/guides" className="hover:text-white transition">Cultural Guides</Link></li>
                                    <li><Link to="/vr" className="hover:text-white transition">VR Tours</Link></li>
                                    <li><Link to="/itinerary" className="hover:text-white transition">AI Planner</Link></li>
                                    {user && <li><Link to="/dashboard" className="hover:text-white transition">My Dashboard</Link></li>}
                                </>
                            )}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-6 text-primary">Company</h3>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
                            <li><Link to="/careers" className="hover:text-white transition">Careers</Link></li>
                            <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-6 text-primary">Connect</h3>
                        <p className="text-gray-400 text-sm mb-4">Join our newsletter for travel tips.</p>
                        <div className="flex">
                            <input type="email" placeholder="Email Address" className="bg-white/10 border-none outline-none text-white px-4 py-2 rounded-l-lg w-full focus:bg-white/20 transition" />
                            <button className="bg-primary hover:bg-green-700 text-white px-4 py-2 rounded-r-lg transition">Go</button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-xs text-center md:text-left">
                        &copy; {new Date().getFullYear()} Jharkhand Connect. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        {/* Social Icons Placeholder */}
                        <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-facebook-f"></i></a>
                        <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-twitter"></i></a>
                        <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-instagram"></i></a>
                        <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
