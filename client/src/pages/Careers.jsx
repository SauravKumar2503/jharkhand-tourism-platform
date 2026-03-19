import { useState } from 'react';
import axios from 'axios';
import API_BASE from '../config';

const Careers = () => {
    const [selectedJob, setSelectedJob] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const openModal = (jobTitle) => {
        setSelectedJob(jobTitle);
        setSubmitted(false);
        setFormData({ name: '', email: '', phone: '' });
        setResume(null);
    };

    const closeModal = () => {
        setSelectedJob(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        data.append('jobTitle', selectedJob);
        data.append('resume', resume);

        try {
            await axios.post(`${API_BASE}/api/career/apply`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSubmitted(true);
            setLoading(false);
        } catch (err) {
            console.error(err);
            alert('Failed to submit application. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6 relative">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in-up">
                <div className="bg-gradient-to-r from-blue-600 to-primary text-white p-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">Join Our Team</h1>
                    <p className="text-xl opacity-90">Build the future of tourism in Jharkhand.</p>
                </div>

                <div className="p-8 md:p-12">
                    <div className="mb-12 text-center max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Work With Us?</h2>
                        <p className="text-gray-600">
                            We are a passionate team of developers, designers, and travel enthusiasts working to digitally transform
                            tourism. We value innovation, culture, and community impact.
                        </p>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Open Positions</h3>

                    <div className="space-y-6">
                        {[
                            { title: 'Frontend Developer', type: 'Full-time', loc: 'Ranchi / Remote' },
                            { title: 'Content Strategist', type: 'Part-time', loc: 'Remote' },
                            { title: 'Community Manager', type: 'Full-time', loc: 'Jamshedpur' }
                        ].map((job, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-xl p-6 flex justify-between items-center hover:shadow-md transition bg-white">
                                <div>
                                    <h4 className="font-bold text-lg text-gray-900">{job.title}</h4>
                                    <p className="text-sm text-gray-500">{job.type} • {job.loc}</p>
                                </div>
                                <button
                                    onClick={() => openModal(job.title)}
                                    className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition"
                                >
                                    Apply Now
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 bg-gray-50 p-6 rounded-xl text-center">
                        <p className="text-gray-600 mb-4">Don't see a fit? Send your resume anyway.</p>
                        <a href="mailto:careers@jharkhandconnect.com" className="text-primary font-bold hover:underline">careers@jharkhandconnect.com</a>
                    </div>
                </div>
            </div>

            {/* Application Modal */}
            {selectedJob && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-8 relative shadow-2xl">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            &times;
                        </button>

                        <h2 className="text-2xl font-bold mb-1">Apply for {selectedJob}</h2>
                        <p className="text-gray-500 mb-6 text-sm">Please fill out the details below.</p>

                        {submitted ? (
                            <div className="text-center py-8">
                                <div className="text-6xl mb-4">🎉</div>
                                <h3 className="text-xl font-bold text-primary mb-2">Application Received!</h3>
                                <p className="text-gray-600">We will review your resume and get back to you soon.</p>
                                <button onClick={closeModal} className="mt-6 px-6 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Close</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border p-2 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border p-2 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full border p-2 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Resume (PDF/Doc)</label>
                                    <input type="file" onChange={handleFileChange} required accept=".pdf,.doc,.docx" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                </div>
                                <div className="pt-4">
                                    <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-green-700 transition">
                                        {loading ? 'Submitting...' : 'Submit Application'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Careers;
