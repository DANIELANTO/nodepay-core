import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';
import { socket } from '../../api/socket';

export interface User {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    wallet?: Wallet;
}

export interface CreateUserRequest {
    name: string;
    email: string;
}

export interface Wallet {
    id: string;
    balance: number;
    currency: string;
    updatedAt: string;
}

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getUsers: builder.query<User[], void>({
            query: () => ({ url: '/users', method: 'GET' }),
            providesTags: ['User'],
        }),
        getUserById: builder.query<User, string>({
            query: (id) => ({ url: `/users/${id}`, method: 'GET' }),
            providesTags: (_result, _error, id) => [{ type: 'User', id }],
            async onCacheEntryAdded(_id, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    // 1. Wait for the standard HTTP request to finish
                    const { data: initialData } = await cacheDataLoaded;
                    if (!initialData.wallet?.id) return;

                    const walletId = initialData.wallet.id;

                    // 2. Connect the socket and join the "room" for this wallet
                    socket.connect();
                    socket.emit('join_wallet_room', walletId);

                    // 3. Define what happens when the backend emits a 'wallet_update'
                    const handleUpdate = (event: { walletId: string, newBalance: number }) => {
                        // Update the Redux cache in real-time.
                        // React will detect the change and update the UI instantly.
                        updateCachedData((draft) => {
                            if (draft.wallet && draft.wallet.id === event.walletId) {
                                draft.wallet.balance = event.newBalance;
                            }
                        });
                    };

                    socket.on('wallet_update', handleUpdate);

                    // 4. Cleanup: When the component unmounts (e.g., changing pages)
                    await cacheEntryRemoved;
                    socket.off('wallet_update', handleUpdate);
                    socket.disconnect();
                } catch (error) {
                    console.error('Error in cacheEntryAdded:', error);
                    socket.disconnect();
                }
            },
        }),
        toggleUserStatus: builder.mutation<User, string>({
            query: (id) => ({ url: `/users/${id}/toggle-status`, method: 'PATCH' }),
            invalidatesTags: ['User'],
        }),
        createUser: builder.mutation<User, CreateUserRequest>({
            query: (body) => ({ url: '/users', method: 'POST', data: body }),
            invalidatesTags: ['User'],
        }),
        startSimulation: builder.mutation<void, string>({
            query: (walletId) => ({ url: `/wallets/${walletId}/simulate/start`, method: 'POST' }),
        }),
        stopSimulation: builder.mutation<void, string>({
            query: (walletId) => ({ url: `/wallets/${walletId}/simulate/stop`, method: 'POST' }),
        }),
        editUser: builder.mutation<User, { id: string, name: string }>({
            query: ({ id, name }) => ({ url: `/users/${id}`, method: 'PATCH', data: { name } }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useToggleUserStatusMutation,
    useCreateUserMutation,
    useStartSimulationMutation,
    useStopSimulationMutation,
    useEditUserMutation,
} = userApi;