import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    setCount(count+1)
  }

  return (
    <>
      <h1> Hola mundo </h1>
      <button onClick={handleClick}>Pulsa</button>
      <span>{count}</span>
    </>
  )
}

export default App
