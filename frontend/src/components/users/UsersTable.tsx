// src/components/users/UsersTable.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetUsersQuery, useToggleUserStatusMutation } from '../../store/api/userApi';
import type { User } from '../../store/api/userApi';
import { ConfirmModal } from '../ui/ConfirmModal';
import { UserCard } from './UserCard';
import { UsersDesktopTable } from './UsersDesktopTable';

/* ─── Loading state ─────────────────────────────────────── */
const LoadingSpinner = () => (
    <div className="flex justify-center p-12">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
    </div>
);

/* ─── Error state ───────────────────────────────────────── */
const ErrorMessage = () => (
    <div className="rounded-xl bg-red-50 p-5 text-red-700">
        <p className="font-semibold">Error loading users.</p>
        <p className="text-sm">Verify that the User Management Service is running.</p>
    </div>
);

/* ─── Empty state ───────────────────────────────────────── */
const EmptyState = () => (
    <div className="flex flex-col items-center gap-4 py-16">
        <p className="text-gray-400">No users registered.</p>
        <Link
            to="/dashboard/users/new"
            className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-green-700"
        >
            + Create New User
        </Link>
    </div>
);

/* ─── Main Orchestrator ─────────────────────────────────── */
export const UsersTable = () => {
    const { data: users = [], isLoading, isError } = useGetUsersQuery();
    const [toggleUserStatus, { isLoading: isToggling }] = useToggleUserStatusMutation();

    const [search, setSearch] = useState('');
    const [userToToggle, setUserToToggle] = useState<Pick<User, 'id' | 'isActive' | 'name'> | null>(null);

    const filtered = users.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()),
    );

    const handleConfirm = async () => {
        if (!userToToggle) return;
        try {
            await toggleUserStatus(userToToggle.id).unwrap();
        } catch (err) {
            console.error('Error toggling status', err);
        } finally {
            setUserToToggle(null);
        }
    };

    if (isLoading) return <LoadingSpinner />;
    if (isError) return <ErrorMessage />;
    if (users.length === 0) return <EmptyState />;

    return (
        <>
            {/* ── Header ─────────────────────────────────── */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold text-white">Users</h2>
                <Link
                    to="/dashboard/users/new"
                    id="create-user-btn"
                    className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path d="M12 4v16m8-8H4" />
                    </svg>
                    Create New User
                </Link>
            </div>

            {/* ── Search ─────────────────────────────────── */}
            <div className="relative mb-4">
                <svg
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                    fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                    id="search-users"
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm placeholder:text-gray-600 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-100"
                />
            </div>

            {/* ── Mobile: card list (hidden on md+) ──────── */}
            <div className="flex flex-col gap-3 md:hidden">
                {filtered.map((user) => (
                    <UserCard key={user.id} user={user} onRequestToggle={setUserToToggle} />
                ))}
            </div>

            {/* ── Desktop: table (hidden below md) ───────── */}
            <UsersDesktopTable users={filtered} onRequestToggle={setUserToToggle} />

            {/* ── Confirm Modal ───────────────────────────── */}
            <ConfirmModal
                open={userToToggle !== null}
                title="Confirm Action"
                description={
                    <>
                        Are you sure you want to{' '}
                        <strong>{userToToggle?.isActive ? 'disable' : 'enable'}</strong>{' '}
                        user {userToToggle?.name}?
                    </>
                }
                confirmLabel={userToToggle?.isActive ? 'Disable' : 'Enable'}
                variant={userToToggle?.isActive ? 'danger' : 'success'}
                onConfirm={handleConfirm}
                onCancel={() => setUserToToggle(null)}
                isLoading={isToggling}
            />
        </>
    );
};