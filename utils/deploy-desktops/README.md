### Features

1. ability to start AMI
2. ability to launch RDP client locally & start server of choice


### Steps

1. find all master images w/ type = desktop
2. create AMI
3. migrate AMI's to other selected regions
4. set new creation timestap for AMI's



Provisioner will poll the current AMI's and use the creation timestamp as an ID. 
If a new one shows up, the provisioner will start a new instance, & ignore the old AMI.
