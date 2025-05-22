const Header = (props) => <h2>{props.course}</h2>

const Content = ({parts}) => {
    // const result = parts.map(part => part.exercises)
    // console.log(result)
    return(
        <>
        {parts.map(part => <li key={part.id}> <Part part={part} /></li>)}
        </>
    )
}

const Total = ({exercises}) => {
    const exercisesArray = exercises.map(part => part.exercises)
    const initialValue = 0
    const total = exercisesArray.reduce((accumulator, currentValue) => accumulator + currentValue, initialValue,);
    // console.log(total)
    return(
        <>
        <b>total of {total} exercises</b>
        </>
        )
    }

const Part = ({part}) => (
  <p>
    {part.name} {part.exercises}
  </p>
)

const ListHandler = ({courses}) => {
    let lelist = []
    for (let i=0; i < courses.length; i++) {
        lelist = lelist.concat(<div key={i+1}><Constructor idx={i} courses={courses}/></div>)
    }
    // console.log(lelist)
    // console.log("work")
    return(
        <>
            {lelist}
        </>
    )
}

const Constructor = ({idx, courses}) => {
    return(
        <>
            <Header course={courses[idx].name} />
            <Content parts={courses[idx].parts} />
            <Total exercises={courses[idx].parts} />
        </>
    )
}

const Course = ({courses}) => {

    // console.log(courses.length)
    return (
    <div>
        <h1>Web development curriculum</h1>
        <ListHandler courses={courses}/>
    </div>
    )
}

export default Course