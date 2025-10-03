import useAuth from "../../hooks/useAuth.ts";

export default function HomePage() {
    const auth = useAuth();
    const name = auth.loginData?.firstName + ' ' + auth.loginData?.lastName;
    return (
        <h1>Bienvenido de vuelta, {name}</h1>
    );
}