import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UiState {
    usersTableLimit: number;
    setUsersTableLimit: (limit: number) => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

export const useUiStore = create<UiState>()(
    persist(
        (set) => ({
            usersTableLimit: 10, // Default value
            setUsersTableLimit: (limit) => set({ usersTableLimit: limit }),
            theme: 'light', // Default to light mode
            toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
        }),
        {
            name: 'ui-preferences', // Key in localStorage
        }
    )
);
