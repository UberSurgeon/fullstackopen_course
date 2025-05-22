import { useState } from 'react'


const RenderNumber = ({person}) => {
  return(
    
    <>
      {person.name} {person.number}
    </>
  )
}

const HandleListFiltered = ({person}) => {
  console.log(person)
  return(
    <>
      <RenderNumber person={person}/>
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

const Persons = ({showALL, persons}) => {
    const filterToShow = showALL === '' 
    ? persons
    : persons.filter(person => person.name.includes(showALL))
    return(
      <>
        {filterToShow.map(person =>
          <div key={person.name}><HandleListFiltered person={person} /></div>

        )}
      </>
    )

}


const App = () => {
  const [persons, setPersons] = useState(
    [
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]
  ) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [showALL, setNewShowAll]= useState('')

  const addPb = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)){
      alert(`${newName} is already added to phonebook`)
    }else {
      const newPerson = {name: newName, number: newPhone}
      setPersons(persons.concat(newPerson))
      console.log("list", persons)

      setNewName('')
      setNewPhone('')
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
    <Persons showALL={showALL} persons={persons}/>
  </div>
  )
}

export default App