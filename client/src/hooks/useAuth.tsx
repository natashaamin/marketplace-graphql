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


    useEffect(() => {
        fetch("http://localhost:3001/auth/protectedRoute", {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        })
            .then((response: any) => {
                if (response.status === 401) {
                    sessionStorage.removeItem('token')
                    setAuthToken(null)
                }
                return response.json()
            })
            .catch(error => console.error('Error:', error));
    }, [authToken])

    const login = (token: any) => {
        sessionStorage.setItem('token', token);
        setAuthToken(token)
    }

    const logout = () => {
        sessionStorage.removeItem('token')
        setAuthToken(null)
    }

    return <AuthContext.Provider value={{ authToken, login, logout }}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);
