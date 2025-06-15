import app from './app.js'
import config from './utils/config.js'
import logger from './utils/logger.js'
const PORT = config.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
