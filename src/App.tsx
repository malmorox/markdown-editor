import { useState } from 'react'
import ReactMarkdown from "react-markdown";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


function App() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    setCount(count+1)
  }

  const markdownText = `
  # Ejemplo

  - Algo de texto
  - Algo más texto

  ## Subtitulo

  ### Información adicional

  Esto es un [link](https://github.com/remarkjs/react-markdown)
  `;

  return (
    <>
      <h1> Hola mundo </h1>
      <button onClick={handleClick}>Pulsa</button>
      <span>{count}</span>
      <ReactMarkdown>{markdownText}</ReactMarkdown>
    </>
  )
}

export default App
