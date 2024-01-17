import { useAccount, useDisconnect } from "graz";
import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";

interface AuthContextType {
    authToken: string | null;
    login: (token: string) => void;
    logout: () => void;
}

const defaultContextValue: AuthContextType = {
    authToken: null,
    login: () => { },
    logout: () => { }
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [authToken, setAuthToken] = useState(sessionStorage.getItem('token'))
    const { disconnect } = useDisconnect();

    const login = (token: any) => {
        sessionStorage.setItem('token', token);
        setAuthToken(token)
    }

    const logout = () => {
        sessionStorage.removeItem('token')
        disconnect({chainId: ["cosmoshub-4"] });
        setAuthToken(null)
    }

    return <AuthContext.Provider value={{ authToken, login, logout }}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);
