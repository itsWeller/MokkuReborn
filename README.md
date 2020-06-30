# Mokku

> Mock API calls seamlessly

![small-promo](./docs/store/small-promo.png)

[Chrome Web Store](https://chrome.google.com/webstore/detail/mokku-mock-api-calls-seam/llflfcikklhgamfmnjkgpdadpmdplmji?hl=en&authuser=1) | [MS Edge Add on](https://microsoftedge.microsoft.com/addons/detail/mokku-mock-api-calls-sea/ekcbmjnnnphonejedibidifflhljbobc)

### About

Mokku helps user by mocking API and changing their response, response time and status, user can try all test case scenario like long loading time, error states, or any missing or incorrect data.

Mokku adds itself as a tab in dev tools as a panel. In the tab user can see network logs and mocks. Any network call from the logs can be mocked by simply clicking mock button then response can be edited. User can also search logs. Mock can also be created from scratch from create mock button.

All URL's are accessible but Mokku doesn't inject scripts into any pages apart from which are served locally and accessed using 'http://localhost*' until enabled from the Panel.

Collections & Dynamic mock generators coming soon!

You can submit issues, bugs or feature request at https://github.com/mukuljainx/mokku/issues

[Promotional Images](https://github.com/mukuljainx/Mokku/tree/master/docs/store)

### Privacy policy

Mokku does not collect or ask for any personal information, though it will store the mocks the chrome local store & all the hosts name where it has been enabled once to provide better experience to user.

## Dev Guide

### Prerequisites

- [node + npm](https://nodejs.org/) (Current Version)

### Project Structure

- dist: Chrome Extension directory
- dist/js: Generated JavaScript files

### Setup

`npm install`

### Dev

`npm run watch`

### Build

`npm run build`

### Load extension to chrome

Load `dist` directory. All the files are refreshed without extension reload except content script. Reload the extension to see the changes.

### Built on

[Chitbat Chrome extension starter kit](https://github.com/chibat/chrome-extension-typescript-starter)
