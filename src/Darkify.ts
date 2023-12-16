import { options } from '../interfaces';

export const isBrowser = typeof window !== 'undefined';

export default class Darkify {
  options!: options;
  theme!: { value: string };
  cssTag!: HTMLStyleElement;
  metaTag!: HTMLMetaElement;

  private static readonly storageKey = 'darkify-theme';

  /**
   * @param {string} element Button ID ( recommended ) or HTML element
   * @param {object} options Options
   */
  constructor(element: string, options: options) {
    if (!isBrowser) {
      return;
    }

    // avoid using both values
    if (options.useLocalStorage && options.useSessionStorage) {
      console.warn('Both storage options are enabled. Disabling useSessionStorage...');
      options.useSessionStorage = false;
    } else if (!options.useLocalStorage && !options.useSessionStorage) {
      console.warn('Both storage options are disabled. Enabling useLocalStorage...');
      options.useLocalStorage = true;
    } else if (options.useSessionStorage) {
      options.useLocalStorage = false;
    }

    const defaultOptions = {
      autoMatchTheme: true,
      useLocalStorage: true,
      useSessionStorage: false,
      useColors: ['#ffffff', '#000000'],
    };

    this.options = Object.assign({}, defaultOptions, options);

    document.addEventListener('DOMContentLoaded', () => {
      this.createAttribute();
      const htmlElement = document.querySelector(element);
      htmlElement?.addEventListener('click', () => this.onClick());
    });

    // sync with system changes
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', ({ matches: isDark }) => {
        this.theme.value = isDark ? 'dark' : 'light';
        this.savePreference();
        return window.location.reload();
      });

    this.theme = {
      value: this.getOsPreference(options) ?? 'light',
    };

    this.cssTag = document.createElement('style');
    this.metaTag = document.createElement('meta');
    this.createAttribute();
  }

  // get os color preference
  getOsPreference(options: options) {
    if (options.useLocalStorage && window.localStorage.getItem(Darkify.storageKey)) {
      return window.localStorage.getItem(Darkify.storageKey);
    } else if (options.useSessionStorage && window.sessionStorage.getItem(Darkify.storageKey)) {
      return window.sessionStorage.getItem(Darkify.storageKey);
    } else {
      return options.autoMatchTheme && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
  }

  createAttribute() {
    let dataTheme = document.getElementsByTagName('html')[0];
    let css = `/**! Darkify / Easy dark mode for your site **/:root:is([data-theme="${this.theme.value}"]), [data-theme="${this.theme.value}"] {color-scheme: ${this.theme.value}}`;
    let head = document.head;

    // set theme-color meta tag
    this.metaTag.setAttribute('name', 'theme-color');
    this.metaTag.setAttribute(
      'content',
      this.theme.value === 'light' ? this.options.useColors[0] : this.options.useColors[1]
    );

    this.cssTag.setAttribute('type', 'text/css');
    this.cssTag.innerHTML = css;

    dataTheme.setAttribute('data-theme', this.theme.value);

    head.appendChild(this.metaTag);
    head.appendChild(this.cssTag);

    this.savePreference();
  }

  // save to local or session storage
  savePreference() {
    const STO = this.options.useLocalStorage ? window.localStorage : window.sessionStorage;
    const OTS = this.options.useLocalStorage ? window.sessionStorage : window.localStorage;
    OTS.removeItem(Darkify.storageKey);
    STO.setItem(Darkify.storageKey, this.theme.value);
  }

  onClick() {
    this.theme.value = this.theme.value === 'light' ? 'dark' : 'light';
    this.createAttribute();
  }
}
