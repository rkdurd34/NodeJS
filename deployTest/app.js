
const express = require('express')

const app = express()


app.get('/', (req, res) => {
  res.send('hooah')
})



const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`server on port ${PORT}`))