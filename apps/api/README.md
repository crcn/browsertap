
#### command line usage

various scripts for running the node server

```bash
PORT=8080 npm start
NODE_ENV=development npm start  
LOG_LEVEL=VERBOSE npm start     
```


#### features

- ability to execute remote operations via socket.io


#### TODO

- [ ] - graceful shutdown if stuff crashes
- [ ] - sandbox remote operations
- [ ] - process on exit logs
- [ ] - stdin commands
  - help()