# UBI-PATIENT

[Master's Dissertation in Computer Science & Engineering.](https://github.com/lucascudo/ubi-patient/blob/main/MEI_dissertacao_signed.pdf)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.12.

## Setup
Copy `src/environments/environment.ts.sample` to `src/environments/environment.ts`. Insert your AES key and Firebase connection info to this new file.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build --optimization;` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Build Docker container

`docker build -t angular-docker .`

## Running Docker container

`docker run -it -p 4201:4200 angular-docker`

## Deploy to Firebase

`firebase deploy`

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
