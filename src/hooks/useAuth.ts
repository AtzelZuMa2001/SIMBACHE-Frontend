import {useContext} from "react";
import {AuthContext} from "../auth/AuthProvider.tsx";

/* Esta función nos permite extraer la información que guardamos de manera global (aquí se le llama contexto a ese entorno "global")
Nos va a permitir acceder a los datos como el nombre y el token de la sesión del usuario desde donde sea.
 */
export default function useAuth() {
    const loginContext = useContext(AuthContext);

    if (!loginContext) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }

    return loginContext;
}