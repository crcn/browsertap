## Project Structure

- `application/` - the website, & online application
- `browser_extension/` - the extension for browsers
- `desktop_player` - the SWF that plays remote desktops
- `display_driver` - the display driver that runs on the server
- `http_client` - deprecated for application
- `puppet` - puppet library interfaces WKM & handles application startup / shutdown
- `puppeteer` - runs on each VM - interface to the client
- `website` - depecated - should be in application
- `wkm` - window / keyboard / mouse hook command line


## Application requirements

- [node.js](http://nodejs.org)
- [supervisor](http://supervisord.org)
- [red5](http://red5.org)

## Puppeteer requirements

- [node.js](http://nodejs.org)

