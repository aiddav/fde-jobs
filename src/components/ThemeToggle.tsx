import { useEffect, useState } from "preact/hooks";

type Theme = "light" | "dark" | "system";

function getCookieTheme(): Theme {
  if (typeof document === "undefined") {
    return "system";
  }
  const match = document.cookie.match(/(?:^|; )theme=([^;]+)/);
  const value = match ? decodeURIComponent(match[1]) : "system";
  return value === "light" || value === "dark" ? value : "system";
}

function applyTheme(theme: Theme) {
  if (theme === "system") {
    delete document.documentElement.dataset.theme;
    document.cookie = "theme=; Max-Age=0; Path=/; SameSite=Lax";
    return;
  }
  document.documentElement.dataset.theme = theme;
  document.cookie = `theme=${theme}; Max-Age=31536000; Path=/; SameSite=Lax`;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    setTheme(getCookieTheme());
  }, []);

  const next = theme === "system" ? "dark" : theme === "dark" ? "light" : "system";

  return (
    <button
      class="theme-toggle"
      type="button"
      aria-label={`Theme: ${theme}. Switch to ${next}.`}
      onClick={() => {
        setTheme(next);
        applyTheme(next);
      }}
    >
      {theme === "system" ? "theme:auto" : `theme:${theme}`}
    </button>
  );
}
