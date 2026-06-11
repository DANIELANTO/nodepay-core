import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateUserMutation } from '../store/api/userApi';

export const CreateUser = () => {
    const navigate = useNavigate();
    const [createUser, { isLoading, error }] = useCreateUserMutation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createUser({ name, email }).unwrap();
            navigate('/dashboard/users');
        } catch (err) {
            console.error('Failed to create user', err);
        }
    };

    return (
        <div className="mx-auto max-w-2xl glass-card p-8">
            <h2 className="mb-8 text-2xl font-display font-bold text-slate-900 dark:text-slate-50">Create User</h2>

            {!!error && (
                <div className="mb-6 rounded-xl bg-red-900/20 p-5 text-red-400 border border-red-500/30 backdrop-blur-md">
                    <p className="font-semibold">Error creating user. {(error as any)?.data?.message || ''}</p>
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="input-glass w-full"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard/users')}
                        className="btn-secondary"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary disabled:opacity-50 disabled:hover:brightness-100 disabled:hover:shadow-none disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating...' : 'Create User'}
                    </button>
                </div>
            </form>
        </div>
    );
};
