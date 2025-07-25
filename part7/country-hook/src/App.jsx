import React, { useState, useEffect } from 'react'
import countryService from './service/apistuff'
const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (!name) return

    const fetchCountry = async () => {
      try {
        const response = await countryService.getOneCountry(name)
        setCountry({
          name: name,
          capital: response.capital[0],
          population: response.population,
          flag: response.flags.png,
          found: true
        })
        console.log('Country fetched:', country)
      } catch (error) {
        console.error('Failed to fetch country:', error)
        setCountry(null)
      }
    }

    fetchCountry()
    console.log('useEffect ran for name:', name)
  }, [name])

  return country
}

const Country = ({ country }) => {
  console.log('inthere')
  console.log(country)
  if (!country) {

    return null
  }

  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.name} </h3>
      <div>capital {country.capital} </div>
      <div>population {country.population}</div> 
      <img src={country.flag} height='100' alt={`flag of ${country.name}`}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
    console.log(name)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App
