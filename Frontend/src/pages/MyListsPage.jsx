import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../api/apiService';
import { Loader, Plus, List, Trash2 } from 'lucide-react';

const MyListsPage = () => {
    const [lists, setLists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [newListName, setNewListName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const fetchLists = async () => {
        setIsLoading(true);
        try {
            const response = await apiService.getUserLists();
            setLists(response.data);
        } catch (err) {
            setError('Failed to fetch your lists.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLists();
    }, []);

    const handleCreateList = async (e) => {
        e.preventDefault();
        if (!newListName.trim()) return;
        setIsCreating(true);
        setError('');
        try {
            await apiService.createCustomList({ listName: newListName });
            setNewListName(''); // Clear input
            await fetchLists(); // Refetch lists
        } catch (err) {
            setError(err.data?.message || 'Failed to create list.');
        } finally {
            setIsCreating(false);
        }
    };

     const handleDeleteList = async (listId, listName) => {
        if (window.confirm(`Are you sure you want to delete the list "${listName}"?`)) {
            try {
                await apiService.deleteCustomList(listId);
                await fetchLists(); // Refetch lists
            } catch (err) {
                setError('Failed to delete list.');
                console.error(err);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
                <Loader className="w-12 h-12 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-6 md:px-12">
                <header className="mb-12">
                     <div className="flex items-center gap-4 mb-4">
                        <div className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-500/30">
                            <List className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white">My Custom Lists</h1>
                        </div>
                    </div>
                </header>

                {/* Create New List Form */}
                <form onSubmit={handleCreateList} className="mb-12 bg-slate-100 dark:bg-slate-800 p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-700 dark:text-white mb-4">Create New List</h2>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            placeholder="e.g., Weekend Watchlist"
                            className="flex-grow p-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            required
                        />
                        <button
                            type="submit"
                            disabled={isCreating}
                            className="px-5 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isCreating ? <Loader className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                            Create
                        </button>
                    </div>
                </form>

                {/* List of Custom Lists */}
                {lists.length === 0 && !isLoading ? (
                    <p className="text-center text-slate-500 dark:text-slate-400 py-10">You haven't created any custom lists yet.</p>
                ) : (
                    <div className="space-y-4">
                        {lists.map((list) => (
                            <div key={list._id} className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg shadow-sm flex justify-between items-center">
                                {/* Link to view list details (We need to create this page next) */}
                                <Link to={`/list/${list._id}`} className="hover:underline">
                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{list.listName}</h3>
                                    {list.description && <p className="text-sm text-slate-500 dark:text-slate-400">{list.description}</p>}
                                </Link>
                                <button
                                    onClick={() => handleDeleteList(list._id, list.listName)}
                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-500/10"
                                    title="Delete list"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyListsPage;