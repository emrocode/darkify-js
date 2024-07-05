import { isBrowser } from './isBrowser';
import type { Options } from '../types';

export default class Darkify {
  private static readonly storageKey = 'darkify-theme';
  private options = {} as Options;
  private theme!: { value: string };
  private cssTag!: HTMLStyleElement;
  private metaTag!: HTMLMetaElement;

  /**
   * @param {string} element Button ID ( recommended ) or HTML element
   * @param {object} options Options
   * @see {@link https://github.com/emrocode/darkify-js/wiki|Documentation}
   */
  constructor(element: string, options: Options) {
    if (!isBrowser) {
      return;
    }

    // avoid using both values
    options?.useLocalStorage && (options.useSessionStorage = false);
    options?.useSessionStorage && (options.useLocalStorage = false);

    // set default options
    const defaultOptions: Options = {
      autoMatchTheme: true,
      useLocalStorage: true,
      useSessionStorage: false,
      useColorScheme: ['#ffffff', '#000000'],
    };

    // merge defaults with user options
    options = { ...defaultOptions, ...options };
    this.options = options;

    document.addEventListener('DOMContentLoaded', () => {
      this.createAttribute();
      const htmlElement = document.querySelector<HTMLElement>(element);
      htmlElement?.addEventListener('click', () => this.onClick());
    });

    // sync with system changes
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', ({ matches: isDark }) => {
        this.theme.value = isDark ? 'dark' : 'light';
        this.savePreference();
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

  createAttribute() {
    const dataTheme = document.getElementsByTagName('html')[0];
    const { useColorScheme } = this.options;
    let css = `/**! Darkify / A simple dark mode toggle library **/:root:is([data-theme="${this.theme.value}"]), [data-theme="${this.theme.value}"] {color-scheme: ${this.theme.value}}`;

    dataTheme.setAttribute('data-theme', this.theme.value);

    this.updateTags(css, useColorScheme || []);
    this.savePreference();
  }

  updateTags(css: string, useColorScheme: string[]) {
    const head = document.head || document.getElementsByTagName('head')[0];

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

    OTS.removeItem(Darkify.storageKey);
    STO.setItem(Darkify.storageKey, this.theme.value);
  }

  onClick() {
    this.theme.value = this.theme.value === 'light' ? 'dark' : 'light';
    this.createAttribute();
  }
}
