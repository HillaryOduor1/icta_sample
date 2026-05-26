import type{ AppSettings } from "../stores/settings-store"; 

export function applySettings(settings: AppSettings) {
  const root = document.documentElement;

  /* ================= THEME ================= */
  root.classList.remove("light", "dark");
  if (settings.theme.mode === "dark") root.classList.add("dark");
  if (settings.theme.mode === "light") root.classList.add("light");

  /* ================= CSS VARIABLES ================= */
  root.style.setProperty("--primary-color", settings.theme.primaryColor);
  root.style.setProperty("--secondary-color", settings.theme.secondaryColor);
  root.style.setProperty("--background-color", settings.theme.backgroundColor);
  root.style.setProperty("--text-color", settings.theme.textColor);

  /* ================= ACCESSIBILITY ================= */
  root.classList.toggle("high-contrast", settings.accessibility.highContrast);
  root.classList.toggle("reduced-motion", settings.accessibility.reducedMotion);

  /* Text scale */
  root.style.fontSize = `${settings.accessibility.textScale * 100}%`;

  /* Color vision */
  root.dataset.colorVision = settings.accessibility.colorVision || "default";
}
