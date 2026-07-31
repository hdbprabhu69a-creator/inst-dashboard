export const DELIVERY_CONFIG = {
  BASE_URL: "https://www.nseindia.com/all-reports",

  REPORT_NAME: "Full Bhavcopy and Security Deliverable Data",

  FILE_PATTERN: /^sec_bhavdata_full_\d{8}\.csv$/i,

  DOWNLOAD_DIR: "data/delivery/incoming",

  LOG_DIR: "logs/playwright",

  HEADLESS: true,

  TIMEOUT: 60000,

  NAVIGATION_TIMEOUT: 90000,

  DOWNLOAD_TIMEOUT: 180000,

  RETRY_SCHEDULE: [
    "16:35",
    "16:45",
    "17:00",
    "17:15",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "20:00"
  ],

  SELECTORS: {
    SEARCH: 'input.searchbox-input[placeholder="Search...."]',
    REPORT_CARD: "a[href], button",
    DOWNLOAD_BUTTON: "a[download], button",
    DATE_PICKER: 'input[type="date"]'
  }
} as const;

