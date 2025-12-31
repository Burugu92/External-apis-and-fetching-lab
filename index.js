// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!
// Base URL for National Weather Service API
const API_BASE_URL = 'https://api.weather.gov';

/**
 * Fetches weather alerts for a given US state
 * @param {string} state - Two-letter state abbreviation (e.g., 'CA', 'NY')
 * @returns {Promise<Object>} - Weather alert data from the API
 */
async function fetchWeatherAlerts(state) {
  try {
    const response = await fetch(`${API_BASE_URL}/alerts/active?area=${state}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Fetched data:', data); // Log data for testing
    return data;
  } catch (error) {
    console.log('Error:', error.message); // Log error for testing
    throw error;
  }
}

/**
 * Displays weather alerts in the DOM
 * @param {Object} data - Weather data object from the API
 */
function displayAlerts(data) {
  const alertsDisplay = document.getElementById('alerts-display');
  
  if (!alertsDisplay) {
    console.error('Alerts display element not found');
    return;
  }

  // Clear previous content
  alertsDisplay.innerHTML = '';

  // Get the title and number of alerts
  const title = data.title || 'Current watches, warnings, and advisories';
  const alertCount = data.features ? data.features.length : 0;

  // Create summary message
  const summaryMessage = document.createElement('p');
  summaryMessage.className = 'summary-message';
  summaryMessage.textContent = `${title}: ${alertCount}`;
  alertsDisplay.appendChild(summaryMessage);

  // Display alert headlines
  if (data.features && data.features.length > 0) {
    const headlinesList = document.createElement('ul');
    headlinesList.className = 'alerts-list';

    data.features.forEach(alert => {
      const headline = alert.properties?.headline || 'No headline available';
      const listItem = document.createElement('li');
      listItem.textContent = headline;
      headlinesList.appendChild(listItem);
    });

    alertsDisplay.appendChild(headlinesList);
  }
}

/**
 * Displays error message in the DOM
 * @param {string} message - Error message to display
 */
function displayError(message) {
  const errorDiv = document.getElementById('error-message');
  
  if (!errorDiv) {
    console.error('Error message element not found');
    return;
  }

  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
}

/**
 * Clears and hides the error message
 */
function clearError() {
  const errorDiv = document.getElementById('error-message');
  
  if (errorDiv) {
    errorDiv.textContent = '';
    errorDiv.classList.add('hidden');
  }
}

/**
 * Clears the input field
 */
function clearInput() {
  const stateInput = document.getElementById('state-input');
  
  if (stateInput) {
    stateInput.value = '';
  }
}

/**
 * Validates state abbreviation input
 * @param {string} state - State abbreviation to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateStateInput(state) {
  if (!state || state.trim() === '') {
    throw new Error('Please enter a state abbreviation');
  }

  const trimmedState = state.trim().toUpperCase();
  
  if (trimmedState.length !== 2 || !/^[A-Z]{2}$/.test(trimmedState)) {
    throw new Error('State abbreviation must be exactly 2 letters');
  }

  return true;
}

/**
 * Handles the button click to fetch and display weather alerts
 */
async function handleGetAlerts() {
  const stateInput = document.getElementById('state-input');
  const fetchButton = document.getElementById('fetch-alerts');

  if (!stateInput) {
    console.error('State input element not found');
    return;
  }

  const stateValue = stateInput.value;

  // Clear previous error message
  clearError();

  // Disable button and show loading state
  if (fetchButton) {
    fetchButton.disabled = true;
    fetchButton.textContent = 'Loading...';
  }

  try {
    // Validate input
    validateStateInput(stateValue);

    const normalizedState = stateValue.trim().toUpperCase();

    // Fetch weather alerts
    const data = await fetchWeatherAlerts(normalizedState);

    // Display the alerts
    displayAlerts(data);

    // Clear the input field after successful fetch
    clearInput();

  } catch (error) {
    // Display error message
    displayError(error.message);
  } finally {
    // Re-enable button and restore text
    if (fetchButton) {
      fetchButton.disabled = false;
      fetchButton.textContent = 'Get Weather Alerts';
    }
  }
}

/**
 * Initializes the application by setting up event listeners
 */
function initializeApp() {
  const fetchButton = document.getElementById('fetch-alerts');
  const stateInput = document.getElementById('state-input');

  if (fetchButton) {
    fetchButton.addEventListener('click', handleGetAlerts);
  }

  // Allow Enter key to submit
  if (stateInput) {
    stateInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        handleGetAlerts();
      }
    });
  }
}

// Initialize app when DOM is loaded
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
}

// Export functions for testing (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fetchWeatherAlerts,
    displayAlerts,
    displayError,
    clearError,
    clearInput,
    validateStateInput,
    handleGetAlerts
  };
}