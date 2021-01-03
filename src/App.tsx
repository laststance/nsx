import React, { useEffect } from 'react'
import axios from 'axios'
import logo from './logo.svg'
import './App.css'

const App: React.FC = () => {
  useEffect(() => {
    async function fetchPosts() {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/posts`)
    }
    fetchPosts()
  })

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
