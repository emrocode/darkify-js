import { Darkify } from './darkify';
import { jest } from '@jest/globals';

describe('Darkify', () => {
  let darkify: Darkify;

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: (query as string).includes('dark'),
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    });

    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(jest.fn());
  });

  beforeEach(() => {
    // Create the button element
    const button = document.createElement('button');
    button.id = 'element';
    document.body.appendChild(button);

    // Initialize Darkify with the button
    darkify = new Darkify('#element', {});
  });

  test('Initialize with the correct theme', () => {
    // Check initial theme
    expect(darkify.getCurrentTheme()).toBe('dark');
  });

  test('Check if theme saved to localStorage', () => {
    // Verify that localStorage.setItem was called with 'theme' and 'dark'
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  test('Should toggle theme', () => {
    // Toggles the theme between light and dark modes
    darkify.toggleTheme();
    expect(darkify.getCurrentTheme()).toBe('light');
  });
});
