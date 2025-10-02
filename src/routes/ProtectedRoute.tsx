import useAuth from "../hooks/useAuth.ts";
import {Navigate, Outlet} from "react-router-dom";

/*
* Esta página verifica que siempre haya información de un usuario cargada, o sea, que el usuario esté logueado.
* Si no está logueado (si loginData es null), redirige al login por la fuerza.
* */
export default function ProtectedRoute() {
    const { loginData } = useAuth();

    if (!loginData) return <Navigate to={"/login"} replace />;

    return <Outlet />;
}