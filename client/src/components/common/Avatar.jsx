import { useState } from 'react';
import API_BASE from '../../config';

const Avatar = ({ src, name, className = "w-full h-full", textClassName = "text-2xl" }) => {
    const [imgError, setImgError] = useState(false);

    // Common styling for consistency
    const fallbackStyles = `bg-gray-100 flex items-center justify-center font-bold text-gray-400 uppercase ${textClassName} ${className}`;

    if (!src || imgError) {
        return (
            <div className={fallbackStyles}>
                {name ? name.charAt(0) : 'U'}
            </div>
        );
    }

    // Handle both full URLs, blob previews, and relative paths from the backend
    const fullSrc = (src.startsWith('http') || src.startsWith('blob:')) ? src : `${API_BASE}${src}`;

    return (
        <img
            src={fullSrc}
            alt={name || 'Profile'}
            className={`${className} object-cover`}
            onError={() => setImgError(true)}
        />
    );
};

export default Avatar;
