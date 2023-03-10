import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

interface WeatherData {
  dt: number
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    sea_level: number
    grnd_level: number
    humidity: number

    temp_kf: number
  }
  weather: [
    {
      id: number
      main:
        | 'Clouds'
        | 'Clear'
        | 'Rain'
        | 'Snow'
        | 'Drizzle'
        | 'Thunderstorm'
        | 'Mist'
        | 'Smoke'
        | 'Haze'
        | 'Dust'
        | 'Fog'
        | 'Sand'
        | 'Ash'
        | 'Squall'
        | 'Tornado'
      description: string
      icon: string
    }
  ]
  clouds: {
    all: number
  }
  wind: {
    speed: number
    deg: number
    gust: number
  }
  visibility: number
  pop: number
  sys: {
    pod: string
  }
  dt_txt: string
}

function App() {
  const [forecast, setForecast] = useState<null | { list: WeatherData[] }>(null)

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
      console.log(data.list.length)
    })
  }, [])

  const days: WeatherData[][] = forecast
    ? [0, 8, 16, 24, 32].map((i) => forecast.list.slice(i, i + 8))
    : []

  console.log('days', days)

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-700">
      <header className="bg-slate-100 p-4 text-lg">Weather Application</header>

      <main className="container mx-auto my-4 md:my-8 lg:my-12 flex-1">
        {forecast && (
          <div className="grid grid-cols-6 grid-rows-5 grid-flow-col">
            <div className="bg-slate-100 p-1">Day</div>
            <div className="bg-slate-100 p-1">Mean</div>
            <div className="bg-slate-100 p-1">Median</div>
            <div className="bg-slate-100 p-1">Max</div>
            <div className="bg-slate-100 p-1">Min</div>

            {days
              .map((day, i) => {
                const dayName = new Date(day[0].dt * 1000).toLocaleDateString(
                  'en-US',
                  { weekday: 'long' }
                )

                const mean =
                  day.reduce((acc, curr) => {
                    return acc + curr.main.temp
                  }, 0) / day.length
                const median = (day[3].main.temp + day[4].main.temp) / 2
                const min = Math.min(...day.map((day) => day.main.temp))
                const max = Math.max(...day.map((day) => day.main.temp))

                return [
                  <div className="bg-slate-100 p-1">
                    {i === 0 ? 'Today' : dayName}
                  </div>,
                  <div className="bg-slate-200 p-1">
                    {Math.round(mean)}
                    {'\u00B0'}
                  </div>,
                  <div className="bg-slate-200 p-1">
                    {Math.round(median)}
                    {'\u00B0'}
                  </div>,
                  <div className="bg-slate-200 p-1">
                    {Math.round(min)}
                    {'\u00B0'}
                  </div>,
                  <div className="bg-slate-200 p-1">
                    {Math.round(max)}
                    {'\u00B0'}
                  </div>,
                ]
              })
              .flat()}
          </div>
          // <pre className="text-slate-100">
          //   {JSON.stringify(forecast, null, 2)}
          // </pre>
        )}
      </main>
      <footer className="bg-slate-400 flex justify-center">
        <p className="text-slate-100 py-1">© 2021 Weather Application</p>
      </footer>
    </div>
  )
}

export default App
