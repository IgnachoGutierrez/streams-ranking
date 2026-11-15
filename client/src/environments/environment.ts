// Injected at build time with `ng build --define` (see client/Dockerfile).
declare const GA_MEASUREMENT_ID: string | undefined;

export const environment = {
  // Production: same origin as the app; the edge proxy forwards /api to the server.
  apiUrl: '/api',
  // Empty disables Google Analytics.
  gaMeasurementId: typeof GA_MEASUREMENT_ID !== 'undefined' ? GA_MEASUREMENT_ID : '',
};
