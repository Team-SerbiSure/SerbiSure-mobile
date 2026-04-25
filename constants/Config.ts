export const API_CONFIG = {
    // For Android Emulator use 10.0.2.2
    // For iOS Simulator use localhost or 127.0.0.1
    // For Physical Device use your machine's local IP address (e.g., 192.168.1.xxx)
    BASE_URL: 'http://10.0.2.2:8000', // Defaulting to Android emulator friendly IP
    PROD_URL: 'https://serbisure-backend.vercel.app',
};

export const getBaseUrl = () => {
    // You can add logic here to switch between dev and prod
    return API_CONFIG.BASE_URL;
};
