import {createContext, type ReactNode, useState} from "react";
import {CssBaseline, type Theme, ThemeProvider} from "@mui/material";
import {darkTheme} from "./DarkTheme.ts";
import {lightTheme} from "./lightTheme.ts";

interface ThemeContextProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextProps | null>(null);

export function ThemeContextProvider({children}: {children: ReactNode}) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const toggleDarkMode = () => setIsDarkMode(prev => !prev);

    const theme: Theme = isDarkMode ? darkTheme : lightTheme

    return (
        <ThemeContext.Provider value={{isDarkMode, toggleDarkMode}}>
            <ThemeProvider theme={theme}>
                <CssBaseline enableColorScheme />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}