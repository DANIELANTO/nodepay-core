import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';

export interface User {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    wallet?: Wallet;
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
        }),
        toggleUserStatus: builder.mutation<User, string>({
            query: (id) => ({ url: `/users/${id}/toggle-status`, method: 'PATCH' }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const { useGetUsersQuery, useGetUserByIdQuery, useToggleUserStatusMutation } = userApi;