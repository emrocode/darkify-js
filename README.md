# Darkify JS

🌚 A simple dark mode toggle library that makes it easy to implement dark mode on your website without additional configuration

> Please make sure to read the [Wiki] for detailed documentation and examples

### 📦 Installation

Use npm or any other package manager:

```bash
npm install darkify-js
```

### ⚙️ Setup

```js
// main.js
import Darkify from 'darkify-js';

const options = {
  autoMatchTheme: true,
};

// autoMatchTheme: default is true
// useLocalStorage: default is true
// useSessionStorage: default is false
// useColorScheme: default is ['#ffffff', '#000000']

new Darkify('#element', options);
```

[Wiki]: https://github.com/emrocode/darkify-js/wiki
