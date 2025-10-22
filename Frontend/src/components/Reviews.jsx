import { useState, useEffect } from 'react'; // FIX: Imported useEffect
import { useSelector } from 'react-redux';
import { Star, Trash2, Send, Loader } from 'lucide-react';
import { apiService } from '../api/apiService';

// --- Form for Submitting a New Review ---
// FIX: Correctly destructure props using {}
export const ReviewForm = ({ movieId, existingReview, onReviewSubmitted }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // This effect populates the form if an existing review is passed in
    useEffect(() => {
        if (existingReview) {
            setRating(existingReview.rating);
            setComment(existingReview.comment);
        } else {
            // Reset form if there's no existing review (e.g., navigating from a movie with a review to one without)
            setRating(0);
            setComment('');
        }
    }, [existingReview]); // Dependency array ensures this runs when existingReview changes

    if (!isAuthenticated) {
        return (
            <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl mt-8 text-center">
                <p className="text-slate-600 dark:text-slate-400">Please <a href="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">log in</a> to write a review.</p>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0 || comment.trim() === '') {
            setError('Please provide a rating and a comment.');
            return;
        }
        setIsSubmitting(true);
        setError('');
        try {
            if (existingReview) {
                // --- EDIT MODE ---
                await apiService.updateReview(existingReview._id, { rating, comment });
            } else {
                // --- CREATE MODE ---
                await apiService.createReview({ movieId, rating, comment });
            }
            // Clear form only if creating a new review, and refetch reviews in both cases
            if (!existingReview) {
                setComment('');
                setRating(0);
            }
            onReviewSubmitted(); // Notify parent component to refetch reviews
        } catch (err) {
            setError(err.data?.message || 'Failed to submit review.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl mt-8">
            {/* The title now changes dynamically */}
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                {existingReview ? 'Edit Your Review' : 'Write a Review'}
            </h3>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className="w-8 h-8 cursor-pointer transition-colors"
                        color={hoverRating >= star || rating >= star ? '#facc15' : '#94a3b8'}
                        fill={hoverRating >= star || rating >= star ? '#facc15' : 'none'}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                    />
                ))}
            </div>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on the movie..."
                className="w-full p-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                rows="4"
            />
            <button type="submit" disabled={isSubmitting} className="w-full mt-4 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50">
                {isSubmitting ? <Loader className="w-5 h-5 mx-auto animate-spin" /> : (existingReview ? 'Update Review' : 'Submit Review')}
            </button>
        </form>
    );
};


// --- Component for Displaying the List of Reviews ---
export const ReviewList = ({ reviews, onReviewDeleted }) => {
    const { user } = useSelector((state) => state.auth);

    const handleDelete = async (reviewId) => {
        if(window.confirm('Are you sure you want to delete this review?')) {
            try {
                await apiService.deleteReview(reviewId);
                onReviewDeleted(); // Notify parent to refetch
            } catch (error) {
                console.error("Failed to delete review:", error);
                alert("Could not delete review.");
            }
        }
    };

    if (!reviews || reviews.length === 0) {
        // Updated empty state message
        return <p className="text-slate-600 dark:text-slate-400 mt-8">No other reviews yet.</p>;
    }

    return (
        <div className="space-y-6 mt-8">
            {reviews.map((review) => (
                <div key={review._id} className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg relative group">
                    <div className="flex items-center mb-2">
                        <div className="font-bold text-slate-800 dark:text-white">{review.username}</div>
                        <div className="flex items-center ml-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4" color={i < review.rating ? '#facc15' : '#94a3b8'} fill={i < review.rating ? '#facc15' : 'none'} />
                            ))}
                        </div>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">{review.comment}</p>
                    {/* Show delete button only if the logged-in user wrote the review */}
                    {user?._id === review.user && (
                         <button
                            onClick={() => handleDelete(review._id)}
                            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete review"
                         >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};