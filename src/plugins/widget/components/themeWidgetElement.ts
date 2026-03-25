import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export const pluginId = 'd-widget';

export interface ThemeWidgetOptions {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: 'small' | 'medium' | 'large';
  shortcut?: string;
}

@customElement(pluginId)
export class ThemeWidgetElement extends LitElement {
  @property({ type: String, reflect: true })
  position: ThemeWidgetOptions['position'] = 'bottom-right';

  @property({ type: String, reflect: true })
  size: ThemeWidgetOptions['size'] = 'medium';

  @property({ type: String, reflect: true })
  shortcut: ThemeWidgetOptions['shortcut'] = '';

  @state()
  private theme: string = 'light';

  private _host?: any;

  static override styles = css`
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

    :host([size='small']) {
      --size: 36px;
    }

    :host([size='medium']) {
      --size: 56px;
    }

    :host([size='large']) {
      --size: 72px;
    }

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
      border-bottom: 2px solid hsl(from canvastext h s l / calc(alpha * 0.5));
      border-radius: 50%;
      box-shadow:
        0 1px 3px 0 hsla(210, 6%, 25%, 0.3),
        0 4px 8px 3px hsla(210, 6%, 25%, 0.3);
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
      border-bottom: 2px solid hsl(from canvastext h s l / calc(alpha * 0.5));
      border-radius: 0.25rem;
      box-shadow: 0 0 2px hsla(0, 0%, 0%, 0.1);
      user-select: none;
      -webkit-user-select: none;
    }
  `;

  init(host: any, options: Required<ThemeWidgetOptions>): void {
    this._host = host;
    this.position = options.position;
    this.size = options.size;
    this.shortcut = options.shortcut;
    this.theme = host.getCurrentTheme();
  }

  onThemeChange(theme: string): void {
    this.theme = theme;
  }

  private _handleToggle(): void {
    this._host?.toggleTheme();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._host._elm.clearListeners();
  }

  override render() {
    const isLeftPosition = this.position?.includes('left');
    // TODO: add icon customization option
    // accept custom labels/icons for light/dark themes via ThemeWidgetOptions
    const iconContent = this.theme === 'light' ? '🌞' : '🌚';

    const button = html`
      <button
        class="d-button"
        aria-label="Toggle theme"
        role="switch"
        aria-checked=${this.theme === 'dark'}
        @click=${this._handleToggle}
        data-theme=${this.theme}>
        <span class="d-icon">${iconContent}</span>
      </button>
    `;

    const kbd = this.shortcut ? html`<kbd class="d-kbd">${this.shortcut}</kbd>` : nothing;

    return html`
      <div class="d-wrapper">${isLeftPosition ? html`${button}${kbd}` : html`${kbd}${button}`}</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'd-widget': ThemeWidgetElement;
  }
}
