import { getCurrencySymbol, extractFormData } from "./utils";
import { jobTemplate } from "./templates";

export class JobSearch {
  constructor(
    searchFormSelector,
    resultsContainerSelector,
  
  ) {
    this.searchForm = document.querySelector(searchFormSelector);
    this.resultsContainer = document.querySelector(resultsContainerSelector);
   
  }

  setCountryCode() {
    this.countryCode = 'gb';
    this.setCurrencyCode();
    fetch('http://ip-api.com/json')
      .then(results => results.json())
      .then(results => {
        this.countryCode = results.countryCode.toLowerCase();
        this.setCurrencySymbol();
      });
  }

  setCurrencyCode() {
    this.currencySymbol = getCurrencySymbol(this.countryCode); // Fix this line
  }

  setCurrencySymbol() {
    // Implement this method to set the currencySymbol property
    // based on the currency code (this.currencySymbol)
  }

  configureFormListener() {
    this.searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this.resultsContainer.innerHTML = '';
      const { search, location } = extractFormData(this.searchForm);
      const apiUrl = `http://localhost:3000/?search=${search}&location=${location}&country=${this.countryCode}`;
  
      console.log('Before fetch request'); // Add this line
  
      fetch(apiUrl)
        .then((response) => {
          console.log('After fetch request, before response'); // Add this line
  
          if (response.headers.get('content-type').includes('application/json')) {
            return response.json();
          } else if (response.headers.get('content-type').includes('text/html')) {
            return response.text(); // Handle HTML response
          } else {
            throw new Error('Unsupported content type');
          }
        })
        .then((data) => {
          console.log('After response, before processing data'); // Add this line
  
          if (typeof data === 'string') {
            // Handle HTML response
            this.resultsContainer.innerHTML = data;
          } else {
            // Handle JSON response
            const jobs = data.results
              .map((job) => jobTemplate(job, this.currencySymbol))
              .join('');
            this.resultsContainer.innerHTML = jobs;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }
}  