import React from 'react';
import { Link } from 'react-router-dom';
import { vrToursData } from '../data/vrTours';

const VRExperience = () => {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero */}
            <div className="relative h-[350px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-violet-900 via-purple-800 to-fuchsia-700">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
                <div className="relative z-10 text-center px-4 animate-fade-in-up">
                    <div className="text-6xl mb-4">🥽</div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-2xl">
                        Virtual <span className="text-fuchsia-300">Heritage</span> Tours
                    </h1>
                    <p className="text-xl text-purple-100 max-w-2xl mx-auto font-medium">
                        Explore Jharkhand's majestic waterfalls, ancient temples, and historic sites through our high-definition 360° virtual reality experiences.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-16 relative z-20">
                <div className="bg-white/90 backdrop-blur-xl p-4 md:p-6 rounded-[2rem] shadow-2xl border border-white/20 mb-10 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 px-4">Available Experiences ({vrToursData.length})</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {vrToursData.map((tour, index) => (
                        <Link
                            to={`/vr/${tour.id}`}
                            key={tour.id}
                            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 block"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={tour.thumbnail}
                                    alt={tour.title}
                                    className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white text-2xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition duration-300">
                                        👓
                                    </div>
                                </div>
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                                    360° TOUR
                                </div>
                            </div>
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-primary transition">{tour.title}</h2>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{tour.description}</p>
                                <div className="flex items-center text-primary font-bold text-sm">
                                    Start Experience &rarr;
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VRExperience;




