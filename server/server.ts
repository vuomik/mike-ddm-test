import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

dotenv.config()

const EXIT_FAILURE = 1

process.on('uncaughtException', (err, origin) => {
  /* eslint-disable-next-line no-console -- Errors go to logs */
  console.error('Unhandled Exception:', err)
  /* eslint-disable-next-line no-console -- Errors go to logs */
  console.error('Exception Origin:', origin)
  process.exit(EXIT_FAILURE)
})

process.on('unhandledRejection', (reason, promise) => {
  /* eslint-disable-next-line no-console -- Errors go to logs */
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(EXIT_FAILURE)
})

async function createServer(): Promise<void> {
  const app = express()

  app.use(express.json())

  app.get('/', (req, res) => res.send('Hello DDM!'))

  if (process.env.NODE_ENV === 'production') {
    const fileName = fileURLToPath(import.meta.url)
    const dirName = path.dirname(fileName)

    app.use(express.static(path.join(dirName, '../client')))
  } else {
    const { createServer: createViteServer } = await import('vite')
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    })
    app.use(vite.middlewares)
  }

  /* eslint-disable-next-line  @typescript-eslint/no-non-null-assertion -- Required in .env file to run */
  const port = parseInt(process.env.PORT!, 10)
  app.listen(port, '0.0.0.0', () => {
    /* eslint-disable-next-line no-console -- Errors go to logs */
    console.log(`App running on ${port}`)
  })
}

await createServer()
