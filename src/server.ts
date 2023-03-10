import dotenv from 'dotenv'
dotenv.config()

/* eslint-disable */
import FIVE_DAY_FORECAST from './test-data/five-day-forecast'
import express from 'express'
import cors from 'cors'
import axios from 'axios'
/* eslint-enable */

const app = express()
if (!process.env.API_PORT) throw new Error('Set API_PORT in .env file')

const port = parseInt(process.env.API_PORT as string)
const dev = process.env.NODE_ENV === 'development'
console.log('Running server in mode:', dev ? 'development' : 'production')

if (dev) {
  app.use(cors())
}

app.use(express.json())

app.get('/ping', (req, res) => {
  res.send('pong')
})

app.get('/forecast', async (req, res) => {
  try {
    const location = req.query.location
    if (typeof location !== 'string') {
      return res.status(400).json({ error: 'Bad request' })
    }

    const locationResp = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${process.env.OPEN_WEATHER_API_KEY}`
    )

    const { lat, lon } = locationResp.data[0]

    const resp = await axios.get(
      `http://api.openweathermap.org/data/2.5/forecast?units=metric&lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}`
    )
    return res.json(resp.data)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
