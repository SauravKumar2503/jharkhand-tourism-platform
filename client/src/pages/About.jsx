const About = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in-up">
                <div className="bg-primary text-white p-12 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">About Us</h1>
                        <p className="text-xl opacity-90">Bridging the gap between culture and technology.</p>
                    </div>
                </div>

                <div className="p-8 md:p-12 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            JharkhandConnect is dedicated to unveiling the hidden treasures of "The Land of Forests".
                            We believe that travel isn't just about sightseeing; it's about connection. By leveraging cutting-edge
                            AI and VR technology, we aim to make the rich heritage, vibrant culture, and breathtaking landscapes
                            of Jharkhand accessible to the world, while empowering local communities and guides.
                        </p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                            <h3 className="text-xl font-bold text-primary mb-2">For Tourists</h3>
                            <p className="text-gray-600">
                                Experience personalized itineraries, immersive virtual tours, and seamless booking with expert local guides who breathe life into every stone and tree.
                            </p>
                        </div>
                        <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                            <h3 className="text-xl font-bold text-orange-600 mb-2">For Guides</h3>
                            <p className="text-gray-600">
                                A platform to showcase your expertise, manage bookings efficiently, and connect with travelers who appreciate your unique perspective.
                            </p>
                        </div>
                    </div>

                    <section className="border-t pt-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Story</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Born from a passion for Jharkhand's untold stories, this platform was built to solve a simple problem:
                            how to find authentic experiences in a state typically off the tourist radar.
                            What started as a directory of guides has evolved into a comprehensive ecosystem
                            blending the warmth of human connection with the convenience of modern tech.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default About;
