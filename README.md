# IP Lookup Platform

This project is an IP Lookup Platform consisting of a **NestJS** backend and a **Next.js** frontend.

## Project Structure

- `ip-lookup-backend`: The backend API built with NestJS.
- `ip-lookup-frontend`: The frontend application built with Next.js.

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

## Getting Started

Follow the instructions below to set up and run the project locally.

### 1. Backend Setup

Open a terminal and navigate to the backend directory:

```bash
cd ip-lookup-backend
```

#### Install Dependencies

```bash
npm install
```

#### Environment Configuration

Ensure you have a `.env` file in the `ip-lookup-backend` directory. You can copy the example if available or create one with the necessary variables.

#### Run the Backend

Start the development server:

```bash
# development mode
npm run start

# watch mode (recommended for development)
npm run start:dev
```

The backend server will typically run on `http://localhost:3001` or another configured port.

### 2. Frontend Setup

Open a new terminal window (keep the backend running) and navigate to the frontend directory:

```bash
cd ip-lookup-frontend
```

#### Install Dependencies

```bash
npm install
```

#### Run the Frontend

Start the development server:

```bash
npm run dev
```

The application should be accessible at [http://localhost:3000](http://localhost:3000).

---

## Running with Docker (Optional)

If you prefer to run the entire stack using Docker, you can use the provided `docker-compose.yml` file in the root directory.

```bash
# From the root directory
docker-compose up --build
```

This command will spin up both the backend and frontend containers.

## Testing

### Backend Tests

To run unit tests for the backend:

```bash
cd ip-lookup-backend
npm run test
```

### Frontend Tests

To run tests for the frontend (if configured):

```bash
cd ip-lookup-frontend
npm run test
```

## License

This project is licensed under the MIT License.
