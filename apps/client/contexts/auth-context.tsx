'use client';

import { createContext, useContext } from 'react';
import UserInterface from '../../../interfaces/user.interface';

interface AuthContextType {
    user: UserInterface | null;
}

const AuthContext = createContext<AuthContextType>({ user: null });

export function AuthProvider({ user, children }: { user: UserInterface | null; children: React.ReactNode }) {
    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
