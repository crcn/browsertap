Main home page directory. This contains *all* assets including *all* binaries, images, JS files, etc. 
Also note that the structure of this directory should be kept simple, and clean. This means that ALL pages, assets, and other things should be *statically* generated & stored in an S3 bucket.

#### TODO

- [ ] - create source directory of html files & templates
- [ ] - create build task for statically generating home page & main entry points
- [ ] - create directory of downtime directories
- [ ] - pages should load components specific to said page. Make all pages isomorphic.
- [ ] - all stuff server-specific should come from the API