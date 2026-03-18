import type { DarkifyPlugin } from '@/types';

export interface ThemeWidgetOptions {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: 'small' | 'medium' | 'large';
}

export class ThemeWidget implements DarkifyPlugin {
  private shadow!: ShadowRoot;
  private host: any;
  private options: Required<ThemeWidgetOptions>;

  constructor(host: any, options?: ThemeWidgetOptions) {
    this.host = host;
    this.options = {
      position: options?.position ?? 'bottom-right',
      size: options?.size ?? 'medium',
    };
  }

  render(): ShadowRoot {
    const container = document.createElement('div');
    container.id = 'd-widget';
    this.shadow = container.attachShadow({ mode: 'open' });

    const pos = this.getPositionVars();
    const sz = this.getSizeVar();

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
      :host {
        --widget-safe-top: env(safe-area-inset-top, 0px);
        --widget-safe-right: env(safe-area-inset-right, 0px);
        --widget-safe-bottom: env(safe-area-inset-bottom, 0px);
        --widget-safe-left: env(safe-area-inset-left, 0px);
        --widget-margin: 24px;
      }

      .d-button {
        --icon-size: calc(var(--size) * 0.4);
        --margin: max(var(--widget-margin), var(--widget-safe-bottom));
        ${pos}
        ${sz}

        position: fixed;
        top: calc(var(--pos-top) + var(--widget-safe-top));
        right: calc(var(--pos-right) + var(--widget-safe-right));
        bottom: calc(var(--pos-bottom) + var(--widget-safe-bottom));
        left: calc(var(--pos-left) + var(--widget-safe-left));
        z-index: 9999;
        width: var(--size);
        height: var(--size);
        border-radius: 50%;
        border: none;
        border-bottom: 3px solid var(--widget-accent, hsla(0, 0%, 20%, .3));
        cursor: pointer;
        font-size: var(--icon-size);
        background-color: var(--widget-bg, hsl(0, 0%, 96%));
        color: var(--widget-color, hsl(0, 0%, 20%));
        box-shadow: 0 1px 3px 0 hsla(206, 6%, 25%, .3), 0 4px 8px 3px hsla(206, 6%, 25%, .15);
        transition: transform 0.3s ease-in-out;
        user-select: none;
        -webkit-user-select: none;
        -webkit-tap-highlight-color: transparent;
      }

      .d-button.light {
        --widget-bg: hsl(0, 0%, 20%);
        --widget-accent: hsl(45, 99%, 54%);
      }

      .d-button.dark {
        --widget-accent: hsl(200, 29%, 43%);
      }

      @media (prefers-reduced-motion: no-preference) {
        .d-button {
          animation: d-enter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          animation-fill-mode: backwards;
        }
      }

      @keyframes d-enter {
        from {
          opacity: 0;
          transform: scale(0.6);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    `);

    this.shadow.adoptedStyleSheets = [sheet];

    const button = document.createElement('button');
    button.className = 'd-button';
    button.setAttribute('aria-label', 'Toggle theme');
    button.textContent = '🌓';
    button.addEventListener('click', () => this.host.toggleTheme());

    this.shadow.appendChild(button);
    document.body.appendChild(container);

    this.onThemeChange(this.host.getCurrentTheme());
    return this.shadow;
  }

  onThemeChange(theme: string): void {
    const button = this.shadow.querySelector<HTMLButtonElement>('button.d-button');
    if (button) {
      button.className = `d-button ${theme}`;
      button.textContent = theme === 'light' ? '🌞' : '🌚';
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
