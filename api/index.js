// index.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;  // Changed to 3001 since 3000 was busy

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Replace with your RapidAPI key
const RAPID_API_KEY = 'YOUR_API_KEY';

// HTML template function for job cards
const createJobCard = (job) => `
    <div class="job-card">
        <div class="job-header">
            <div class="company-logo">
                ${job.company.logo ? 
                    `<img src="${job.company.logo}" alt="${job.company.name} logo">` : 
                    `<div class="logo-placeholder">${job.company.name.charAt(0)}</div>`
                }
            </div>
            <div class="job-title-company">
                <h2>${job.title}</h2>
                <h3>${job.company.name}</h3>
                <div class="location">
                    📍 ${job.location.city || ''} ${job.location.state || ''} ${job.location.country || ''}
                    ${job.location.remote ? '<span class="remote-badge">Remote</span>' : ''}
                </div>
            </div>
        </div>
        <div class="job-details">
            ${job.salary.min || job.salary.max ? 
                `<div class="salary">💰 ${job.salary.min ? job.salary.min + ' - ' : ''}${job.salary.max || ''} ${job.salary.currency || 'USD'}/${job.salary.period || 'year'}</div>` : 
                ''
            }
            <div class="employment-type">💼 ${job.employment_type || 'Not specified'}</div>
            <div class="posted-date">📅 Posted: ${new Date(job.posted_at).toLocaleDateString()}</div>
        </div>
        <div class="job-description">
            ${job.description.substring(0, 300)}...
        </div>
        <div class="job-actions">
            <a href="${job.apply_url}" target="_blank" class="apply-btn">Apply Now</a>
            <button onclick="showJobDetails('${job.id}')" class="details-btn">View Details</button>
        </div>
    </div>
`;

// HTML template for job search results
const createSearchResultsHTML = (jobs) => `
    <div class="search-stats">
        Found ${jobs.length} jobs
    </div>
    <div class="job-cards">
        ${jobs.map(job => createJobCard(job)).join('')}
    </div>
`;

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Search endpoint that returns HTML
app.get('/search', async (req, res) => {
    try {
        const { 
            search = '', 
            location = '', 
            employment_type = '',
            page = '1',
            remote_jobs_only = 'false'
        } = req.query;

        const url = new URL('https://jsearch.p.rapidapi.com/search');
        url.search = new URLSearchParams({
            query: `${search} ${location}`.trim(),
            page,
            num_pages: '1',
            remote_jobs_only: remote_jobs_only,
            date_posted: 'all'
        }).toString();

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': RAPID_API_KEY,
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
            }
        });

        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();
        const transformedJobs = data.data.map(job => ({
            id: job.job_id,
            title: job.job_title,
            company: {
                name: job.employer_name,
                logo: job.employer_logo,
                website: job.employer_website
            },
            location: {
                city: job.job_city,
                state: job.job_state,
                country: job.job_country,
                remote: job.job_is_remote
            },
            salary: {
                min: job.job_min_salary,
                max: job.job_max_salary,
                currency: job.job_salary_currency,
                period: job.job_salary_period
            },
            description: job.job_description,
            employment_type: job.job_employment_type,
            posted_at: job.job_posted_at_datetime_utc,
            apply_url: job.job_apply_link
        }));

        const html = createSearchResultsHTML(transformedJobs);
        res.send(html);
    } catch (error) {
        console.error('API error:', error);
        res.send(`
            <div class="error-message">
                Error fetching jobs: ${error.message}
            </div>
        `);
    }
});

// Get job details endpoint that returns HTML
app.get('/jobs/:id', async (req, res) => {
    try {
        const url = new URL('https://jsearch.p.rapidapi.com/job-details');
        url.search = new URLSearchParams({
            job_id: req.params.id
        }).toString();

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': RAPID_API_KEY,
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
            }
        });

        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();
        const job = data.data[0];

        const html = `
            <div class="job-details-modal">
                <h1>${job.job_title}</h1>
                <div class="company-info">
                    ${job.employer_logo ? 
                        `<img src="${job.employer_logo}" alt="${job.employer_name} logo">` : 
                        ''
                    }
                    <h2>${job.employer_name}</h2>
                    ${job.employer_website ? 
                        `<a href="${job.employer_website}" target="_blank">Company Website</a>` : 
                        ''
                    }
                </div>
                <div class="job-info">
                    <p class="location">📍 ${job.job_city || ''} ${job.job_state || ''} ${job.job_country || ''}</p>
                    <p class="employment-type">💼 ${job.job_employment_type || 'Not specified'}</p>
                    <p class="salary">💰 ${job.job_salary_currency || 'USD'} ${job.job_min_salary || ''} - ${job.job_max_salary || ''}</p>
                </div>
                <div class="job-description">
                    <h3>Description</h3>
                    ${job.job_description}
                </div>
                <div class="job-highlights">
                    ${job.job_highlights?.Qualifications ? `
                        <div class="qualifications">
                            <h3>Qualifications</h3>
                            <ul>
                                ${job.job_highlights.Qualifications.map(q => `<li>${q}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${job.job_highlights?.Responsibilities ? `
                        <div class="responsibilities">
                            <h3>Responsibilities</h3>
                            <ul>
                                ${job.job_highlights.Responsibilities.map(r => `<li>${r}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${job.job_highlights?.Benefits ? `
                        <div class="benefits">
                            <h3>Benefits</h3>
                            <ul>
                                ${job.job_highlights.Benefits.map(b => `<li>${b}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
                <div class="apply-section">
                    <a href="${job.job_apply_link}" target="_blank" class="apply-button">Apply for this position</a>
                </div>
            </div>
        `;
        
        res.send(html);
    } catch (error) {
        console.error('API error:', error);
        res.send(`
            <div class="error-message">
                Error fetching job details: ${error.message}
            </div>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
