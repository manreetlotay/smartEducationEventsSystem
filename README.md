# Project Setup Guide

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (for the frontend)
- [Python](https://www.python.org/) (for the backend)
- [pip](https://pip.pypa.io/en/stable/) (Python package manager)

## Runnning the Website (frontend and backend simultaneously) Locally

### Start the frontend React Server on Terminal 1

1. Navigate to the client folder

   ```sh
   cd client

   ```

2. Install dependencies

   ```sh
   npm install

   ```

3. Start the React Development Server

   ```sh
   npm run dev

   #The React frontend should now be running at http://localhost:5173/.
   ```

### Start the backend Flask Server on Terminal 2

1. Navigate to the server folder

   ```sh
   cd server

   ```

2. Activate python vitual environment

   ```sh
   #Windows (Command Prompt)
        venv\Scripts\activate

    #macOS/Linux
        source venv/bin/activate

   ```

3. Install dependencies

   ```sh
   pip install -r requirements.txt

   ```

4. Run the Flask Server

   ```sh
   python app/app.py

   #The Flask backend should now be running at http://localhost:5000
   ```
