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
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
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
        <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Edit User</h2>

            {!!error && (
                <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
                    <p className="font-semibold">Error editing user. {(error as any)?.data?.message || ''}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={userToEdit.email}
                        readOnly
                        aria-readonly="true"
                        className="mt-1 block w-full cursor-not-allowed rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-500 shadow-sm focus:outline-none"
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard/users')}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || !hasChanged}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};
