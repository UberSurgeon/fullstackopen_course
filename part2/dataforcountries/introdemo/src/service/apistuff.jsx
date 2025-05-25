import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/'
const api_key = import.meta.env.VITE_SOME_KEY

const getAllName = () => {
    const request = axios.get(`${baseUrl}/api/all`)
    return request.then(response => response.data)
}

const getOneCountry = (name) => {

    const request = axios.get(`${baseUrl}/api/name/${name}`)

    return request.then(response => response.data)
}

const getWeather = (lat, lon) => {
    const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)
    return request.then(response => response.data)
}

const getCord = (city) => {
    const latLon = axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${api_key}`)
    return latLon.then(geo => geo.data)
}



export default {getAllName, getOneCountry, getWeather,getCord}