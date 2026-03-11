import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'off-the-screen',
  brand: {
    displayName: 'Off The Screen',
    primaryColor: '#0064FF',
    icon: 'https://static.toss.im/appsintoss/17199/3825b143-cdef-4e94-b173-9ae366320d8c.png',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite --host',
      build: 'tsc -b && vite build',
    },
  },
  permissions: [
    {
      name: 'geolocation',
      access: 'access',
    },
    {
      name: 'clipboard',
      access: 'read',
    },
    {
      name: 'clipboard',
      access: 'write',
    },
  ],

  outdir: 'dist',
  webViewProps: {
    type: 'partner',
  },
});
