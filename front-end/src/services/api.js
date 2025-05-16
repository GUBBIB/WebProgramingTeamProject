const API_BASE_URL = 'http://13.60.93.77/api';

// Helper function for API calls
const fetchApi = async (endpoint, options = {}) => {
  const { body, ...customOptions } = options;
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...customOptions.headers,
  };

  const config = {
    ...customOptions,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      // Attempt to create a more informative error message
      let errorMessage = `API Error: ${response.status}`;
      if (data && data.message) {
        errorMessage += ` - ${data.message}`;
      }
      if (data && data.errors) {
        const specificErrors = Object.values(data.errors).flat().join(', ');
        errorMessage += ` (${specificErrors})`;
      }
      const error = new Error(errorMessage);
      error.response = response; // Attach full response if needed
      error.data = data; // Attach parsed error data
      throw error;
    }
    return data;
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error.message);
    // Re-throw the error so it can be caught by the calling function
    // This allows components to handle specific API errors if necessary
    throw error; 
  }
};

// Authentication APIs
export const loginUser = (credentials) => fetchApi('/login', { method: 'POST', body: credentials });
export const registerUser = (userData) => fetchApi('/register', { method: 'POST', body: userData });

// Board and Post APIs
export const fetchAllPosts = (page, searchTerm, searchType) => {
  let query = `?page=${page}`;
  if (searchTerm) {
    query += `&search_type=${searchType}&search_term=${encodeURIComponent(searchTerm)}`;
  }
  return fetchApi(`/boards/all${query}`);
};

export const fetchBoardPosts = (boardId, page, searchTerm, searchType) => {
  let query = `?page=${page}`;
  if (searchTerm) {
    query += `&search_type=${searchType}&search_term=${encodeURIComponent(searchTerm)}`;
  }
  return fetchApi(`/boards/${boardId}${query}`);
};

export const fetchPostDetails = (boardId, postId) => fetchApi(`/boards/${boardId}/posts/${postId}`);
export const createNewPost = (postData) => fetchApi('/posts', { method: 'POST', body: postData });

// Comment APIs
export const fetchCommentsForPost = (boardId, postId) => fetchApi(`/boards/${boardId}/comments?post_id=${postId}`);
export const createNewComment = (commentData) => fetchApi('/comments', { method: 'POST', body: commentData });

// Example for fetching board types if it were from an API (currently hardcoded in App.jsx)
// export const fetchBoardTypes = () => fetchApi('/boards'); 

