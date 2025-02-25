const getBackendBaseUrl = () => {
    return process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_BACKEND_LOCAL_HOST
        : process.env.REACT_APP_BACKEND_PROD_HOST;
};

export default getBackendBaseUrl;
