import { Options } from '../interfaces';

export const isBrowser = typeof window !== 'undefined';

export default class Darkify {
  options!: Options;
  theme!: { value: string };
  cssTag!: HTMLStyleElement;
  metaTag!: HTMLMetaElement;

  private static readonly storageKey = 'darkify-theme';

  /**
   * @param {string} element Button ID ( recommended ) or HTML element
   * @param {object} options Options
   */
  constructor(element: string, options: Options) {
    if (!isBrowser) {
      return;
    }

    // avoid using both values
    if (options.useLocalStorage && options.useSessionStorage) {
      console.warn('Both storage options are enabled. Disabling useSessionStorage...');
      options.useSessionStorage = false;
    }

    // adjust storage options
    if (!options.useLocalStorage) {
      options.useLocalStorage = false;
    }

    const defaultOptions: Options = {
      autoMatchTheme: true,
      useLocalStorage: true,
      useSessionStorage: false,
      useColorScheme: ['#ffffff', '#000000'],
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
      .addEventListener('change', ({ matches: isDark, media }) => {
        if (media !== 'print') {
          this.theme.value = isDark ? 'dark' : 'light';
          this.savePreference();
          return window.location.reload();
        }
      });

    this.theme = {
      value: this.getOsPreference(options) ?? 'light',
    };

    this.cssTag = document.createElement('style');
    this.metaTag = document.createElement('meta');
    this.createAttribute();
  }

  // get os color preference
  getOsPreference(options: Options) {
    const { autoMatchTheme, useLocalStorage, useSessionStorage } = options;

    const LSTO = useLocalStorage && window.localStorage.getItem(Darkify.storageKey);
    const SSTO = useSessionStorage && window.sessionStorage.getItem(Darkify.storageKey);

    if (LSTO) {
      return window.localStorage.getItem(Darkify.storageKey);
    } else if (SSTO) {
      return window.sessionStorage.getItem(Darkify.storageKey);
    } else {
      return autoMatchTheme && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
  }

  createAttribute() {
    let dataTheme = document.getElementsByTagName('html')[0];
    let { useColorScheme } = this.options;
    let css = `/**! Darkify / Easy dark mode for your site **/:root:is([data-theme="${this.theme.value}"]), [data-theme="${this.theme.value}"] {color-scheme: ${this.theme.value}}`;

    dataTheme.setAttribute('data-theme', this.theme.value);

    this.updateTags(css, useColorScheme);
    this.savePreference();
  }

  updateTags(css: string, useColorScheme: string[]) {
    let head = document.head;

    // update theme-color meta tag
    this.metaTag.setAttribute('name', 'theme-color');
    this.metaTag.setAttribute(
      'content',
      this.theme.value === 'light' ? useColorScheme[0] : useColorScheme[1]
    );

    // update style tag
    this.cssTag.setAttribute('type', 'text/css');
    this.cssTag.innerHTML = css;

    head.appendChild(this.metaTag);
    head.appendChild(this.cssTag);
  }

  // save to local or session storage
  savePreference() {
    const { useLocalStorage } = this.options;

    const STO = useLocalStorage ? window.localStorage : window.sessionStorage;
    const OTS = useLocalStorage ? window.sessionStorage : window.localStorage;

    // remove unused storage
    OTS.removeItem(Darkify.storageKey);
    // set storage value
    STO.setItem(Darkify.storageKey, this.theme.value);
  }

  onClick() {
    this.theme.value = this.theme.value === 'light' ? 'dark' : 'light';
    this.createAttribute();
  }
}
