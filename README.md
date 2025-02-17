# Project Setup Guide

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) 
- [Python](https://www.python.org/) 
- [pip](https://pip.pypa.io/en/stable/) 

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

## Important step to ensure efficient dependency management

Make sure to append (not overwrite) the server/requirements.txt file with the dependencies. Rule of thumb to follow:

After pulling the changes, run

```sh
   pip install -r requirements.txt
```

After installing new packages locally, add them to the server/requirements.txt file by running

```sh
   pip freeze > requirements.txt
```
