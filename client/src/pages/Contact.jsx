import { useState } from 'react';
import axios from 'axios';

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5001/api/contact', formData);
            setSubmitted(true);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
            alert('Failed to send message. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in-up">
                <div className="bg-dark text-white p-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">Get in Touch</h1>
                    <p className="text-xl text-gray-400">We'd love to hear from you. Questions, feedback, or stories?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="p-8 md:p-12 bg-gray-50">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="bg-white p-3 rounded-lg shadow-sm text-primary">📍</div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Headquarters</h3>
                                    <p className="text-gray-600">Ranchi, Jharkhand, India</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="bg-white p-3 rounded-lg shadow-sm text-primary">📧</div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Email</h3>
                                    <p className="text-gray-600">support@jharkhandconnect.com</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="bg-white p-3 rounded-lg shadow-sm text-primary">📞</div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Phone</h3>
                                    <p className="text-gray-600">+91 98765 43210</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:p-12">
                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <div className="text-6xl mb-4">✅</div>
                                <h2 className="text-2xl font-bold text-primary mb-2">Message Sent!</h2>
                                <p className="text-gray-600">Thank you for reaching out. We'll get back to you shortly.</p>
                                <button onClick={() => {
                                    setSubmitted(false);
                                    setFormData({ name: '', email: '', message: '' });
                                }} className="mt-4 text-primary font-bold hover:underline">Send another message</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={onChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={onChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea name="message" value={formData.message} onChange={onChange} required rows="4" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"></textarea>
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-green-700 transition transform hover:scale-[1.02]">
                                    {loading ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
