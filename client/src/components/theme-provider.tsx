import { createContext, useContext, useEffect } from "react";

interface ThemeContextType {
  theme: "dark";
  actualTheme: "dark";
}

const ThemeContext = createContext<ThemeContextType>({ theme: "dark", actualTheme: "dark" });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light");
    root.classList.add("dark");
    root.setAttribute("data-theme", "dark");
    localStorage.setItem("fgs-theme", "dark");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "dark", actualTheme: "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
