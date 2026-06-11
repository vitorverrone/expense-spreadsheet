'use client';

import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import UserInterface from "../../interfaces/user.interface";

interface AuthContextType {
    user: UserInterface | null;
}

const AuthContext = createContext<AuthContextType>({ user: null });

export function AuthProvider({ user, children }: { user: UserInterface | null, children: ReactNode }) {
    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}
