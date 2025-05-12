# Elastic Textarea

[![NPM version](http://img.shields.io/npm/v/@cloudfour/elastic-textarea.svg)](https://www.npmjs.org/package/@cloudfour/elastic-textarea) [![Build Status](https://github.com/cloudfour/elastic-textarea/workflows/CI/badge.svg)](https://github.com/cloudfour/elastic-textarea/actions?query=workflow%3ACI) [![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)


_A web component for progressively-enhanced auto-expanding textareas._

This web component progressively enhances the native textarea: as a user types in the textarea, its height increases so that its content is never clipped. When the user deletes content in the textarea it shrinks back down to a minimum number of rows.

![A gif of an textarea expanding and shrinking as a user types and deletes content.](/elastic-textarea.gif)

(Note: if a user manually resizes a textarea it will no longer be elastic.)

## Installation

### NPM

You can install via npm:

```zsh
npm i @cloudfour/elastic-textarea
```

Then you'll need to import the component code:

```js
import "@cloudfour/elastic-textarea";
```

### CDN

Alternately, you can load the script via CDN:

```html
<script
  type="module"
  src="https://unpkg.com/@cloudfour/elastic-textarea/index.min.js"
></script>
```

## Usage

Once the JavaScript has been loaded, you can use `elastic-textarea` in your HTML.

`elastic-textarea` is meant to wrap one or more `textarea` elements. This ensures that before the JS loads and runs, the textarea is still usable.

```html
<elastic-textarea>
  <label>
    Textarea 1
    <textarea name="textarea-1"></textarea>
  </label>
</elastic-textarea>
```

If multiple `textarea` elements are wrapped in an `elastic-textarea` they will all be initialized. This allows you to easily wrap an entire form or page and enhance all the textareas within:

```html
<elastic-textarea>
  <label>
    Textarea 1
    <textarea name="textarea-1"></textarea>
  </label>
  <label>
    Textarea 2
    <textarea name="textarea-2"></textarea>
  </label>
</elastic-textarea>
```

## CSS-Only Alternative

You may consider using `field-sizing: content` as a CSS-only alternate solution. [MDN says]([url](https://developer.mozilla.org/en-US/docs/Web/CSS/field-sizing)) "`field-sizing: content` overrides the default preferred sizing of form elements. This setting provides an easy way to configure text inputs to shrinkwrap their content and grow as more text is entered." As of May 2025, this is [only supported in Chromium browsers]([url](https://caniuse.com/mdn-css_properties_field-sizing_content)), but it's worth considering as a progressive enhancement if you don't need full cross-browser support.
