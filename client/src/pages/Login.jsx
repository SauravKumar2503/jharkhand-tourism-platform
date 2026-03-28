import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            await login(formData);
            setShowSuccessMessage(true);
            setTimeout(() => {
                navigate('/');
            }, 2500); // Redirect after 2.5 seconds
        } catch (err) {
            console.error(err);
            alert('Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            {showSuccessMessage && (
                <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 animate-fade-in-up">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl transform scale-105 transition-all">
                        <div className="text-6xl mb-4">🚀✨</div>
                        <h2 className="text-2xl font-bold text-primary mb-2">Welcome Back!</h2>
                        <p className="text-gray-600 text-lg">
                            Get ready to explore the hidden gems of Jharkhand.
                        </p>
                    </div>
                </div>
            )}
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-primary">Login</h2>
                <form onSubmit={onSubmit} autoComplete="off">
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
                    <div className="mb-6">
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
                    <button
                        type="submit"
                        className="w-full bg-primary text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
