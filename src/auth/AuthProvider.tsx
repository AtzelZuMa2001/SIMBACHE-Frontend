import {createContext, type ReactNode, useState} from "react";
import type {AuthContextType, LoginPayload, LoginResponse} from '../types/Login.ts';
import {api} from "../utils/api.ts";

// Estas cosas llamadas contexto nos permite guardar valores de manera global, y acceder a ellos desde cualquier parte de la app.
export const AuthContext = createContext<AuthContextType | null>(null);

/* Este es el nombre de la key con la que vamos a guardar el usuario en el localStorage.
localStorage es un tipo de almacenamiento local adentro de los navegadores web, y nos permite guardar cosas en el navegador
para que si recargamos la página o la cerramos y la volvemos a abrir, estas cosas se mantengan.
 */
const STORAGE_KEY = 'auth';

export function AuthProvider({children} : {children: ReactNode}) {
    // Para llevar saber si el proceso de login está procesándose o ya ha terminado
    const [loading, setLoading] = useState<boolean>(false);

    // Intentar cargar desde localStorage el token de sesión del usuario y si no existe, redirigir al login
    const [loginData, setLoginData] = useState<LoginResponse | null>(
        () => {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                return stored ? JSON.parse(stored) as LoginResponse : null;
            } catch {
                return null;
            }
    });

    const login = async (payload: LoginPayload) => {
        setLoading(true);

        try {
            const response = await api.post<LoginPayload, LoginResponse>('/api/auth/login', payload)

            setLoginData(response);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(response));
            return response;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        if (!loginData) return;

        await api.post('/api/auth/logout');
        setLoginData(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    const value: AuthContextType = {
        loginData,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}