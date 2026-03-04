import { useEffect, useState } from 'react';
import axios from 'axios';

const GuideReviews = ({ token }) => {
    const [reviews, setReviews] = useState([]);
    const [replyText, setReplyText] = useState('');
    const [activeReplyId, setActiveReplyId] = useState(null);

    const config = { headers: { 'x-auth-token': token } };

    useEffect(() => {
        fetchReviews();
    }, [token]);

    const fetchReviews = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/guides/reviews', config);
            setReviews(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const submitReply = async (reviewId) => {
        try {
            await axios.put(`http://localhost:5001/api/guides/reviews/${reviewId}/reply`, { reply: replyText }, config);
            setActiveReplyId(null);
            setReplyText('');
            fetchReviews();
        } catch (err) {
            alert('Failed to send reply');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Guest Reviews</h2>
            {reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet.</p>
            ) : (
                <div className="space-y-6">
                    {reviews.map(review => (
                        <div key={review._id} className="border-b pb-6 last:border-0 last:pb-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold">{review.tourist?.name || 'Guest'}</h4>
                                    <div className="flex text-yellow-400 text-sm mt-1">
                                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                    </div>
                                    <p className="text-gray-700 mt-2">{review.comment}</p>
                                    <p className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {review.reply ? (
                                <div className="mt-4 bg-blue-50 p-4 rounded-lg ml-8 border-l-4 border-blue-200">
                                    <p className="text-xs font-bold text-blue-800 uppercase mb-1">Your Reply</p>
                                    <p className="text-gray-700 text-sm">{review.reply}</p>
                                </div>
                            ) : (
                                <div className="mt-3 ml-8">
                                    {activeReplyId === review._id ? (
                                        <div className="flex gap-2">
                                            <input
                                                className="border p-2 rounded flex-1 text-sm"
                                                placeholder="Write a reply..."
                                                value={replyText}
                                                onChange={e => setReplyText(e.target.value)}
                                            />
                                            <button onClick={() => submitReply(review._id)} className="bg-primary text-white px-3 py-1 rounded text-sm">Send</button>
                                            <button onClick={() => setActiveReplyId(null)} className="text-gray-500 text-sm hover:underline">Cancel</button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setActiveReplyId(review._id)}
                                            className="text-blue-500 text-sm hover:underline"
                                        >
                                            Reply
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GuideReviews;
