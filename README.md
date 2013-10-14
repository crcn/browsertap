## BrowserTap

Browsertap is a remote desktop service which allows anyone to test web applications against an array of browsers. BrowserTap attempts to cover a few pain points:

1. Automated testing - launching browsers using karma, or cortado to run unit tests against.
2. Manual testing - testing for any particular bug that might popup - moreso with IE
3. CSS testing - comparing screenshots to test against
  a. regressions
  b. differences against different browsers

## Parts

BrowserTap comes with a few parts:

- src/client - the application itself - the front-end.
- src/common - common plugins used between all parts of the app
- src/controller - server which controls a desktop
- src/provisioner - provisions new servers automatically
- src/website - the browsertap website

## Challenges

1. Provisioning servers depending on the browsers running on them.
2. NOT using flash.


## Installation

1. install node
2. clone browsertap: `git clone git@github.com:crcn/browsertap.git`
3. install browsertap: `npm install`
4. run it - `browsertap [type]`
  - `browsertap website`
  - `browsertap client`


## Routes

1. POST /signup
2. GET /account - return account info
3. GET /browsers - return available browsers
4. GET /browsers/:_id - get browser and status
5. POST /browsers/:_id - create a new instance of the browser
6. DELETE /browsers/:_id - stop browser instance
