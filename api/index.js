// api/index.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with database later)
let jobs = [
    {
        id: 1,
        title: "Software Engineer",
        company: "Tech Corp",
        location: "New York",
        description: "Full-stack developer position",
        salary: "100,000",
        postDate: "2024-10-24"
    }
];

// Routes
app.get('/api/jobs', (req, res) => {
    res.json(jobs);
});

app.post('/api/jobs', (req, res) => {
    const newJob = {
        id: jobs.length + 1,
        ...req.body,
        postDate: new Date().toISOString().split('T')[0]
    };
    jobs.push(newJob);
    res.status(201).json(newJob);
});

app.get('/api/jobs/search', (req, res) => {
    const { query } = req.query;
    const filteredJobs = jobs.filter(job => 
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.company.toLowerCase().includes(query.toLowerCase()) ||
        job.description.toLowerCase().includes(query.toLowerCase())
    );
    res.json(filteredJobs);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});