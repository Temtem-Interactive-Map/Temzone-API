# Temzone - API

[![Version](https://img.shields.io/github/package-json/v/Temtem-Interactive-Map/Temzone-API)](https://github.com/Temtem-Interactive-Map/Temzone-API)
[![Build](https://img.shields.io/github/actions/workflow/status/Temtem-Interactive-Map/Temzone-API/main.yml?branch=main)](https://github.com/Temtem-Interactive-Map/Temzone-API/actions/workflows/main.yml)
[![Quality](https://img.shields.io/codefactor/grade/github/Temtem-Interactive-Map/Temzone-API)](https://www.codefactor.io/repository/github/temtem-interactive-map/temzone-api)

Welcome to Temzone API, a RESTful API built with Cloudflare Workers from Temtem Interactive Map.

## Getting started

This guide will help you get up and running the application in just a few minutes.

### Prerequisites

Before getting started, make sure you have the following tools installed on your development machine:

- Node.js (version [18.13.0](https://nodejs.org/es/download))
- npm (the Node.js package manager, which should be installed with Node.js)
- Docker Desktop (version [4.16.3](https://docs.docker.com/get-docker))
- Docker Compose (by installing Docker Desktop, the Docker Compose should be installed on Windows or Mac. However, if you're on a Linux machine, you'll need to install [Docker Compose](https://docs.docker.com/compose/install))

### Install the dependencies

To install the dependencies for a Cloudflare Workers project, you'll need to use the npm install command. This command reads the _dependencies_ and _devDependencies_ sections of the [package.json](https://github.com/Temtem-Interactive-Map/Temzone-API/blob/main/package.json) file and installs the packages listed there.

For example, to install all of the dependencies you can run the following command in the project directory:

```
npm install
```

You can also use npm install to install a specific package by providing the package name as an argument. For example:

```
npm install hono
```

This will install the hono package and add it to the dependencies section of the [package.json](https://github.com/Temtem-Interactive-Map/Temzone-API/blob/main/package.json) file.

### Scrape the Official Temtem Wiki

To scrape data from the [Official Temtem Wiki](https://temtem.wiki.gg/wiki/Temtem_Wiki), you can run the following command in the project directory:

```
npm run scraper
```

This command will start the data scraping process and store the scraped data in a local JSON file. You can modify the scraping logic by editing the files in the [scraper](https://github.com/Temtem-Interactive-Map/Temzone-API/tree/main/scraper) folder.

The npm run scraper command accepts additional parameters that you can use to customize the data scraping process. For example, you can use the _assets_ parameter to generate and save the scraped assets to the [assets](https://github.com/Temtem-Interactive-Map/Temzone-API/tree/main/assets) folder.

```
npm run scraper -- --assets
```

Additionally, if you only want to run a single scraper instead of all of them, you can specify the name of the scraper as a parameter. The available scrapers are:

- `npm run scraper -- types`: This command will scrape the types data.
- `npm run scraper -- traits`: This command will scrape the traits data.
- `npm run scraper -- temtem`: This command will scrape the temtem data.
- `npm run scraper -- spawns`: This command will scrape the spawns data.
- `npm run scraper -- saipark`: This command will scrape the saipark data.

For example, to scrape only the types data with the assets and save them, you can run the following command:

```
npm run scraper -- types --assets
```

This will run only the [types](https://github.com/Temtem-Interactive-Map/Temzone-API/blob/main/scraper/types.js) scraper and store the scraped data in the [types](https://github.com/Temtem-Interactive-Map/Temzone-API/blob/main/database/types.json) JSON file and the assets in the [types](https://github.com/Temtem-Interactive-Map/Temzone-API/tree/main/assets/static/types) folder.

### Setting up the database

To run the application locally, you'll first need to ensure you have a running instance of MySQL. One way to do this is through Docker Compose. To do so, run the following command at the root of the project directory:

```
docker-compose up -d
```

This command will start a MySQL instance in a Docker container in detached mode. Once the container is up and running, you'll need to generate a .env file at the root of the project directory and ensure that the following line is present and correct:

```
MYSQL_DATABASE_URL=mysql://temzone:temzone@localhost:3306/temzone
```

This URL uses the username and password _temzone_ and points to the temzone database. Make sure that these values are correct and that the database is running on port 3306 of localhost.

#### Creating the database tables

To create the necessary tables in the database, you can run the following command:

```
npm run database:update
```

This command will create the tables in the temzone database, based on the database schema defined in the [schema.prima](https://github.com/Temtem-Interactive-Map/Temzone-API/tree/main/prisma/schema.prisma) file. Note that any changes made to the database schema will require running this command again to keep the tables up-to-date.

#### Populating the database

To populate the database with the data scraped from the Official Temtem Wiki, you can run the following command:

```
npm run database:insert
```

Note that this command should only be run after creating the necessary tables in the database using npm run database:update. Also, if you run the command again, any markers that have already been added to the database will be ignored and not added again.

#### Migrating the database

Migrations in the database are managed through [PlanetScale](https://planetscale.com), which offers online schema changes that are automatically deployed upon merging a deploy request. This approach prevents blocking schema changes that may result in downtime. It differs from the traditional Prisma workflow, where the execution of the prisma migrate command generates SQL migrations based on changes to the Prisma schema. With PlanetScale and Prisma, the responsibility for applying changes lies with PlanetScale.

### Setting up the application

### Running the development server

Navigate to the project directory and run the following command to start the development server:

```
npm run dev
```

This will start the Cloudflare Workers development server. As you make changes to the code, the development server will automatically reload the Cloudflare Workers to reflect the changes.

### Running the tests

To run the tests for the application, you can use the following command:

```
npm run test
```

The tests are written using the Vitest testing framework, which is included as a devDependency in the project's [package.json](https://github.com/Temtem-Interactive-Map/Temzone-API/blob/main/package.json) file. By default, Vitest will look for files with a _.test.js_ extension in the project directory.

## License

This project is licensed under the terms of the [MIT license](https://github.com/Temtem-Interactive-Map/Temzone-API/blob/main/LICENSE).
