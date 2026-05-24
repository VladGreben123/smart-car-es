import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// При деплое на GitHub Pages ассеты должны загружаться по пути /<repo>/.
// Для локальной разработки оставляем "/".
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/smart-car-es/" : "/",
}));
