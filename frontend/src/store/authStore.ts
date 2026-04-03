import { create } from 'zustand';
import keycloak from '../config/keycloak';

interface AuthState {
    isInitialized: boolean;
    isAuthenticated: boolean;
    token: string | null;
    initKeycloak: () => void;
    login: () => void;
    logout: () => void;
    clearLocalSession: () => void;
}

let isInitializing = false;

export const useAuthStore = create<AuthState>((set) => ({
    isInitialized: false,
    isAuthenticated: false,
    token: null,

    clearLocalSession: () => {
        set({ isAuthenticated: false, token: null });
        keycloak.clearToken();
    },

    initKeycloak: () => {
        if (isInitializing) return;

        isInitializing = true;

        keycloak.init({
            onLoad: 'check-sso',
            checkLoginIframe: false
        }).then((authenticated) => {
            set({
                isInitialized: true,
                isAuthenticated: authenticated,
                token: keycloak.token ?? null,
            });

            keycloak.onTokenExpired = () => {
                keycloak.updateToken(30).then((refreshed) => {
                    if (refreshed) {
                        set({ token: keycloak.token });
                        console.log('Token refrescado exitosamente');
                    }
                }).catch(() => {
                    console.error('Fallo al refrescar el token, cerrando sesión...');
                    keycloak.logout();
                });
            };
        }).catch((error) => {
            console.error('Error inicializando Keycloak:', error);
            set({ isInitialized: true, isAuthenticated: false });
        });
    },

    login: () => keycloak.login(),
    logout: () => keycloak.logout({ redirectUri: window.location.origin }),
}));