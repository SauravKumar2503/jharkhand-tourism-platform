const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in-up">
                <div className="bg-gray-800 text-white p-12">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 font-display">Privacy Policy</h1>
                    <p className="text-gray-400 text-sm">Last Updated: February 2026</p>
                </div>

                <div className="p-8 md:p-12 space-y-6 text-gray-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
                        <p>
                            We collect information you provide directly to us, such as when you create an account, update your profile,
                            book a tour, or communicate with us. This may include your name, email address, phone number, and payment information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
                        <p>
                            We use the information we collect to operate, maintain, and improve our services,
                            process transactions, send you technical notices and support messages, and communicate with you about
                            new features or guides.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">3. Data Security</h2>
                        <p>
                            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access,
                            disclosure, alteration and destruction.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">4. Cookies</h2>
                        <p>
                            We involve the use of cookies to enhance your experience. You can instruct your browser to refuse all cookies
                            or to indicate when a cookie is being sent.
                        </p>
                    </section>

                    <section className="border-t pt-6">
                        <p className="text-sm">
                            If you have questions about this policy, please contact us at <span className="text-primary font-bold">privacy@jharkhandconnect.com</span>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
