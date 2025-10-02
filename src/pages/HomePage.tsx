import useAuth from "../hooks/useAuth.ts";

export default function HomePage() {
    const { loginData } = useAuth();
    const name = loginData?.firstName + ' ' + loginData?.lastName;
    return (
        <h1>Bienvenido de vuelta, {name}</h1>
    );
}