export {};

declare global {
  interface Window {
    recaptchaVerifier: any; //eslint-disable-line
    recaptchaWidgetId: any; //eslint-disable-line
  }
}
