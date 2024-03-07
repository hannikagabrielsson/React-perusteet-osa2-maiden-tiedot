import axios from "axios";

console.log("ManageCountries is running.")

export const getAllCountries = () => {
 return axios
     .get('https://studies.cs.helsinki.fi/restcountries/api/all')
     .then((response) => {
         const { data } = response;
         return data;
     })
     .catch((error) => {
         throw error;
     })
}


export const getGeocoding = async (capital) => {
    try {
        if (!capital) {
            throw new Error("Capital city not provided");
        }

        const API_KEY = import.meta.env.VITE_API_KEY
        const encodedCityName = encodeURIComponent(capital);
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodedCityName}&limit=1&appid=${API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();
        
        if (data.length > 0) {
            const { lat, lon } = data[0];
            return { lat, lon };
        } else {
            throw new Error("City not found");
        }
    } catch (error) {
        console.error("Error fetching geocoding data:", error);
        throw error;
    }
};


export const getWeather = async (lat, lon) => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    console.log('API_KEY:', API_KEY);
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Weather data not available');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
    }
};

export const getWeatherForCapital = async (capital) => {
    try {
        const { lat, lon } = await getGeocoding(capital);
        const weatherData = await getWeather(lat, lon);
        console.log("Weather data for", capital, ":", weatherData);
        console.log("Weather icon: ", weatherData.weather[0].icon)
        return {
            temperature: weatherData.main.temp,
            windSpeed: weatherData.wind.speed,
            icon: weatherData.weather[0].icon,
        };
    } catch (error) {
        console.error("Error:", error.message);
    }
};



