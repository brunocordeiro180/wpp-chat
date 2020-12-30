export const TOKEN_KEY = "@vendergas-token";
export const TOKEN_COMPANY = "@vendergas-company";
export const TOKEN_USERNAME = "@vendergas-username";

export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getUsername = () => localStorage.getItem(TOKEN_USERNAME);
export const getCompany = () => localStorage.getItem(TOKEN_COMPANY);

export const login = (token, username, company) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_USERNAME, username)
    localStorage.setItem(TOKEN_COMPANY, company)
};
export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_USERNAME);
    localStorage.removeItem(TOKEN_COMPANY);
};