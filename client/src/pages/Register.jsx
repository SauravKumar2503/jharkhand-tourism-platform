import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'tourist'
    });

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const { name, email, password, role } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            await register(formData);
            setShowSuccessMessage(true);
            setTimeout(() => {
                navigate('/');
            }, 2500); // Redirect after 2.5 seconds
        } catch (err) {
            console.error(err);
            alert('Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            {showSuccessMessage && (
                <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 animate-fade-in-up">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl transform scale-105 transition-all">
                        <div className="text-6xl mb-4">🎉✨</div>
                        <h2 className="text-2xl font-bold text-primary mb-2">Registration Successful!</h2>
                        <p className="text-gray-600 text-lg">
                            Welcome to JharkhandConnect. Let's start your journey!
                        </p>
                    </div>
                </div>
            )}
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-primary">Register</h2>
                <form onSubmit={onSubmit} autoComplete="off">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={onChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
                            required
                            autoComplete="off"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
                            required
                            autoComplete="off"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
                        <select
                            name="role"
                            value={role}
                            onChange={onChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
                        >
                            <option value="tourist">Tourist</option>
                            <option value="guide">Guide</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
