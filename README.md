# Angular Breakout Game PWA

A breakout game in Angular framework as a progressive web application.

# Prerequisite

The application is developed using `Angular 11` so `Node.js 10.13.x/12.11.x or later minor` needs to be installed. 

# Install thirdparty dependencies

To install the necessary dependencies run `npm install`.

## Starting the development server

Run `npm run start` for a dev server and navigate to `http://localhost:4200/`. 

## Starting the PWA

The Service Worker is not used when the development server is running. To check out the PWA features run `npm run start:prod`. This command builds the application in production mode and starts a http server with the build output. To check the app navigate to `http://localhost:8080/`.