import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const aiApi = createApi({
    reducerPath: 'aiApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_AI_API_URL }),
    endpoints: (builder) => ({
        askTerms: builder.mutation<{ question: string; answer: string; cached: boolean }, { question: string }>({
            query: (body) => ({
                url: '/ask',
                method: 'POST',
                body,
            }),
        }),
        askInsights: builder.mutation<{ question: string; insight: string }, { question: string }>({
            query: (body) => ({
                url: '/data-insights',
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useAskTermsMutation, useAskInsightsMutation } = aiApi;