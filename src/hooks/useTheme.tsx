import {useContext} from "react";
import {ThemeContext} from "../theme/ThemeProvider.tsx";

/*
* Esta función nos permite acceder al contexto de tema, para poder acceder al dark o light mode, y para cambiarlo.
*/
export default function useTheme() {
    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
        throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
    }

    return themeContext;
}