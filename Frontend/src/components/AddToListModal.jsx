import { useState, useEffect } from 'react';
import { apiService } from '../api/apiService';
import { Loader, X, Plus } from 'lucide-react';

// This modal receives the movie to add and a function to close itself
const AddToListModal = ({ movieToAdd, onClose }) => {
    const [lists, setLists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [feedback, setFeedback] = useState(''); // For success/error messages after adding

    // Fetch the user's lists when the modal opens
    useEffect(() => {
        const fetchUserLists = async () => {
            setIsLoading(true);
            setError('');
            try {
                const response = await apiService.getUserLists();
                setLists(response.data);
            } catch (err) {
                setError('Could not load your lists.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserLists();
    }, []);

    // Function to handle adding the movie to a selected list
    const handleAddToList = async (listId) => {
        if (!movieToAdd) return;
        setFeedback('Adding...'); // Provide immediate feedback
        setError('');
        try {
            // Prepare movie data to send to backend
            const movieData = {
                movieId: movieToAdd.imdbID,
                title: movieToAdd.Title,
                posterPath: movieToAdd.Poster,
                releaseYear: movieToAdd.Year
            };
            await apiService.addMovieToList(listId, movieData);
            setFeedback(`Added "${movieToAdd.Title}" successfully!`);
            // Optionally close modal after a short delay
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            setFeedback(''); // Clear 'Adding...' message
             // Handle specific error for movie already existing
            if (err.status === 409) {
                 setError(`"${movieToAdd.Title}" is already in this list.`);
            } else {
                setError('Failed to add movie.');
            }
            console.error(err);
        }
    };

    return (
        // Modal backdrop (semi-transparent background)
        <div 
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose} // Close modal if clicking outside the content area
        >
            {/* Modal content area */}
            <div
                className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6 relative animate-slideUp"
                onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    aria-label="Close modal"
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Add "{movieToAdd?.Title}" to a list</h2>

                {/* Loading state */}
                {isLoading && (
                    <div className="flex justify-center py-4">
                        <Loader className="w-8 h-8 text-indigo-500 animate-spin" />
                    </div>
                )}

                {/* Error/Feedback messages */}
                 {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                 {feedback && <p className="text-green-600 dark:text-green-400 text-sm mb-4">{feedback}</p>}


                {/* List of user's custom lists */}
                {!isLoading && !error && (
                    <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                        {lists.length === 0 ? (
                            <p className="text-slate-500 dark:text-slate-400 text-center py-4">You have no custom lists yet. <a href="/my-lists" className='text-indigo-600 dark:text-indigo-400 hover:underline'>Create one?</a></p>
                        ) : (
                            lists.map((list) => (
                                <button
                                    key={list._id}
                                    onClick={() => handleAddToList(list._id)}
                                    disabled={!!feedback} // Disable buttons after adding
                                    className="w-full text-left p-3 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors disabled:opacity-50"
                                >
                                    <span className="font-medium text-slate-700 dark:text-slate-200">{list.listName}</span>
                                </button>
                            ))
                        )}
                    </div>
                )}
                 {/* Optional: Add a button/link here to create a new list */}
            </div>
        </div>
    );
};

export default AddToListModal;