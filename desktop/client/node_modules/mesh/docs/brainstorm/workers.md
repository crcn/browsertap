One issue with mesh is how separate processes are merged together. For instance - 
chrome has a foreground & background worker. How do we merge files together for that?

Ideas:

- load beanpoll / dnode as a background worker & have foreground code be explictly defined by whatever browser. 