import React, { useEffect, useState } from 'react'
import axios from 'axios'
import classNames from 'classnames'
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

  const allDays = days.flat()

  const dayColor = '#b3e7ff'
  const nightColor = '#005780'

  const largeScreen = window.innerWidth > 768
  const fadeDirection = largeScreen ? 'to bottom' : 'to right'
  const daysDirectionGrid = largeScreen ? 'to right' : 'to bottom'

  const customBackgroundStyle =
    `linear-gradient(${fadeDirection}, ${nightColor} 0%, ${nightColor}44 25%, rgba(0, 0, 0, 0) 50%, ${nightColor}44 75%, ${nightColor}) 75%, ` +
    `linear-gradient(${daysDirectionGrid}, ${allDays
      .reduce((acc, d, index) => {
        const isSunUp = d.sys.pod === 'd'
        if (index === 0) {
          acc.push((isSunUp ? dayColor : nightColor) + ' 0%')
          return acc
        }

        const prev = allDays[index - 1]
        if (prev && prev.sys.pod !== d.sys.pod) {
          acc.push(
            (isSunUp ? dayColor : nightColor) +
              ' ' +
              (index / allDays.length) * 100 +
              '%'
          )
        }
        return acc
      }, [] as string[])
      .join(', ')})`
  console.log('customBackgroundStyle', customBackgroundStyle)

  // linear-gradient(to bottom right, rgba(0, 0, 0, 0.5) 0%, rgba(255, 255, 255, 0.5) 100%),

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-700">
      <header className="bg-slate-100 p-4 text-lg">Weather Application</header>

      <main className="container mx-auto my-4 md:my-8 lg:my-12 flex-1 text-xs p-2 md:text-base md:font-semibold">
        {forecast && (
          <div
            className="grid grid-rows-6 grid-cols-6 grid-flow-row md:grid-flow-col forecast-grid h-56 md:h-auto bg-slate-200"
            style={{
              background: largeScreen ? customBackgroundStyle : undefined,
            }}
          >
            <div className="bg-slate-100 p-1 font-bold relative z-10">Day</div>
            <div className="bg-slate-100 p-1 font-bold z-10 relative">Mean</div>
            <div className="bg-slate-100 p-1 font-bold">Median</div>
            <div className="bg-slate-100 p-1 font-bold">Max</div>
            <div className="bg-slate-100 p-1 font-bold">Min</div>
            <div className="bg-slate-100 p-1 font-bold">Weather</div>

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
                const min = Math.min(...day.map((d) => d.main.temp))
                const max = Math.max(...day.map((d) => d.main.temp))

                return [
                  <div className="bg-slate-100 p-1 font-bold shadow-md">
                    {i === 0 ? 'Today' : dayName}
                  </div>,
                  <div className="p-1">
                    {Math.round(mean)}
                    {'\u00B0'}
                  </div>,
                  <div className="p-1">
                    {Math.round(median)}
                    {'\u00B0'}
                  </div>,
                  <div className="p-1">
                    {Math.round(min)}
                    {'\u00B0'}
                  </div>,
                  <div className="p-1">
                    {Math.round(max)}
                    {'\u00B0'}
                  </div>,
                  <div className="bg-slate-300 shadow-md p-1 flex items-start">
                    {day.map((d, i) => (
                      <img
                        src={`http://openweathermap.org/img/wn/${d.weather[0].icon}.png`}
                        alt={d.weather[0].description}
                        className={classNames('w-4 lg:w-7', {
                          'hidden lg:inline-block': i % 2 === 0,
                        })}
                        key={i}
                      />
                    ))}
                  </div>,
                ]
              })
              .flat()
              .map((e, i) => {
                return {
                  ...e,
                  key: i,
                }
              })}
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
