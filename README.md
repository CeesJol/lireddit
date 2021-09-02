<h1>
  <br />
  <a href="https://lireddit.ceesjol.nl/"><img src="https://raw.githubusercontent.com/CeesJol/lireddit/main/web/public/lireddit_logo.png" alt="LiReddit" width="200"></a>
  <br />
  LiReddit
  <br />
</h1>

<h4>A Reddit clone project, extended from Ben Awad's tutorial</h4>

![Vercel](https://vercelbadge.vercel.app/api/CeesJol/lireddit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<a href="#source">Source</a> •
<a href="#new-features">New features</a> •
<a href="#installing">Installing</a>

![screenshot](https://raw.githubusercontent.com/CeesJol/lireddit/main/web/public/preview.png)

## Source

Extended from [Ben Awad's Fullstack Tutorial](https://www.youtube.com/watch?v=I6ypD7qv3Z8).

## New Features

These are features implemented beyond the tutorial.

- Subreddits
- Comments
- Sorting on top or new
- User image upload

## Installing

This project is hosted as a monorepo, storing both the frontend and the backend in one repository. Some setup is needed for both parts of the project.

### Backend

To install packages:

```
yarn
```

##### PostgreSQL

Install [PostgreSQL](https://postgresapp.com/downloads.html)

Create a database

```
createdb lireddit_cees
```

##### Redis

Install [Redis](https://gist.github.com/tomysmile/1b8a321e7c58499ef9f9441b2faa0aa8)

##### Environment variables

Copy and paste .env.example to .env and insert the following values:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/lireddit_cees
REDIS_URL=127.0.0.1:6379
PORT=4000
SESSION_SECRET=[insert a long random string here]
CORS_ORIGIN=http://localhost:3000
```

##### Running the backend

Run tsc

```
yarn watch
```

In another window, run the server (view on [localhost:4000/graphql](localhost:4000/graphql))

```
yarn dev
```

##### Troubleshooting the backend

1. A simple but effective trick is: stop `yarn watch`, remove the `dist` folder, then run `yarn watch` again.
2. Check if the migrations ran properly.
3. After running migrations, you may need to remove the migration files in `server/migrations`.

### Frontend

To install packages:

```
yarn
```

##### Environment variables

Copy and paste .env.local.example to .env.local and insert the following values:

```
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
```

##### Running the frontend

To run the server (view on [localhost:3000](localhost:3000))

```
yarn dev
```
