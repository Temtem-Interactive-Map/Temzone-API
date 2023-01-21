# Temzone - API

[![Version](https://img.shields.io/github/package-json/v/Temtem-Interactive-Map/Temzone-API)](https://github.com/Temtem-Interactive-Map/Temzone-API)
[![Quality](https://img.shields.io/codefactor/grade/github/Temtem-Interactive-Map/Temzone-API)](https://www.codefactor.io/repository/github/temtem-interactive-map/temzone-api)

Welcome to Temzone, a RESTful API built with Cloudflare Workers from Temtem Interactive Map.

## Getting started

This guide will help you get up and running the application in just a few minutes.

### Prerequisites

Before getting started, make sure you have the following tools installed on your development machine:

- Node.js (version [18.12.1](https://nodejs.org/es/download))
- npm (the Node.js package manager, which should be installed with Node.js)

### Install the dependencies

To install the dependencies for a Cloudflare Workers project, you'll need to use the npm install command. This command reads the **dependencies** and **devDependencies** sections of the [package.json](https://github.com/Temtem-Interactive-Map/Temzone-API/blob/main/package.json) file and installs the packages listed there.

For example, to install all of the dependencies you can run the following command in the project directory:

```
npm install
```

You can also use npm install to install a specific package by providing the package name as an argument. For example:

```
npm install hono
```

This will install the hono package and add it to the dependencies section of the [package.json](https://github.com/Temtem-Interactive-Map/Temzone-API/blob/main/package.json) file.

### Running the development server

Navigate to the project directory and run the following command to start the development server:

```
npm run dev
```

This will start the Cloudflare Workers development server.

As you make changes to the code, the development server will automatically reload the Cloudflare Workers to reflect the changes.

## License

This project is licensed under the terms of the [MIT license](https://github.com/Temtem-Interactive-Map/Temzone-API/blob/main/LICENSE).
