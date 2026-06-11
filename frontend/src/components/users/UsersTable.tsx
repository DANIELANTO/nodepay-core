// src/components/users/UsersTable.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetUsersQuery, useToggleUserStatusMutation } from '../../store/api/userApi';
import type { User } from '../../store/api/userApi';
import { useUiStore } from '../../store/uiStore';
import { ConfirmModal } from '../ui/ConfirmModal';
import { UserCard } from './UserCard';
import { UsersDesktopTable } from './UsersDesktopTable';

/* ─── Loading state ─────────────────────────────────────── */
const LoadingSpinner = () => (
    <div className="flex justify-center p-12">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-accent border-t-transparent shadow-glow-sm" />
    </div>
);

/* ─── Error state ───────────────────────────────────────── */
const ErrorMessage = () => (
    <div className="rounded-xl bg-red-900/20 p-5 text-red-400 border border-red-500/30 backdrop-blur-md">
        <p className="font-semibold">Error loading users.</p>
        <p className="text-sm mt-1 text-red-400/80">Verify that the User Management Service is running.</p>
    </div>
);

/* ─── Empty state ───────────────────────────────────────── */
const EmptyState = () => (
    <div className="flex flex-col items-center gap-5 py-20 glass-card">
        <p className="text-slate-500 dark:text-slate-400">No users registered.</p>
        <Link
            to="/dashboard/users/new"
            className="btn-primary"
        >
            + Create New User
        </Link>
    </div>
);

/* ─── Main Orchestrator ─────────────────────────────────── */
export const UsersTable = () => {
    const [page, setPage] = useState(1);
    const limit = useUiStore((state) => state.usersTableLimit);
    const setLimit = useUiStore((state) => state.setUsersTableLimit);

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (debouncedSearch !== search) {
                setDebouncedSearch(search);
                setPage(1);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search, debouncedSearch]);

    const { data: response, isLoading, isError } = useGetUsersQuery({ page, limit, search: debouncedSearch });
    const users = response?.data || [];
    const [toggleUserStatus, { isLoading: isToggling }] = useToggleUserStatusMutation();

    const [userToToggle, setUserToToggle] = useState<Pick<User, 'id' | 'isActive' | 'name'> | null>(null);

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

    const renderPaginationControls = () => {
        if (!response) return null;
        return (
            <>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <div className="flex items-center gap-3">
                        <label htmlFor="limit-select" className="text-xs text-slate-500 dark:text-slate-400">Rows per page:</label>
                        <select
                            id="limit-select"
                            value={limit}
                            onChange={(e) => {
                                setLimit(Number(e.target.value));
                                setPage(1);
                            }}
                            className="input-glass h-8 bg-transparent py-0 pl-2 pr-7 text-xs"
                        >
                            {[5, 10, 25, 50].map((size) => (
                                <option key={size} value={size} className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="hidden sm:block h-4 w-px bg-border-subtle"></div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
                        Showing <span className="font-medium text-slate-900 dark:text-slate-50">{response.total === 0 ? 0 : (response.page - 1) * response.limit + 1}</span> to{' '}
                        <span className="font-medium text-slate-900 dark:text-slate-50">{Math.min(response.page * response.limit, response.total)}</span> of{' '}
                        <span className="font-medium text-slate-900 dark:text-slate-50">{response.total}</span>
                    </p>
                </div>
                <div className="flex justify-center">
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={response.page === 1}
                            className="relative inline-flex items-center rounded-l-md px-2 py-1.5 text-muted-foreground border border-border-subtle hover:bg-surface-elevated focus:z-20 outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:hover:bg-transparent transition-colors cursor-pointer"
                        >
                            <span className="sr-only">Previous</span>
                            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                            </svg>
                        </button>

                        {Array.from({ length: response.totalPages }).map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setPage(i + 1)}
                                className={`relative inline-flex items-center px-3 py-1.5 text-xs font-semibold border border-border-subtle outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors cursor-pointer ${response.page === i + 1 ? 'z-10 bg-accent text-white border-accent hover:bg-accent-hover shadow-glow-sm' : 'text-foreground hover:bg-surface-elevated focus:z-20'}`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setPage(p => Math.min(response.totalPages, p + 1))}
                            disabled={response.page === response.totalPages}
                            className="relative inline-flex items-center rounded-r-md px-2 py-1.5 text-muted-foreground border border-border-subtle hover:bg-surface-elevated focus:z-20 outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:hover:bg-transparent transition-colors cursor-pointer"
                        >
                            <span className="sr-only">Next</span>
                            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </nav>
                </div>
            </>
        );
    };

    return (
        <div className="flex flex-col flex-1 min-h-0">
            {/* ── Header ─────────────────────────────────── */}
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-50">Users</h2>
                <Link
                    to="/dashboard/users/new"
                    id="create-user-btn"
                    className="btn-primary inline-flex items-center gap-2"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Create New User
                </Link>
            </div>

            {/* ── Search ─────────────────────────────────── */}
            <div className="relative mb-3">
                <svg
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 dark:text-slate-400"
                    fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                >
                    <circle cx="11" cy="11" r="8" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" />
                </svg>
                <input
                    id="search-users"
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="input-glass w-full !pl-12"
                />
            </div>

            {users.length === 0 ? (
                search ? (
                    <div className="flex flex-col items-center gap-5 py-20 glass-card">
                        <p className="text-slate-500 dark:text-slate-400">No users found matching "{search}".</p>
                        <button
                            onClick={() => setSearch('')}
                            className="btn-secondary"
                        >
                            Clear Search
                        </button>
                    </div>
                ) : (
                    <EmptyState />
                )
            ) : (
                <>
            {/* ── Mobile: card list (hidden on md+) ──────── */}
            <div className="flex flex-col gap-3 md:hidden">
                {users.map((user) => (
                    <UserCard key={user.id} user={user} onRequestToggle={setUserToToggle} />
                ))}
            </div>

            {/* ── Mobile: Pagination ──────── */}
            {response && (
                <div className="md:hidden mt-3 flex flex-col gap-4 glass-card px-4 py-3">
                    {renderPaginationControls()}
                </div>
            )}

            {/* ── Desktop: table + pagination (hidden below md) ───────── */}
            <div className="hidden md:flex flex-col flex-1 min-h-0 glass-card overflow-hidden">
                <UsersDesktopTable users={users} onRequestToggle={setUserToToggle} />
                
                {/* ── Desktop Pagination ───────────────────────────── */}
                {response && (
                    <div className="flex-shrink-0 flex flex-col lg:flex-row lg:items-center lg:justify-between px-5 py-2.5 border-t border-border-subtle bg-surface-elevated/30">
                        {renderPaginationControls()}
                    </div>
                )}
            </div>
                </>
            )}

            {/* ── Confirm Modal ───────────────────────────── */}
            <ConfirmModal
                open={userToToggle !== null}
                title="Confirm Action"
                description={
                    <>
                        Are you sure you want to{' '}
                        <strong className="text-slate-900 dark:text-slate-50">{userToToggle?.isActive ? 'disable' : 'enable'}</strong>{' '}
                        user <span className="text-slate-900 dark:text-slate-50 font-medium">{userToToggle?.name}</span>?
                    </>
                }
                confirmLabel={userToToggle?.isActive ? 'Disable' : 'Enable'}
                variant={userToToggle?.isActive ? 'danger' : 'success'}
                onConfirm={handleConfirm}
                onCancel={() => setUserToToggle(null)}
                isLoading={isToggling}
            />
        </div>
    );
};