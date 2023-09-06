import axios from 'axios';

// Sends POST request using the given request and urlPath.
export async function sendRequest(urlPath, request) {
  try {
    const response = await axios.post(urlPath, request);
    return handleResponse(response);
  } catch (error) {
    throw error;
  }
}

// Returns response if the status code is 200, otherwise throw error.
export async function handleResponse(response) {
  if (response.status === 200) {
    // Successful response, simply return
    return response;
  }

  // Unknown error occurred
  throw new Error(
    'Unknown API response error, response did not return with a status code of 200.'
  );
}

// Extracts and returns the page data to display for the given error.
export function handleError(error) {
  const errorMessage = error.response.data;
  let errorPageText;
  if (errorMessage) {
    errorPageText = {
      title: errorMessage.title,
      description: errorMessage.description,
    };
  }
  return errorPageText;
}
