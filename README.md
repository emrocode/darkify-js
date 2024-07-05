# Darkify JS
A simple dark mode toggle library

### 📦 Installation
Use npm or any other package manager:

```bash
npm install darkify-js
```

### ⚙️ Setup

```js
// main.js
import Darkify from "darkify-js";

const options = {
  autoMatchTheme: true,
};

// autoMatchTheme: default is true
// useLocalStorage: default is true
// useSessionStorage: default is false
// useColorScheme: default is ["#ffffff", "#000000"]

new Darkify("#element", options);
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/darkify-js"></script>
```
