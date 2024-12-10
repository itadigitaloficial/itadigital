import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock do Firebase
vi.mock('../config/firebase', () => ({
  auth: {},
  db: {},
  storage: {},
}));

// Mock de variáveis de ambiente
vi.stubGlobal('import.meta.env', {
  VITE_FIREBASE_API_KEY: 'test-key',
  VITE_FIREBASE_AUTH_DOMAIN: 'test-domain',
  VITE_FIREBASE_PROJECT_ID: 'test-project',
  VITE_SITE_URL: 'http://localhost:3000',
});

// Limpar mocks após cada teste
afterEach(() => {
  vi.restoreAllMocks();
});
