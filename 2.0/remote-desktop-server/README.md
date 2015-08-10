Remote desktop server which allows people to see & control a remote desktop. 

#### Features

- uses webrtc to broadcast video & audio
- MUST sandbox application settings so they don't pollute the OS. Possibly use docker for this.
- user can control the machine with their keyboard & mouse
- all screens are broadcasted back to the user. User also has option to see full screen.

#### Future features

- run in `windows session 0` to allow multiple user sessions
- 