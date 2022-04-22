<!--
 Copyright 2022 Neeva Inc. All rights reserved.
 Use of this source code is governed by a BSD-style license that can be
 found in the LICENSE file.
-->

# Cookie Cutter Engine

This is the engine that powers Neeva's Cookie Cutter extension, available on the [Chrome Web Store](https://chrome.google.com/webstore/detail/cookie-cutter-by-neeva/idcnmiefjmnabbchggljinkeiinlolon) and [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/cookie-cutter-by-neeva/).

It's responsible for automatically answering GDPR, CCPA, and related cookie notices on the web according to user preferences.

## Structure

This repository is split up into two parts:

-   `./engine`: The engine, which handles detecting and handling cookie notices.
-   `./testExtension`: A test Chrome extension which can be used to test changes made to the engine during development.

## Contributing

If you'd like to contribute, awesome! Please take a look at the [contributor guidelines](./CONTRIBUTING.md) first.

-   If you'd like to add support for a new provider, check out [Adding a Provider](https://github.com/neevaco/cookie-cutter-engine/wiki/Adding-A-Provider)
-   If you want to make changes to the general engine logic, check out [Engine](https://github.com/neevaco/cookie-cutter-engine/wiki/Engine)
-   If you're not sure what to contribute, take a look at the [Issues](https://github.com/neevaco/cookie-cutter-engine/issues) page for ideas.

## Building

The engine uses a standard NPM package.json. To build the code, first install the project:

```bash
$ yarn install
```

Then you can create a production build with:

```bash
$ yarn build
```

Or make a dev build and watch for changes with:

```bash
$ yarn watch
```

## Testing

To test the engine, you can make use of the test extension in `./testExtension`. It will automatically build and load the engine.

To install the test extension in Chrome, first build it:

```bash
cookie-engine/testExtension $ yarn install
cookie-engine/testExtension $ yarn build # or `yarn watch`
```

Then, in Chrome:

1. Navigate to `chrome://extensions`
2. Enable the Developer Mode toggle in the top right corner
3. Click "Load unpacked"
4. Navigate to the extension build directory `cookie-engine/testExtension/crx`
