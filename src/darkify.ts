import { isBrowser } from './isBrowser';
import { defaultOptions } from './defaultOptions';
import type { Options } from '../types';

export class Darkify {
  private static readonly storageKey: string = 'theme';
  readonly options: Options = defaultOptions;
  theme: string = 'light';
  _style!: HTMLStyleElement;
  _meta!: HTMLMetaElement;

  /**
   * @param {string} element Button ID ( recommended ) or HTML element
   * @param {object} options Options
   * @see {@link https://github.com/emrocode/darkify-js/wiki|Documentation}
   */
  constructor(element: string, options: Partial<Options>) {
    if (!isBrowser) return;

    // merge defaults with user options
    const opts = { ...defaultOptions, ...options } as Options;

    // avoid using both values
    if (opts.useLocalStorage && opts.useSessionStorage) {
      opts.useSessionStorage = false;
    }

    this.options = opts;
    this.theme = this.getOsPreference(this.options);
    this._style = document.createElement('style');
    this._meta = document.createElement('meta');

    this.init(element);
    this.createAttribute();
    this.syncThemeBetweenTabs();
  }

  private init(element?: string) {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', ({ matches: isDark }) => {
        this.theme = isDark ? 'dark' : 'light';
        this.createAttribute();
      });

    if (element) {
      document.addEventListener('DOMContentLoaded', () => {
        const htmlElement = document.querySelector<HTMLElement>(element);
        htmlElement?.addEventListener('click', () => this.toggleTheme());
      });
    }
  }

  private getOsPreference(options: Options): string {
    const { autoMatchTheme, useLocalStorage, useSessionStorage } = options;
    const STO =
      (useLocalStorage && window.localStorage.getItem(Darkify.storageKey)) ||
      (useSessionStorage && window.sessionStorage.getItem(Darkify.storageKey)) ||
      (autoMatchTheme && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light');

    return STO;
  }

  private createAttribute() {
    const dataTheme = document.getElementsByTagName('html')[0];
    const { useColorScheme } = this.options;

    const css = `/**! Darkify / A simple dark mode toggle library **/\n:root:where([data-theme="${this.theme}"]),[data-theme="${this.theme}"]{color-scheme:${this.theme}}`;

    dataTheme.dataset.theme = this.theme;

    this.updateTags(css, useColorScheme);
    this.savePreference();
  }

  private updateTags(css: string, useColorScheme: Options['useColorScheme']) {
    const [lightColor, darkColor] = useColorScheme;

    this._meta.name = 'theme-color';
    this._meta.content = this.theme === 'light' ? lightColor : (darkColor ?? lightColor);
    this._style.innerHTML = css;

    const head = document.getElementsByTagName('head')[0];

    // avoid tags duplication
    if (!this._meta.parentNode) head.appendChild(this._meta);
    if (!this._style.parentNode) head.appendChild(this._style);
  }

  private savePreference() {
    const { useLocalStorage } = this.options;
    const STO = useLocalStorage ? window.localStorage : window.sessionStorage;
    const OTS = useLocalStorage ? window.sessionStorage : window.localStorage;

    OTS.removeItem(Darkify.storageKey);
    STO.setItem(Darkify.storageKey, this.theme);
  }

  private syncThemeBetweenTabs() {
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
