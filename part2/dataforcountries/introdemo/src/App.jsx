import { useState, useEffect } from 'react'
import service from './service/apistuff'

const RenderWeatherIcon = ({weather}) => {
  let x = ''
  switch (weather) {
    case 200:
    case 201:
    case 202:
    case 210:
    case 211:
    case 212:
    case 221:
    case 230:
    case 231:
    case 232:
      x = `11d`; // thunderstorm
    case 300:
    case 301:
    case 302:
    case 310:
    case 311:
    case 312:
    case 313:
    case 314:
    case 321:
      x = `09d`; // drizzle
    case 500:
    case 501:
    case 502:
    case 503:
    case 504:
    case 520:
    case 521:
    case 522:
    case 531:
      x = `10d`; // rain
    case 600:
    case 601:
    case 602:
    case 611:
    case 612:
    case 613:
    case 615:
    case 616:
    case 620:
    case 621:
    case 622:
      x = `13d`; // snow
    case 701:
    case 711:
    case 721:
    case 731:
    case 741:
    case 751:
    case 761:
    case 762:
    case 771:
    case 781:
      x = `50d`; // mist/fog/smoke/dust
    case 800:
      x = `01d`; // clear sky
    case 801:
      x = `02d`; // few clouds
    case 802:
      x = `03d`; // scattered clouds
    case 803:
      x = `04d`; // broken clouds
    case 804:
      x = `04d`; // overcast clouds
    default:
      x = `01d`; // Default to clear sky icon
  }

  const url = `https://openweathermap.org/img/wn/${x}@2x.png`

  return (
    <>
      <img src={url}></img>
    </>
  )
}

const CountiresForm = ({newQuery, handleCountries}) => {
  return(
    <>
    <form>
      <div>
      find countruies: <input value={newQuery} onChange={handleCountries}/>
      </div>
    </form>
    </>
  )
}


const HandleCountriesFiltered = ({country}) => {

  return(
    <>
      {country.common}
    </>
  )
}

const HandleCountry = ({name, capital, area, language, flag, temp, wind, weather}) => {

  return(
    <>
      <h1>{name}</h1>
      <p>Capital {capital}</p>
      <p>Area {area}</p>
      <h1>Languages</h1>
        <ul>
          {language.map(lang => <li key={lang}>{lang}</li>)}
        </ul>
      <img src={flag}></img>
      <h1>Weather in {capital}</h1>
      <p>Temperature {temp} Celsius</p>
      <RenderWeatherIcon weather={weather}/>
      <p>Wind {wind} Celsius</p>

    </>
  )
}



function App() {
  const [newQuery, setQuery] = useState('')
  const [newCountries, setCountries] = useState(null)
  const [newCapital, setNewCapital] = useState(null)
  const [newCord, setCord] = useState({'lat': 0, 'lon': 0})
  const [newWeather, setWeather] = useState({'temp': 0, 'wind': 0,'weather':0, 'lat': 1, 'lon': 1})



  useEffect(() => {
    service
      .getAllName()
      .then(initinalCountries => setCountries(initinalCountries))
  },[])

  useEffect(()=> {
    if (newCord.lat && newCord.lon){
    console.log("lat",newCord.lat)
    console.log("lon",newCord.lon)
    service
      .getWeather(newCord.lat,newCord.lon)
      .then(weather => {
        const temp = weather.main['temp']
        const wind = weather.wind['speed']
        const weathers = weather.weather[0]['id']
        console.log("WEATHER ID",weathers)
        const lat = newCord.lat
        const lon = newCord.lon
        const newObject = {'temp': temp, 'wind': wind, 'lat':lat, 'lon':lon, 'weather': weathers}
        setWeather(newObject)

      })}
  }, [newCord])

  useEffect(()=> {
    console.log("CAPITAL", newCapital)
    service
      .getCord(newCapital)
      .then(geo => {       
        console.log("GEO",geo)
        const newObject = {'lat': geo[0].lat, 'lon': geo[0].lon}
        console.log("CORD",newObject)
        setCord(newObject)

    }).catch(error => console.log(error))
  }, [newCapital])


  if (!newCountries){
    return null
  }




  const Countries = ()=> {
    const filterToShow = newQuery === ''
    ? newCountries
    : newCountries.filter(country => country.name.common.toLowerCase().includes(newQuery))
    console.log(filterToShow)
    console.log(filterToShow.length)
    try{
      if (filterToShow.length > 10) {
        console.log("more than 10")
        return (
          <>
          Too many matches, specify another filter
          
          </>
          
        )
      } else if (filterToShow.length < 11 && filterToShow.length > 1){
        console.log("more than 1")
        return(
          <>
            {filterToShow.map(country => 
                <div key={country.name.common}>
                  <HandleCountriesFiltered country={country.name}/>
                  <button onClick={() => onClickShow(country)}>Show</button>  
                </div>
              )}
          </>
          
        )
      } else if (filterToShow.length == 0){
        
        console.log("0")
        return(
          <>
            no match
          </>
          
        )
      } else{
          const countryName = filterToShow[0].name.common
          const capital = filterToShow[0].capital[0]
          const area = filterToShow[0].area
          const language = filterToShow[0].languages
          const mappedlanguage = Object.values(language).map((name)=> {return name})
          console.log("LANGU",mappedlanguage)
          const flag = filterToShow[0].flags['png']
          setNewCapital(capital)

            return(
              <>
              <HandleCountry 
              name={countryName} 
              capital={newCapital} 
              area={area} 
              language={mappedlanguage} 
              flag={flag} 
              temp={newWeather.temp}
              wind={newWeather.wind}
              weather={newWeather.weather}
              />
              </>
            )
    

    } 
    }catch (error){

    }
  }


  const handleQuery = (event) => {
    console.log(event.target.value)

    setQuery(event.target.value.toLowerCase())
  }

  const onClickShow = (country) => {
    setQuery(country.name.common.toLowerCase())
    
  }



  return (
    <>
      <div>
        <CountiresForm newQuery={newQuery} handleCountries={handleQuery} />
      </div>
      <div>
        <Countries/>
      </div>
    </>
  )
}

export default App
