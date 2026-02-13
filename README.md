# Myntra Clone Backend

This is the backend for the Myntra clone application.

## Prerequisites

- Node.js installed
- MongoDB installed and running

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Create a `.env` file:**
    Create a file named `.env` in the `backend` directory and add the following line:
    ```
    MONGO_URI=mongodb://localhost:27017/myntra
    ```
    *Note: If your MongoDB instance is running on a different URI, replace it accordingly.*

3.  **Start the server:**
    ```bash
    npm start
    ```
    The server will start on port 5000.

## Troubleshooting

If you are facing issues with login or registration, check the console output of the backend server. The detailed logs will help you identify the problem.

- **Database Connection Issues:** If the server fails to connect to MongoDB, you will see an error message in the console. Make sure your MongoDB server is running and the `MONGO_URI` in your `.env` file is correct.
- **Other Issues:** The logs will show the progress of each login and registration request. If a request fails, the error will be printed to the console.
