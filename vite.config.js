import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
// const fs = require('fs')
import * as fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    open: true,
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem')
    }
  }
})
