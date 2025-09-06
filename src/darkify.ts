import { isBrowser } from './isBrowser';
import { defaultOptions } from './defaultOptions';
import { type Options } from '../types';

export class Darkify {
  private static readonly storageKey = 'theme';
  readonly options: Options = {};
  theme: string = 'light';
  _style!: HTMLStyleElement;
  _meta!: HTMLMetaElement;

  /**
   * @param {string} element Button ID ( recommended ) or HTML element
   * @param {object} options Options
   * @see {@link https://github.com/emrocode/darkify-js/wiki|Documentation}
   */
  constructor(element: string, options: Options) {
    if (!isBrowser) return;

    // avoid using both values
    options?.useLocalStorage && (options.useSessionStorage = false);
    options?.useSessionStorage && (options.useLocalStorage = false);

    // merge defaults with user options
    options = { ...defaultOptions, ...options };
    this.options = options;

    this.init(element);
    this.theme = this.getOsPreference(options);
    this._style = document.createElement('style');
    this._meta = document.createElement('meta');
    this.createAttribute();
    this.syncThemeBetweenTabs();
  }

  init(element: string) {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', ({ matches: isDark }) => {
        this.theme = isDark ? 'dark' : 'light';
        this.savePreference();
      });

    document.addEventListener('DOMContentLoaded', () => {
      const htmlElement = document.querySelector<HTMLElement>(element);
      htmlElement?.addEventListener('click', () => this.toggleTheme());
    });
  }

  // get os color preference
  getOsPreference(options: Options): string {
    const { autoMatchTheme, useLocalStorage, useSessionStorage } = options;
    const STO =
      (useLocalStorage && window.localStorage.getItem(Darkify.storageKey)) ||
      (useSessionStorage && window.sessionStorage.getItem(Darkify.storageKey)) ||
      (autoMatchTheme && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light');

    return STO;
  }

  createAttribute() {
    const dataTheme = document.getElementsByTagName('html')[0];
    const { useColorScheme } = this.options;
    let css = `/**! Darkify / A simple dark mode toggle library **/\n:root:is([data-theme="${this.theme}"]),[data-theme="${this.theme}"]{color-scheme:${this.theme}}`;

    dataTheme.setAttribute('data-theme', this.theme);

    this.updateTags(css, useColorScheme ?? []);
    this.savePreference();
  }

  updateTags(css: string, useColorScheme: string[]) {
    const head = document.head || document.getElementsByTagName('head')[0];

    // update theme-color meta tag
    this._meta.setAttribute('name', 'theme-color');
    this._meta.setAttribute(
      'content',
      this.theme === 'light' ? useColorScheme[0] : useColorScheme[1]
    );

    // update style tag
    this._style.setAttribute('type', 'text/css');
    this._style.innerHTML = css;

    head.appendChild(this._meta);
    head.appendChild(this._style);
  }

  // save to local or session storage
  savePreference() {
    const { useLocalStorage } = this.options;
    const STO = useLocalStorage ? window.localStorage : window.sessionStorage;
    const OTS = useLocalStorage ? window.sessionStorage : window.localStorage;

    OTS.removeItem(Darkify.storageKey);
    STO.setItem(Darkify.storageKey, this.theme);
  }

  syncThemeBetweenTabs() {
    window.addEventListener('storage', e => {
      if (e.key === Darkify.storageKey && e.newValue) {
        this.theme = e.newValue;
        this.createAttribute();
      }
    });
  }

  /**
   * Toggles the theme between light and dark modes
   * @returns {void}
   */
  toggleTheme(): void {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.createAttribute();
  }

  /**
   * Retrieves the current active theme
   * @returns {string}
   */
  getCurrentTheme(): string {
    return this.theme;
  }
}
