import axios from 'axios';

// Configurar axios, que es el agente que hace las solitudes al servidor, para que siempre incluya el token.
export const api = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 3000,
});

/* Cuando hagamos una solicitud al servidor, intercepta la solicitud y revisa si existe un token en localStorage
    Si sí lo hay, agregalo al header de la solicitud para que el backend pueda identificar al usuario.
    Si no hay nada, no hagas nada y devuelve la configuración como ya estaba.
 */
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers['X-Auth-Token'] = token;
    }

    return config;
});