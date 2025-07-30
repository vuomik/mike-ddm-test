# DDM App

Create a small web app that lets users search for books. Use Vue, CSS, and JavaScript, and a server-side orchestration layer in Node.js that proxies and transforms the Goodreads public API.

The front end should provide a search bar where a user can enter text, and a view that shows book results. The backend should contain an endpoint that accepts search and pagination info, connects to the Goodreads search API, transforms the XML into JSON, and keeps RESTful practices in mind.

It's up to you what metadata you'd like to render for each book, and how you want to handle display states for pagination, errors, etc.

# Setup

To run this locally for development:
1. Copy `env.example` to `.env` and enter your Goodreads API keys.
2. Run `docker compose up`
3. Access the site on [http://localhost:3002](http://localhost:3002)

To run the production-worthy container:
1. Copy `env.example.production` to `.env.production` and enter your Goodreads API keys.
2. Run `docker compose up --build`
3. Access the site on [http://localhost:3080](http://localhost:3080)

# Deploy to "production"

1. Copy `env.example.production` to `.env.production` and enter your Goodreads API keys, `fly.io` API token, and GitHub token.
2. Run `./deploy`.  This will build the container, push it to the GitHub container registry, and deploy it to `fly.io`.
3. Access the site on [https://mike-ddm-app.fly.dev/](https://mike-ddm-app.fly.dev/)

# Linting and Testing

To run the test suite:
1. Run `./dev`
2. Inside the container, run `npm run lint` or `npm run test`