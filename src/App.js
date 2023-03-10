import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [forecast, setForecast] = useState(null)

  async function getForecast() {
    const response = await axios.get(
      `http://localhost:${process.env.REACT_APP_API_PORT}/forecast`
    )
    console.log('response', response)
    return response.data
  }

  useEffect(() => {
    getForecast().then((data) => {
      setForecast(data)
    })
  }, [])

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-700">
      <header className="bg-slate-100 p-4 text-lg">Weather Application</header>

      <main className="container mx-auto my-4 md:my-8 lg:my-12 flex-1">
        {forecast && (
          <pre className="text-slate-100">
            {JSON.stringify(forecast, null, 2)}
          </pre>
        )}
      </main>
      <footer className="bg-slate-400 flex justify-center">
        <p className="text-slate-100 py-1">© 2021 Weather Application</p>
      </footer>
    </div>
  )
}

export default App
