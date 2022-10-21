import { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  fullyParallel: true,
  retries: 1,
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    viewport: { width: 1440, height: 900 },
    bypassCSP: true,
    launchOptions: {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-gpu',
        '--disable-dev-shm-usage'
      ]
    }
  },
  webServer: {
    command: 'yarn build:e2e:start',
    url: 'http://localhost:3000',
    env: {
      E2E_COVERAGE: 'true',
      NODE_ENV: 'production',
      NEXT_PUBLIC_BASE_API_URL: 'http://localhost:7777',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET as string,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL as string,
      NEXT_PUBLIC_BYPASS_SESSION: 'enabled',
      NEXT_PUBLIC_USE_TOPTAL_THEME: 'enabled'
    },
    timeout: 120 * 100000
  },
  projects: [
    {
      name: 'e2e',
      outputDir: '../../screenshots',
      testMatch: '**/*.e2e.test.ts',
      timeout: 30000,
      use: {
        baseURL: 'http://localhost:3000'
      }
    }
  ],
  reporter: [
    ['list'],
    [
      'html',
      {
        open: 'never',
        outputFolder: '../../reports'
      }
    ]
  ]
}

export default config
