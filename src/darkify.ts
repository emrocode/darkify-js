import { isBrowser } from '@/isBrowser';
import { defaultOptions } from '@/defaultOptions';
import type { DarkifyPlugin, Options } from '@/types';

export class Darkify {
  private static readonly storageKey: string = 'theme';
  readonly options: Options = defaultOptions;
  private plugins: DarkifyPlugin[] = [];
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

    this.options = opts;
    this.theme = this.getOsPreference();
    this._style = document.createElement('style');
    this._meta = document.createElement('meta');

    this.init(element);
    this.createAttribute();
    this.syncThemeBetweenTabs();
    this.initPlugins();
  }

  private initPlugins(): void {
    this.options.usePlugins?.forEach(p => {
      const [Plugin, options] = Array.isArray(p) ? p : [p, undefined];
      const plugin = new Plugin(this, options);
      this.plugins.push(plugin);
      plugin.render();
    });
  }

  private notifyPlugins(theme: string) {
    this.plugins.forEach(plugin => {
      plugin.onThemeChange?.(theme);
    });
  }

  private init(element?: string): void {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', ({ matches: isDark }) => {
        this.theme = isDark ? 'dark' : 'light';
        this.createAttribute();
      });

    const hasWidget = this.options.usePlugins?.length;

    if (element && !hasWidget) {
      document.addEventListener('DOMContentLoaded', () => {
        const htmlElement = document.querySelector<HTMLElement>(element);
        htmlElement?.addEventListener('click', () => this.toggleTheme());
      });
    }
  }

  private getStorage(): Storage | undefined {
    const { useStorage } = this.options;
    if (useStorage === 'none') return;
    return useStorage === 'local' ? window.localStorage : window.sessionStorage;
  }

  private getOsPreference(): string {
    const storage = this.getStorage();

    if (storage) {
      const stored = storage.getItem(Darkify.storageKey);
      if (stored) return stored;
    }

    if (this.options.autoMatchTheme) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    return 'light';
  }

  private createAttribute(): void {
    const dataTheme = document.documentElement;
    const { useColorScheme } = this.options;

    const css = `/**! Darkify / A simple dark mode toggle library **/\n:root:where([data-theme="${this.theme}"]),[data-theme="${this.theme}"]{color-scheme:${this.theme}}`;

    dataTheme.dataset.theme = this.theme;

    this.updateTags(css, useColorScheme);
    this.savePreference();
  }

  private updateTags(css: string, useColorScheme: Options['useColorScheme']) {
    const [lightColor, darkColor] = useColorScheme;

    this._meta.name = 'theme-color';
    this._meta.media = `(prefers-color-scheme: ${this.theme})`;
    this._meta.content = this.theme === 'light' ? lightColor : (darkColor ?? lightColor);
    this._style.innerHTML = css;

    const head = document.head;

    // avoid tags duplication
    if (!this._meta.parentNode) head.appendChild(this._meta);
    if (!this._style.parentNode) head.appendChild(this._style);
  }

  private savePreference(): void {
    const { useStorage } = this.options;
    const storage = useStorage === 'local';

    const STO = storage ? window.localStorage : window.sessionStorage;
    const OTS = storage ? window.sessionStorage : window.localStorage;

    OTS.removeItem(Darkify.storageKey);
    STO.setItem(Darkify.storageKey, this.theme);
  }

  private syncThemeBetweenTabs(): void {
    window.addEventListener('storage', e => {
      if (e.key === Darkify.storageKey && e.newValue) {
        this.theme = e.newValue;
        this.createAttribute();
      }
    });
  }

  private setTheme(newTheme: 'light' | 'dark'): void {
    this.theme = newTheme;
    this.createAttribute();
    this.notifyPlugins(newTheme);
  }

  /**
   * Toggles the theme between light and dark modes
   * @returns {void}
   */
  toggleTheme(): void {
    this.setTheme(this.theme === 'light' ? 'dark' : 'light');
  }

  /**
   * Retrieves the current active theme
   * @returns {string}
   */
  getCurrentTheme(): string {
    return this.theme;
  }
}
