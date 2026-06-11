import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useEditUserMutation, useGetUserByIdQuery } from '../store/api/userApi';

export const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const { data: fetchedUser, isLoading: isFetching, error: fetchError } = useGetUserByIdQuery(id as string, {
        skip: !id || !!location.state?.user,
    });

    const userToEdit = location.state?.user || fetchedUser;

    const [editUser, { isLoading: isEditing, error: editError }] = useEditUserMutation();
    const [name, setName] = useState('');

    useEffect(() => {
        if (userToEdit) {
            setName(userToEdit.name);
        }
    }, [userToEdit]);

    useEffect(() => {
        if (fetchError) {
            navigate('/dashboard/users');
        }
    }, [fetchError, navigate]);

    if (isFetching) {
        return (
            <div className="flex justify-center p-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent shadow-glow-sm"></div>
            </div>
        );
    }

    if (!userToEdit) return null;

    const hasChanged = name.trim() !== userToEdit.name && name.trim().length > 0;
    const isLoading = isFetching || isEditing;
    const error = editError;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!hasChanged) return;
        try {
            await editUser({ id: userToEdit.id, name: name.trim() }).unwrap();
            navigate('/dashboard/users');
        } catch (err) {
            console.error('Failed to edit user', err);
        }
    };

    return (
        <div className="mx-auto max-w-2xl glass-card p-8">
            <h2 className="mb-8 text-2xl font-display font-bold text-slate-900 dark:text-slate-50">Edit User</h2>

            {!!error && (
                <div className="mb-6 rounded-xl bg-red-900/20 p-5 text-red-400 border border-red-500/30 backdrop-blur-md">
                    <p className="font-semibold">Error editing user. {(error as any)?.data?.message || ''}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="input-glass w-full"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={userToEdit.email}
                        readOnly
                        aria-readonly="true"
                        className="input-glass w-full bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 cursor-not-allowed focus:border-slate-200 dark:border-slate-800 focus:ring-0 focus:shadow-none"
                    />
                </div>

                <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard/users')}
                        className="w-full btn-secondary"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || !hasChanged}
                        className="w-full btn-primary disabled:opacity-50 disabled:hover:brightness-100 disabled:hover:shadow-none disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};
