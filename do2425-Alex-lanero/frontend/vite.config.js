import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Asegúrate de que es el mismo puerto que el que Vite menciona en la consola
    open: true,  // Intenta abrir el navegador automáticamente
  },
});
