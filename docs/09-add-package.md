# Adding a new turborepo package

## How to Create Package

Create a package under packages folder with package.json

## How to Use the package

To be able to use a created another package, add the package name as following to the package.json

```json
{
  "package-name": "*"
}
```

## How to Use the package that needs to be transpiled in next.js

We should add `next-transpile-modules` as dependency to the `next-app`. We use version 8 as it's the one for next.js@11

```shell
$ yarn add -D next-transpile-modules@8.0.0
```
Add the package name to the `apps/next-app/next.config.js` like this:

```js
// next.config.js

// Import and add @toptal/picasso for transpilation
const withTM = require('next-transpile-modules')([package-name])

// ...

module.exports = () => {
  // Add to the list of next.js plugins
  const plugins = [withTM]

  return plugins.reduce((config, next) => next(config), nextConfig)
}
```
