import dotenv from 'dotenv'
dotenv.config()

/* eslint-disable */
import FIVE_DAY_FORECAST from './test-data/five-day-forecast'
import express from 'express'
import cors from 'cors'
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
  return res.json(FIVE_DAY_FORECAST)
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
