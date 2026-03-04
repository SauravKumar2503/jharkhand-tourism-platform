import React, { useState } from 'react';

const VRViewer = ({ panoId, lat, lng, title, location }) => {
    const [viewMode, setViewMode] = useState('place');

    // Google Maps Place embed — ALWAYS works, shows correct destination with photos
    const query = encodeURIComponent(`${title}, ${location || 'Jharkhand India'}`);
    const placeSrc = `https://www.google.com/maps?q=${query}&z=18&output=embed`;

    // Satellite view
    const satelliteSrc = `https://maps.google.com/maps?q=${query}&t=k&z=17&ie=UTF8&iwloc=B&output=embed`;

    // Street View panorama (if panoId + coords available)
    const panoSrc = panoId && lat && lng
        ? `https://www.google.com/maps/embed?pb=!4v${Date.now()}!6m8!1m7!1s${panoId}!2m2!1d${lat}!2d${lng}!3f0!4f0!5f0.7820865974627469`
        : null;

    const getSrc = () => {
        if (viewMode === 'satellite') return satelliteSrc;
        if (viewMode === 'pano' && panoSrc) return panoSrc;
        return placeSrc;
    };

    return (
        <div className="w-full h-full relative bg-black">
            <iframe
                key={viewMode}
                src={getSrc()}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="eager"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${title} - Interactive View`}
                className="absolute inset-0 w-full h-full"
            ></iframe>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white pointer-events-none z-10">
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="text-sm text-gray-300">
                    {viewMode === 'place'
                        ? 'Explore on Google Maps • Click the yellow person icon for Street View 360°'
                        : viewMode === 'pano'
                            ? 'Drag to look around in 360° • Scroll to zoom'
                            : 'Satellite view • Drag to navigate'}
                </p>
            </div>

            <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button
                    onClick={() => setViewMode('place')}
                    className={`px-4 py-2 rounded-full font-bold text-sm backdrop-blur-md transition ${viewMode === 'place' ? 'bg-primary text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'}`}
                >
                    📍 Map View
                </button>
                {panoSrc && (
                    <button
                        onClick={() => setViewMode('pano')}
                        className={`px-4 py-2 rounded-full font-bold text-sm backdrop-blur-md transition ${viewMode === 'pano' ? 'bg-primary text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'}`}
                    >
                        🥽 Street View
                    </button>
                )}
                <button
                    onClick={() => setViewMode('satellite')}
                    className={`px-4 py-2 rounded-full font-bold text-sm backdrop-blur-md transition ${viewMode === 'satellite' ? 'bg-primary text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'}`}
                >
                    🛰️ Satellite
                </button>
            </div>

            <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold z-10">
                🥽 VR Experience — {title}
            </div>
        </div>
    );
};

export default VRViewer;
