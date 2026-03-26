export const pluginId = 'd-widget';

export interface ThemeWidgetOptions {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size: 'small' | 'medium' | 'large';
  shortcut?: string;
}

export class ThemeWidgetElement extends HTMLElement {
  private _host!: any;
  private _theme!: string;
  private _initialized = false;
  private _wrapper!: HTMLElement;
  private _button!: HTMLButtonElement;
  private _span!: HTMLSpanElement;

  options!: ThemeWidgetOptions;

  private static _styles = `
:host {
  --widget-safe-top: env(safe-area-inset-top, 0px);
  --widget-safe-right: env(safe-area-inset-right, 0px);
  --widget-safe-bottom: env(safe-area-inset-bottom, 0px);
  --widget-safe-left: env(safe-area-inset-left, 0px);
  --margin: 24px;
  --top: var(--margin);
  --right: var(--margin);
  --bottom: auto;
  --left: auto;
}
:host([position='top-left']) {
  --top: var(--margin);
  --right: auto;
  --bottom: auto;
  --left: var(--margin);
}
:host([position='top-right']) {
  --top: var(--margin);
  --right: var(--margin);
  --bottom: auto;
  --left: auto;
}
:host([position='bottom-left']) {
  --top: auto;
  --right: auto;
  --bottom: calc(var(--margin) * 2);
  --left: var(--margin);
}
:host([position='bottom-right']) {
  --top: auto;
  --right: var(--margin);
  --bottom: calc(var(--margin) * 2);
  --left: auto;
}
:host([size='small']) { --size: 36px; }
:host([size='medium']) { --size: 56px; }
:host([size='large']) { --size: 72px; }
.d-wrapper {
  position: fixed;
  top: calc(var(--top) + var(--widget-safe-top));
  right: calc(var(--right) + var(--widget-safe-right));
  bottom: calc(var(--bottom) + var(--widget-safe-bottom));
  left: calc(var(--left) + var(--widget-safe-left));
  z-index: 9999;
  max-width: fit-content;
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
}
.d-button {
  --icon-size: calc(var(--size) * 0.4);
  position: relative;
  width: var(--size);
  height: var(--size);
  border: none;
  border-bottom: 1px solid hsl(from canvastext h s l / calc(alpha * 0.5));
  border-radius: 50%;
  box-shadow: 0 1px 3px 0 hsla(210, 6%, 25%, 0.3), 0 4px 8px 3px hsla(210, 6%, 25%, 0.3);
  background-color: transparent;
  color: canvastext;
  cursor: pointer;
  font-size: var(--icon-size);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}
.d-button::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border: none;
  background-color: canvas;
  filter: invert(90%);
}
.d-button:focus-visible {
  outline: 2px solid currentcolor;
  outline-offset: 2px;
}
.d-button:active {
  transform: scale(0.98);
  transition: transform 0.4s ease-in-out;
}
.d-kbd {
  position: relative;
  padding: 0.25em 0.4em;
  font-size: 11px;
  font-family: ui-monospace, monospace;
  line-height: 1;
  letter-spacing: -0.025em;
  background-color: canvas;
  color: canvastext;
  filter: invert(90%);
  border: none;
  border-bottom: 1px solid hsl(from canvastext h s l / calc(alpha * 0.5));
  border-radius: 0.25rem;
  box-shadow: 0 0 2px hsla(0, 0%, 0%, 0.1);
  user-select: none;
  -webkit-user-select: none;
}
`;

  static get observedAttributes() {
    return ['position', 'size'];
  }

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = ThemeWidgetElement._styles;
    shadow.appendChild(style);
  }

  init(host: any, options: Required<ThemeWidgetOptions>): void {
    this._host = host;
    this._theme = host.getCurrentTheme();
    this.options = options;

    this.setAttribute('position', this.options.position);
    this.setAttribute('size', this.options.size);
    this.render();
  }

  connectedCallback(): void {
    this.render();
  }

  disconnectedCallback(): void {
    this._host._elm.clearListeners();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue !== newValue && (name === 'position' || name === 'size')) {
      this.render();
    }
  }

  onThemeChange(theme: string): void {
    this._theme = theme;
    this.render();
  }

  render(): void {
    // TODO: add icon customization option
    // accept custom labels/icons for light/dark themes via ThemeWidgetOptions
    const icon = this._theme === 'light' ? '🌞' : '🌚';

    if (!this._initialized) {
      this._wrapper = document.createElement('div');
      this._wrapper.className = 'd-wrapper';

      this._button = document.createElement('button');
      this._button.className = 'd-button';
      this._button.setAttribute('aria-label', 'Toggle theme');
      this._host._elm.addListener(this._button, 'click', () => this._host.toggleTheme());

      this._span = document.createElement('span');
      this._span.className = 'd-icon';
      this._button.appendChild(this._span);

      if (this.options.shortcut) {
        const kbd = document.createElement('kbd');
        kbd.className = 'd-kbd';
        kbd.textContent = this.options.shortcut;
        this.options.position.includes('left')
          ? this._wrapper.append(this._button, kbd)
          : this._wrapper.append(kbd, this._button);
      } else {
        this._wrapper.appendChild(this._button);
      }

      this.shadowRoot!.appendChild(this._wrapper);
      this._initialized = true;
      return;
    }

    this._span.textContent = icon;
  }
}

customElements.define(pluginId, ThemeWidgetElement);

declare global {
  interface HTMLElementTagNameMap {
    'd-widget': ThemeWidgetElement;
  }
}
