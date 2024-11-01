// index.js
import express from 'express';
import cors from 'cors';
import { APP_ID, API_KEY, BASE_URL, BASE_PARAMS } from './config.js';

const PORT = 3000;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Sample job data (replace with database later)
const jobs = [
    {
        id: 1,
        title: "Software Engineer",
        company: "Tech Corp",
        location: "London",
        salary: 75000,
        description: "Full-stack developer position with focus on Node.js and React",
        posted: new Date().toISOString(),
        apply_url: "https://example.com/apply"
    }
];

// Routes
app.get('/', (req, res) => {
    try {
        const { search, location, country } = req.query;
        let filteredJobs = [...jobs];

        if (search) {
            const searchLower = search.toLowerCase();
            filteredJobs = filteredJobs.filter(job => 
                job.title.toLowerCase().includes(searchLower) ||
                job.company.toLowerCase().includes(searchLower) ||
                job.description.toLowerCase().includes(searchLower)
            );
        }

        if (location) {
            const locationLower = location.toLowerCase();
            filteredJobs = filteredJobs.filter(job =>
                job.location.toLowerCase().includes(locationLower)
            );
        }

        res.json({
            success: true,
            results: filteredJobs
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Add new job
app.post('/jobs', (req, res) => {
    try {
        const newJob = {
            id: jobs.length + 1,
            ...req.body,
            posted: new Date().toISOString()
        };
        jobs.push(newJob);
        res.status(201).json({
            success: true,
            job: newJob
        });
    } catch (error) {
        console.error('Job creation error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Get single job
app.get('/jobs/:id', (req, res) => {
    try {
        const job = jobs.find(j => j.id === parseInt(req.params.id));
        if (!job) {
            return res.status(404).json({
                success: false,
                error: 'Job not found'
            });
        }
        res.json({
            success: true,
            job
        });
    } catch (error) {
        console.error('Job fetch error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});