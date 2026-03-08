import { tmdb } from "./tmdbService";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

/**
 * Step 1: Create a request token
 */
export const createRequestToken = async () => {
  try {
    const response = await tmdb.get("/authentication/token/new");
    return response.data.request_token;
  } catch (error) {
    console.error("Error creating request token:", error);
    throw error;
  }
};

/**
 * Step 2: Redirect user to TMDB to approve the request token
 */
export const getApprovalUrl = (requestToken) => {
  return `https://www.themoviedb.org/auth/access?request_token=${requestToken}`;
};

/**
 * Step 3: Create a session ID from the approved request token
 */
export const createSessionId = async (requestToken) => {
  try {
    const response = await tmdb.post("/authentication/session/new", {
      request_token: requestToken,
    });
    return response.data.session_id;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
};

/**
 * Get account details (including account_id)
 */
export const getAccountDetails = async (sessionId) => {
  try {
    const response = await tmdb.get("/account", {
      params: {
        session_id: sessionId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching account details:", error);
    throw error;
  }
};
