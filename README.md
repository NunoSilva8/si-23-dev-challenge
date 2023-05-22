# si-23-dev-challenge

RedLight Summer Internship 2023 - Dev Challenge

## Installation

Use the package manager [yarn](https://yarnpkg.com/) to install the project's dependencies

### Backend

```bash
cd backend
yarn
```

### Frontend

```bash
cd frontend
yarn
```

## Arquitecture

### Backend

The backend has an API written in [Typescript](https://www.typescriptlang.org/) using the [Express](https://expressjs.com/) framework from [Node.js](https://nodejs.org/). By following the [tsoa](https://tsoa-community.github.io) framework guides, I was able to deliver an API compliant of the OpenAPI Specifications, and the Swagger UI with all the documentation can be accessed at the "/docs" endpoint.

The backend also has a [MongoDB](https://www.mongodb.com/) with two collections "applicants" and "roles" to store all the data.

### Frontend

The frontend is also written in [Typescript](https://www.typescriptlang.org/) and is a [React App](https://react.dev/) that interacts with the backend's API.

## Run the project

### Backend

Must verify that the database has a valid path to a database!

```bash
cd backend
yarn dev
```

### Frontend

```bash
cd frontend
yarn dev
```
