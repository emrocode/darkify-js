import { options } from '../interfaces';

export const isBrowser = typeof window !== 'undefined';

export default class Darkify {
  cssTag!: HTMLStyleElement;
  savePreference!: () => void;
  theme!: { value: string; };
  /**
   *
   * @param {string} element Button ID ( recommended ) or HTML element
   * @param {object} options Options
   */
  constructor(element: string, options: options) {
    if (!isBrowser) {
      return;
    }

    const storageKey = 'darkify-theme';
    const defaultTheme = 'light';

    const defaultOptions = {
      useLocalStorage: true,
      useSessionStorage: false,
      autoMatchTheme: true,
    };

    options = Object.assign({}, defaultOptions, options);

    window.onload = () => {
      this.createAttribute();

      document.querySelector(element)?.addEventListener('click', () => {
        return this.onClick();
      });
    };

    // sync with system changes
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', ({ matches: isDark }) => {
        theme.value = isDark ? 'dark' : 'light';
        savePreference();
        return window.location.reload();
      });

    const theme = {
      value: this.getOsPreference(options, storageKey) ?? defaultTheme,
    };

    // save to local or session storage
    const savePreference = () => {
      if (options.useLocalStorage && options.useSessionStorage === false) {
        window.sessionStorage.removeItem(storageKey);
        window.localStorage.setItem(storageKey, theme.value);
      } else if (options.useSessionStorage) {
        window.localStorage.removeItem(storageKey);
        window.sessionStorage.setItem(storageKey, theme.value);
      }
    };

    const cssTag = document.createElement('style');

    this.cssTag = cssTag;
    this.savePreference = savePreference;
    this.theme = theme;
  }

  // get os color preference
  getOsPreference(options: options, storageKey: string) {
    if (options.useLocalStorage && window.localStorage.getItem(storageKey))
      return window.localStorage.getItem(storageKey);
    else if (
      options.useSessionStorage &&
      window.sessionStorage.getItem(storageKey)
    )
      return window.sessionStorage.getItem(storageKey);
    else
      return options.autoMatchTheme &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
  }

  createAttribute() {
    let dataTheme = document.getElementsByTagName('html');
    dataTheme[0].setAttribute('data-theme', `${this.theme.value}`);

    let css = `/**! Darkify [ Create an easy dark mode for your site ] **/:root:is([data-theme="${this.theme.value}"]){color-scheme: ${this.theme.value}}`;

    this.updateStyles(css);
    this.savePreference();
  }

  updateStyles = (css: string) => {
    this.cssTag.setAttribute('type', 'text/css');
    this.cssTag.innerHTML = css;
    document.head.appendChild(this.cssTag);
  };

  onClick() {
    this.theme.value = this.theme.value === 'light' ? 'dark' : 'light';
    this.createAttribute();
  }
}
