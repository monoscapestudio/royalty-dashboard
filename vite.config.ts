import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** GitHub Actions sets BASE_PATH to `/<repository-name>/` for project Pages. Local dev stays `/`. */
const rawBase = process.env.BASE_PATH?.trim();
const base =
  rawBase === undefined || rawBase === ''
    ? '/'
    : rawBase.endsWith('/')
      ? rawBase
      : `${rawBase}/`;

export default defineConfig({
  plugins: [react()],
  base,
});
