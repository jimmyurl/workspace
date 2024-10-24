// src/utils.js
export const getCurrencySymbol = (countryCode) => {
    const currencyMap = {
      'gb': '£', // British Pound
      'us': '$', // US Dollar
      'eu': '€', // Euro
      'jp': '¥', // Japanese Yen
      // Add more country codes and symbols as needed
    };
    return currencyMap[countryCode.toLowerCase()] || '$'; // Default to USD if country not found
  };
  
  export const extractFormData = (form) => {
    const formData = new FormData(form);
    return {
      search: formData.get('search') || '',
      location: formData.get('location') || ''
    };
  };
  
  // src/templates.js
  export const jobTemplate = (job, currencySymbol) => {
    const salary = job.salary ? `${currencySymbol}${job.salary}` : 'Salary not specified';
    
    return `
      <div class="job-card">
        <h2 class="job-title">${job.title}</h2>
        <div class="job-company">${job.company}</div>
        <div class="job-location">📍 ${job.location}</div>
        <div class="job-salary">💰 ${salary}</div>
        <div class="job-description">${job.description}</div>
        <div class="job-posted">Posted: ${new Date(job.posted).toLocaleDateString()}</div>
        ${job.apply_url ? `<a href="${job.apply_url}" class="apply-btn" target="_blank">Apply Now</a>` : ''}
      </div>
    `;
  };
  
  // src/JobSearch.js
  import { getCurrencySymbol, extractFormData } from "./utils";
  import { jobTemplate } from "./templates";
  
  export class JobSearch {
    constructor(searchFormSelector, resultsContainerSelector) {
      this.searchForm = document.querySelector(searchFormSelector);
      this.resultsContainer = document.querySelector(resultsContainerSelector);
      
      if (!this.searchForm) throw new Error('Search form not found');
      if (!this.resultsContainer) throw new Error('Results container not found');
      
      this.countryCode = 'gb';
      this.currencySymbol = '£';
    }
  
    setCountryCode() {
      fetch('http://ip-api.com/json')
        .then(results => results.json())
        .then(results => {
          this.countryCode = results.countryCode.toLowerCase();
          this.setCurrencySymbol();
        })
        .catch(error => {
          console.error('Error fetching country code:', error);
          // Keep default values if API fails
        });
    }
  
    setCurrencySymbol() {
      this.currencySymbol = getCurrencySymbol(this.countryCode);
    }
  
    configureFormListener() {
      this.searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        this.resultsContainer.innerHTML = '<div class="loading">Searching for jobs...</div>';
  
        try {
          const { search, location } = extractFormData(this.searchForm);
          const apiUrl = `http://localhost:3000/?search=${encodeURIComponent(search)}&location=${encodeURIComponent(location)}&country=${this.countryCode}`;
  
          const response = await fetch(apiUrl);
          const contentType = response.headers.get('content-type');
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          let data;
          if (contentType && contentType.includes('application/json')) {
            data = await response.json();
          } else if (contentType && contentType.includes('text/html')) {
            const htmlContent = await response.text();
            this.resultsContainer.innerHTML = htmlContent;
            return;
          } else {
            throw new Error('Unsupported content type');
          }
  
          if (data.results && Array.isArray(data.results)) {
            const jobs = data.results
              .map(job => jobTemplate(job, this.currencySymbol))
              .join('');
            
            this.resultsContainer.innerHTML = jobs || '<div class="no-results">No jobs found</div>';
          } else {
            throw new Error('Invalid data format received from API');
          }
        } catch (error) {
          console.error('Error during job search:', error);
          this.resultsContainer.innerHTML = `
            <div class="error">
              Sorry, there was an error searching for jobs. Please try again later.
            </div>
          `;
        }
      });
    }
  }
  
  // src/app.js
  import { JobSearch } from './JobSearch';
  
  const jobSearch = new JobSearch('#search-form', '.result-container');
  jobSearch.setCountryCode();
  jobSearch.configureFormListener();