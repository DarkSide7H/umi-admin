import { defineConfig } from '@umijs/max';

const { UMI_ENV = '' } = process.env;

export default defineConfig({
  define: {
    UMI_ENV,
    // API_HOST: 'http://192.168.5.131:8082',
    API_HOST: 'http://192.168.2.166:8082',
  },
});
