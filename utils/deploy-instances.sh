#!/usr/bin/env node

require("./deploy-instances");

// 1. start master servers 
// 2. signal to update browsers (node-shepard)
// 3. create AMI out of master servers
// 4. set new image AMI to primary
// 5. deploy AMI across different regions
