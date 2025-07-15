# Q-Matic Kuyruk Yönetim Sistemi

Kurumların hizmet noktalarındaki yoğunluğu yönetmek için geliştirilmiş açık kaynak kuyruk yönetim uygulaması. Müşteri memnuniyetini artırır, işlem sürelerini kısaltır.

## Kurulum (macOS & Windows)

1. Git ve Node.js (>=18) kurulu olmalı.
   - **macOS**: `brew install node`
   - **Windows**: Node.js LTS sürümünü https://nodejs.org adresinden indirin veya `winget install OpenJS.NodeJS.LTS` komutunu çalıştırın.
2. Depoyu klonlayın: `git clone <repo-url>`
3. Ana dizine geçin ve bağımlılıkları yükleyin: `npm install`
4. Geliştirme sunucusunu başlatın: `npm run dev`  
   Tarayıcıda `http://localhost:5173` adresini açın.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
