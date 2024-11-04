Here's the updated `README.md` incorporating the new project structure and additional details:

```markdown
# Job Search App (Express & Node.js)

This project is a job search application built using Express.js and Node.js. The app fetches job listings and detailed job information from a third-party API and presents it in a user-friendly format through a simple web interface.

## Features

- **Search for Jobs**: Search for jobs using keywords, location, and employment type.
- **Remote Job Filtering**: Option to filter for remote jobs.
- **Job Details Page**: View detailed information about job listings, including company info, job description, and qualifications.
- **Responsive Design**: The app includes basic responsive design to work on various devices.
- **Static Assets**: Serves static files, including HTML, CSS, and JavaScript from a `public` directory.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for Node.js.
- **CORS**: Middleware for enabling cross-origin requests.
- **Node-Fetch**: Used to make HTTP requests to the API.
- **HTML/CSS**: For the user interface.

## Getting Started

### Prerequisites

Ensure you have Node.js and npm installed on your system.

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/jimmyurl/workspace.git
    cd job-search-app
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your RapidAPI key:
    ```env
    RAPID_API_KEY=your_rapidapi_key_here
    ```

### Running the Application

1. Start the server:
    ```bash
    node index.js
    ```

2. Open your browser and navigate to:
    ```
    http://localhost:3001
    ```

## Project Structure

```
job-search-app/
│
├── api/                    # Backend logic and server code
│   ├── config.js           # Configuration file for API keys and settings
│   ├── index.js            # Main Express server file
│   ├── index.html          # Landing page served by the server
│   ├── node_modules/       # Dependencies for the backend
│   ├── package.json        # Node.js project metadata for the backend
│   └── package-lock.json
│
├── frontend/               # Frontend application files
│   ├── dist/               # Compiled frontend files
│   ├── src/                # Source code for the frontend
│   ├── index.html          # Entry point for the frontend app
│   ├── node_modules/       # Dependencies for the frontend
│   ├── package.json        # Node.js project metadata for the frontend
│   └── package-lock.json
│
├── public/                 # Static files (HTML, CSS, JS)
│   ├── index.html          # Main HTML file
│   └── styles.css          # Optional CSS for styling
│
├── index.js                # Main server file
├── README.md               # Project documentation
└── node_modules/           # Top-level dependencies
```

## API Integration

The app fetches job data from the [JSearch API](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch) using the `node-fetch` package. To run this app, a valid RapidAPI key is required.

### Endpoints

- **`GET /`**: Serves the main search page.
- **`GET /search`**: Accepts query parameters (`search`, `location`, `employment_type`, `page`, `remote_jobs_only`) and returns job search results in HTML format.
- **`GET /jobs/:id`**: Retrieves and displays detailed job information based on the job ID.

### Example Request

To search for jobs:
```
GET /search?search=developer&location=New+York&employment_type=full-time&page=1&remote_jobs_only=true
```

## Customization

- Modify `index.js` to adjust the logic or the display of job data.
- Edit the HTML and CSS files in the `public` directory to customize the UI.

## Notes

- The app is set to run on port `3001` by default.
- Ensure the `RAPID_API_KEY` is set up correctly in the `.env` file or replace it in the code as needed.
- For better security, do not expose your API key in the source code.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any feature or bug fix.

## License

This project is open-source and available under the [MIT License](LICENSE).
```

Feel free to modify any sections further to suit your project's specifics!