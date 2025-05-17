import { useState } from 'react'

const Button = ({onClick, text}) => {
  return (
    <>
      <button onClick={onClick}>
        {text}
      </button>
    </>
  )
}

const StatisticLine = ({text, value}) => {
  if (text == "positive"){
    return(
      <tr>
        <td>{text}</td> 
        <td>{value}%</td>
      </tr>
    )
  } else{
    return(
    <tr>
        <td>{text}</td> 
        <td>{value}</td>
    </tr>
    )
  }
}

const Statistic = ({good, bad, neutral}) => {
  const all = good + neutral + bad
  const avg = (good + (bad)*-1) / all
  const pos = (good/all) * 100
  if(all == 0){
    return(
      <div>
        <h2>No feedback given</h2>
      </div>
    )
  } else{
    return(
      <div>
        <table>
          <tbody>
          <StatisticLine text="good" value={good}/>
          <StatisticLine text="neutral" value={neutral}/>
          <StatisticLine text="bad" value={bad}/>
          <StatisticLine text="all" value={all}/>
          <StatisticLine text="average" value={avg}/>
          <StatisticLine text="positive" value={pos}/>
          </tbody>
        </table>
      </div>
    )
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  

  const selectGoodReview = () =>{setGood(good + 1)}
  const selectBadReview = () =>{setBad(bad + 1)}
  const selectNeutralReview = () =>{setNeutral(neutral + 1)}


  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={selectGoodReview} text={'Good'}/>
      <Button onClick={selectNeutralReview} text={'Neutral'}/>
      <Button onClick={selectBadReview} text={'Bad'}/>
      <h1>statistics</h1>
      <Statistic good={good} bad={bad} neutral={neutral} />
    </div>
  )
}

export default App