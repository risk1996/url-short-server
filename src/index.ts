import express from 'express'
import fs from 'fs'

const app = express()

app.get('/', (req, res) => {
  try {
    const responseBody = { greetings: 'Hello, World!' }
    res.status(200)
    res.send(responseBody)
  } catch {
    res.status(500)
    res.send({ error: 'Server Error' })
  }
})

app.get('/about', (req, res) => {
  fs.readFile('src/pages/about.html', null, (err, fileContent) => {
    if (err) {
      res.status(404)
      res.send({ error: 'File not found' })
    } else {
      res.set('Content-Type', 'text/html')
      res.status(200)
      res.send(fileContent)
    }
  })
})

app.listen(8000)
