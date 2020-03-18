let _API_URL: string;
let _APP_URL: string;
let _APP_LOGGER_ON: boolean;

if(process.env.NODE_ENV === "production"){
    _API_URL = "https://whizsid.github.io/api/";

    _APP_URL = "https://whizsid.github.io/";

    _APP_LOGGER_ON = false;
} else {
    _API_URL = "http://127.0.0.1:3000/api/";

    _APP_URL = "http://127.0.0.1:3000/";

    _APP_LOGGER_ON = true;
}

export const API_URL = _API_URL;
export const APP_URL = _APP_URL;
export const APP_LOGGER_ON = _APP_LOGGER_ON;