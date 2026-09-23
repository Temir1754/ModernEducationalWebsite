import { createContext, useContext, useEffect } from "react";

interface ThemeContextType {
  theme: "light";
  actualTheme: "light";
}

const ThemeContext = createContext<ThemeContextType>({ theme: "light", actualTheme: "light" });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    root.classList.add("light");
    root.setAttribute("data-theme", "light");
    localStorage.setItem("school-theme", "light");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "light", actualTheme: "light" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
