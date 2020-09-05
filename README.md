# video-conference-server

- Install [mongodb](https://treehouse.github.io/installation-guides/mac/mongo-mac.html) - then run `mongod` otherwise if it is not working try `sudo mkdir /System/Volumes/Data/data/db` and run `sudo mongod --dbpath /System/Volumes/Data/data/db`

- Clone video-conference-server `git clone git@github.com:ramirezjag00/video-conference-server.git`

- In another terminal install packages and run server: `npm i && npm run start` - this should run in localhost:3000

- Import `Insomnia_Video_Conference.json` in Insomnia to test

FEATURES:
- Register with username (unique), password, mobile_token (optional, default null but unique)
- Log in using username and password. Optional mobile_token to update existing
- Get all Users
- Get User Object
- Update password and/or mobile_token when logged in
- Delete User when logged in
- Log out User
- Session lasts 48 hours
- Passport JS is used to handle authentication and easier set up

ISSUES: 
- Update password with [user.schema.methods.changepassword](https://github.com/ramirezjag00/video-conference-server/issues)

FOR FUTURE REFERENCE: 
- [simple-peer](https://github.com/feross/simple-peer) - to handle WebRTC
- [socket io](https://github.com/socketio/socket.io) - to enable real-time bidirectional event-based communication