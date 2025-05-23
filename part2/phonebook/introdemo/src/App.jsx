import { useState, useEffect } from 'react'
import axios from 'axios'
import service from './service/backend'

const RenderNumber = ({person}) => {
  return(
    
    <>
      {person.name} {person.number}
    </>
  )
}

const HandleListFiltered = ({person, onClick, id}) => {
  console.log(person)
  return(
    <>
      <RenderNumber person={person}/>
      <button onClick={() => onClick(id)}>delete</button>
    </>
  )
}



const Filter = ({showALL, handleFilter}) => {
  return(
    <>
      filter shown with <input value={showALL} onChange={handleFilter}/>
    </>
  )
}

const PersonForm = ({newName, newPhone, handlePerson, handlePhone, addPb}) => {
  return(
    <>
    <form>
      <div>
      name: <input value={newName} onChange={handlePerson}/>
      </div>
      <div>
      phone: <input value={newPhone} onChange={handlePhone}/>
      </div>
      <div>
      <button onClick={addPb} type="submit">add</button>
      </div>
    </form>
    </>
  )
}

const Persons = ({showALL, persons, OnDelete}) => {
    const filterToShow = showALL === '' 
    ? persons
    : persons.filter(person => person.name.includes(showALL))
    return(
      <>
        {filterToShow.map(person =>
          <div key={person.name}><HandleListFiltered person={person} id={person.id} onClick={OnDelete} /></div>

        )}
      </>
    )

}




const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [showALL, setNewShowAll]= useState('')

  useEffect(()=> {
    service
      .getAll()
      .then(initialNotes =>{
        setPersons(initialNotes)
      })
  }, [])

  const addPb = (event) => {
    event.preventDefault()
    const newPerson = {name: newName, number: newPhone}
    if (persons.some(person => person.name === newName)){
      if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const match = persons.find(person=> person.name === newName)
        service
          .update(match.id, newPerson)
          .then(returnedNote => {
            setPersons(persons.map(person => person.id === match.id ? returnedNote : person))
            console.log('UPDATE', match)
            setNewName('')
            setNewPhone('')
          })
      } else {
        alert(`${newName} is already added to phonebook`)
      }

    }else {
      service
        .create(newPerson)
        .then(returnedNote => {
          setPersons(persons.concat(returnedNote))
          setNewName('')
          setNewPhone('')
        })
    }
  }

  const OnDelete = (id) => {
  const updatePerson = persons.find(n => n.id === id)
  if (confirm(`Delete ${updatePerson.name} ?`)){
    console.log('DELETEING', id)
    console.log('DELETEING', updatePerson)
    service
      .itemdelete(id, updatePerson)
      .then(returnedPerson => {
        setPersons(persons.filter(n => n.id !== id))
      })
      .catch(error =>{
        alert(`the note '${updatePerson}' was already deleted from server`)
      })
  }
}

  const handlePerson = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handlePhone = (event) => {
    console.log(event.target.value)
    setNewPhone(event.target.value)
  }

  const handleFilter = (event) => {
    console.log(event.target.value)
    setNewShowAll(event.target.value)
  }

  const filterToShow = showALL === '' 
    ? persons
    : persons.filter(person => person.name.includes(showALL))

  return (
    <div>
    <h2>Phonebook</h2>
    <Filter showAll={showALL} handleFilter={handleFilter}/>

    <h3>Add a new</h3>
    <PersonForm 
      newName={newName} 
      newPhone={newPhone} 
      handlePerson={handlePerson} 
      handlePhone={handlePhone} 
      addPb={addPb}
    />

    <h3>Numbers</h3>
    <Persons showALL={showALL} persons={persons} OnDelete={OnDelete}/>
  </div>
  )
}

export default App