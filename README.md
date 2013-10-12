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
3. 

