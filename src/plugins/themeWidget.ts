import type { DarkifyPlugin } from '@/types';

export interface ThemeWidgetOptions {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: 'small' | 'medium' | 'large';
  shortcut?: string;
}

export class ThemeWidget implements DarkifyPlugin {
  public el?: ShadowRoot;
  private _host: any;
  public static readonly pluginId = 'd-widget';
  private options: Required<ThemeWidgetOptions>;

  /**
   * Creates a theme toggle widget button
   * @param host - The darkify instance that controls theme state
   * @param options - Widget configuration (position, size, shortcut)
   */
  constructor(host: any, options?: ThemeWidgetOptions) {
    this._host = host;
    this.options = {
      position: options?.position ?? 'bottom-right',
      size: options?.size ?? 'medium',
      shortcut: options?.shortcut ?? '',
    };
  }

  render(): ShadowRoot {
    const container = document.createElement('div');
    container.id = ThemeWidget.pluginId;
    this.el = container.attachShadow({ mode: 'open' });

    const positionVars = this.getPositionVars();
    const sizeVars = this.getSizeVar();

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
      :host {
        --widget-safe-top: env(safe-area-inset-top, 0px);
        --widget-safe-right: env(safe-area-inset-right, 0px);
        --widget-safe-bottom: env(safe-area-inset-bottom, 0px);
        --widget-safe-left: env(safe-area-inset-left, 0px);
        --widget-margin: 24px;
      }

      .d-wrapper {
        --margin: max(var(--widget-margin), var(--widget-safe-bottom));
        ${positionVars}
        ${sizeVars}
        position: fixed;
        top: calc(var(--pos-top) + var(--widget-safe-top));
        right: calc(var(--pos-right) + var(--widget-safe-right));
        bottom: calc(var(--pos-bottom) + var(--widget-safe-bottom));
        left: calc(var(--pos-left) + var(--widget-safe-left));
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
        border-radius: 50%;
        border: none;
        border-bottom: 2px solid var(--widget-accent, hsl(0,0%,0%,0.30));
        box-shadow: 0 1px 3px 0 hsla(210,6%,25%,0.30), 0 4px 8px 3px hsla(210,6%,25%,0.30);
        background-color: transparent;
        color: canvastext;
        cursor: pointer;
        font-size: var(--icon-size);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        transition: transform 0.4s ease-in-out;
        user-select: none;
        -webkit-user-select: none;
        -webkit-tap-highlight-color: transparent;
      }

      .d-button::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        border: none;
        border-radius: 50%;
        background-color: canvas;
        filter: invert(90%);
      }

      .d-button.light { --widget-accent: hsl(45,99%,54%); }
      .d-button.dark { --widget-accent: hsl(200,29%,43%); }

      @media (prefers-reduced-motion: no-preference) {
        .d-button {
          animation: dEnter 0.4s cubic-bezier(0.34,1.56,0.64,1);
          animation-fill-mode: backwards;
        }
      }

      @keyframes dEnter {
        from {
          opacity: 0;
          transform: scale(0.6);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
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
        box-shadow: 0 0 2px hsla(0,0%,0%,0.10);
        user-select: none;
        -webkit-user-select: none;
      }
    `);

    this.el.adoptedStyleSheets = [sheet];

    const wrapper = document.createElement('div');
    wrapper.className = 'd-wrapper';

    const button = document.createElement('button');
    button.className = 'd-button';
    button.setAttribute('aria-label', 'Toggle theme');
    button.addEventListener('click', () => this._host.toggleTheme());

    const icon = document.createElement('span');
    icon.className = 'd-icon';
    button.appendChild(icon);

    const isLeftPosition = this.options.position?.includes('left');

    if (this.options.shortcut) {
      const kbd = document.createElement('kbd');
      kbd.className = 'd-kbd';
      kbd.textContent = this.options.shortcut;
      // left-side widget: kbd on right (after button)
      // right-side widget: kbd on left (before button)
      if (isLeftPosition) {
        wrapper.appendChild(button);
        wrapper.appendChild(kbd);
      } else {
        wrapper.appendChild(kbd);
        wrapper.appendChild(button);
      }
    } else {
      wrapper.appendChild(button);
    }

    this.el.appendChild(wrapper);
    document.body.appendChild(container);

    this.onThemeChange(this._host.getCurrentTheme());
    return this.el;
  }

  onThemeChange(theme: string): void {
    const button = this.el?.querySelector<HTMLButtonElement>('button.d-button');
    const icon = this.el?.querySelector<HTMLSpanElement>('span.d-icon');
    if (button && icon) {
      button.className = `d-button ${theme}`;
      // TODO: add icon customization option
      // accept custom labels/icons for light/dark themes via ThemeWidgetOptions
      icon.textContent = theme === 'light' ? '🌞' : '🌚';
    }
  }

  onDestroy(): void {
    if (this.el && this.el.host) {
      this.el.host.remove();
    }
  }

  private getPositionVars(): string {
    const vars: Record<string, string> = {
      'top-left':
        '--pos-top:var(--margin);--pos-right:auto;--pos-bottom:auto;--pos-left:var(--margin);',
      'top-right':
        '--pos-top:var(--margin);--pos-right:var(--margin);--pos-bottom:auto;--pos-left:auto;',
      'bottom-left':
        '--pos-top:auto;--pos-right:auto;--pos-bottom:calc(var(--margin)*2);--pos-left:var(--margin);',
      'bottom-right':
        '--pos-top:auto;--pos-right:var(--margin);--pos-bottom:calc(var(--margin)*2);--pos-left:auto;',
    };
    return vars[this.options.position];
  }

  private getSizeVar(): string {
    const vars: Record<string, string> = {
      small: '--size:36px;',
      medium: '--size:56px;',
      large: '--size:72px;',
    };
    return vars[this.options.size];
  }
}
