/* eslint-disable @typescript-eslint/naming-convention */
const ENVIRONMENT = process.env.NODE_ENV

export const featureToggle = {
  keyboardShortcutSearch: true,
}

export const MESSAGE_BATCH = 10

export const DATE_FORMAT = 'LLL'

export const NEXT_APP_URLS = {
  development: 'http:localhost:3000',
  production: '',
  test: '',
}

export const APP_URL = NEXT_APP_URLS[ENVIRONMENT]
