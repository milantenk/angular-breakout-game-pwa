# Angular Breakout Game PWA

This is an experimental project using Canvas API, Angular and Service Worker.
It implements a simple breakout game as progressive web application.

# Prerequisite

The application is developed using `Angular 11` so `Node.js 10.13.x/12.11.x or later minor` needs to be installed. 

# Install thirdparty dependencies

To install the necessary dependencies run `npm install`.

## Starting the development server

Run `npm run start` for a dev server and navigate to `http://localhost:4200/`. 

## Starting the PWA

The Service Worker is not used when the development server is running. To check out the PWA features run `npm run start:prod`. This command builds the application in production mode and starts a http server with the build output. To check the app navigate to `http://localhost:8080/`.

# Reference
The project got started using snippets of following pure `JavaScript` based code examples: https://github.com/end3r/Gamedev-Canvas-workshop.