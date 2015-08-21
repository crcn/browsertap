The main home page for browsertap.com. This application is entirely isomorphic. Each page is served as HTML to the user initially from the backend. After that, the `home.bundle.js` gets loaded in and hydrates the DOM with dynamic parts. Super cool when we want to integrate API specific stuff or other JS things on the front-end.

### File Structure

```
components/ - all HTML components 
  body/ - main component
    pages/ - add new pages here
      home/ - home page
      contact/ contact page
templates/ - HTML templates for the app to load into
routes/ - application states. Modify this if you want to add pages.
```

### Testing

Note that *all* tasks for *all* apps happen in the [root](/crcn/browsertap) directory. Run these commands to get started with front-end dev for the home page:

```
npm start # start the static server
gulp bundle watch # bundle the JS, CSS, and home page
```
