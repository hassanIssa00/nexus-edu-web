import { create } from 'zustand';

interface User {
    id: string;
    email: string;
    role: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', token);
        }
        set({ user, token });
    },
    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
        }
        set({ user: null, token: null });
    },
}));
