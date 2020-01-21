# Coder CMS


## Development Setup

1. Start client and server builds
    - yarn watch-client
    - yarn watch-server

2. Start Debugger
    - f5 or Debugger > "Play" Lunch Whole App

3. Set breakpoints in both client and server code

4. Reload Client or server debugger to register new breakpoints

Node is restarted automatically for the server which use nodemon
Browser must be refreshed to load new code (the only real pain with the setup)
    - To get live reloading i can use webpack-dev-server when I do client side development
    - To get hot reloading I is simplest to use create-react-app
        - Maybe I can do some smart things with redux to get something close to hot reloading?  


