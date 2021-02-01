## Description

A CMS versionning management with NodeJS. Goals are:
1. save a version for a new resource (création d'une ressource dans le CMS)
2. Save additional versions for an existing resource when edited via the CMS
3. Get the list of versions for a particular resource
4. Get the version valid at a certain date
5. Rollback to a previous version
6. Being able to detect if a version has been tampered with
and throw a HTTP 5xx

## Installation

```bash
$ npm install
```

## Running the app

```bash

#database
$ docker-compose up

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
