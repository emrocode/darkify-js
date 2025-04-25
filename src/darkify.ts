import { isBrowser } from './isBrowser';
import { defaultOptions } from './defaultOptions';
import { type Options } from '../types';

export class Darkify {
  private static readonly storageKey = 'theme';
  readonly options: Options = {};
  #theme!: { value: string };
  #cssTag!: HTMLStyleElement;
  #metaTag!: HTMLMetaElement;

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

    this.#init(element);
    this.#theme = { value: this.#getOsPreference(options) };
    this.#cssTag = document.createElement('style');
    this.#metaTag = document.createElement('meta');
    this.#createAttribute();
    this.#syncThemeBetweenTabs();
  }

  #init(element: string) {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', ({ matches: isDark }) => {
        this.#theme.value = isDark ? 'dark' : 'light';
        this.#savePreference();
      });

    document.addEventListener('DOMContentLoaded', () => {
      this.#createAttribute();
      const htmlElement = document.querySelector<HTMLElement>(element);
      htmlElement?.addEventListener('click', () => this.toggleTheme());
    });
  }

  // get os color preference
  #getOsPreference(options: Options): string | 'light' {
    const { autoMatchTheme, useLocalStorage, useSessionStorage } = options;
    const STO =
      (useLocalStorage && window.localStorage.getItem(Darkify.storageKey)) ||
      (useSessionStorage && window.sessionStorage.getItem(Darkify.storageKey));

    return (
      STO ||
      (autoMatchTheme && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light')
    );
  }

  #createAttribute() {
    const dataTheme = document.getElementsByTagName('html')[0];
    const { useColorScheme } = this.options;
    let css = `/**! Darkify / A simple dark mode toggle library **/\n:root:is([data-theme="${this.#theme.value}"]),[data-theme="${this.#theme.value}"]{color-scheme:${this.#theme.value}}`;

    dataTheme.setAttribute('data-theme', this.#theme.value);

    this.#updateTags(css, useColorScheme || []);
    this.#savePreference();
  }

  #updateTags(css: string, useColorScheme: string[]) {
    const head = document.head || document.getElementsByTagName('head')[0];

    // update theme-color meta tag
    this.#metaTag.setAttribute('name', 'theme-color');
    this.#metaTag.setAttribute(
      'content',
      this.#theme.value === 'light' ? useColorScheme[0] : useColorScheme[1]
    );

    // update style tag
    this.#cssTag.setAttribute('type', 'text/css');
    this.#cssTag.innerHTML = css;

    head.appendChild(this.#metaTag);
    head.appendChild(this.#cssTag);
  }

  // save to local or session storage
  #savePreference() {
    const { useLocalStorage } = this.options;
    const STO = useLocalStorage ? window.localStorage : window.sessionStorage;
    const OTS = useLocalStorage ? window.sessionStorage : window.localStorage;

    OTS.removeItem(Darkify.storageKey);
    STO.setItem(Darkify.storageKey, this.#theme.value);
  }

  #syncThemeBetweenTabs() {
    window.addEventListener('storage', e => {
      if (e.key === Darkify.storageKey && e.newValue) {
        this.#theme.value = e.newValue;
        this.#createAttribute();
      }
    });
  }

  /**
   * Toggles the theme between light and dark modes
   * @returns {void}
   */
  toggleTheme(): void {
    this.#theme.value = this.#theme.value === 'light' ? 'dark' : 'light';
    this.#createAttribute();
  }

  /**
   * Retrieves the current active theme
   * @returns {string}
   */
  getCurrentTheme(): string {
    return this.#theme.value;
  }
}
