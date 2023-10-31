# Darkify js
Create an easy dark mode for your site
## 📦 Installation
```bash
npm install darkify-js
```
## ⚙️ Setup
```js
import Darkify from 'darkify-js'

const options = {
  autoMatchTheme: true,
}

// autoMatchTheme: default is true
// useLocalStorage: default is true
// useSessionStorage: default is false

var darkMode = new Darkify('#element', options)
```
### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/darkify-js"></script>
```

## Compatibility
[Check browser compatibility](https://caniuse.com/mdn-css_properties_color-scheme)
