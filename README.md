# Phonebook Backend

Simple Express + MongoDB backend for the phonebook application used in Full Stack Open.

## Prerequisites

- Node.js 20+
- MongoDB Atlas cluster or other MongoDB deployment

## Configuration

1. Install dependencies:
   ```sh
   npm install
   ```
2. Copy `.env.example` (if present) or create `.env` and set:
   ```sh
   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
   PORT=3001
   ```
   Never commit credentials to version control.

## Development

- Start the server with automatic reload:
  ```sh
  npm run dev
  ```
- Start the server normally:
  ```sh
  npm start
  ```
- Run ESLint:
  ```sh
  npm run lint
  ```

## API Overview

- `GET /api/persons` – list all phonebook entries
- `GET /api/persons/:id` – fetch a single entry
- `POST /api/persons` – create an entry (`name`, `number`)
- `PUT /api/persons/:id` – update an existing entry
- `DELETE /api/persons/:id` – remove an entry
- `GET /info` – returns entry count and server time

## Notes

- Data is stored in MongoDB using Mongoose models. Schema validation enforces unique names and number format.
- Phone numbers must be at least 8 characters, split into two numeric parts by a single dash; both parts contain only digits. Examples: valid `09-1234556`, `040-22334455`; invalid `1234556`, `1-22334455`, `10-22-334455`.
- `dist/` contains the compiled frontend and is served statically by Express.
