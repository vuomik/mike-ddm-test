import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { StatusCodes } from 'http-status-codes'
import type { EntryServer } from '@/entry-server'

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

  if (process.env.NODE_ENV === 'production') {
    const fileName = fileURLToPath(import.meta.url)
    const dirName = path.dirname(fileName)
    const root = path.resolve(dirName, '..')

    const template = fs.readFileSync(
      path.resolve(root, 'client/index.html'),
      'utf-8'
    )

    /* eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- The function signature is safe */
    const { render } = (await import(
      path.resolve(root, 'ssr/entry-server.js')
    )) as EntryServer

    app.use(express.static(path.join(dirName, '../client')))

    app.get('*', async (req, res) => {
      try {
        const html = await render()
        const finalHtml = template.replace(`<!--app-html-->`, html)
        res
          .status(StatusCodes.OK)
          .set({ 'Content-Type': 'text/html' })
          .end(finalHtml)
      } catch (e: unknown) {
        /* eslint-disable-next-line no-console -- Errors go to logs */
        console.error(`SSR error: ${e instanceof Error ? e.message : ''}`, e)
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .end('Internal Server Error')
      }
    })
  } else {
    const { createServer: createViteServer } = await import('vite')
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    })
    app.use(vite.middlewares)

    app.get('*', async (req, res) => {
      try {
        const { originalUrl: url } = req
        const template = fs.readFileSync(path.resolve('index.html'), 'utf-8')
        const transformedTemplate = await vite.transformIndexHtml(url, template)

        /* eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Force the any parameter to be allowed since we know what it is */
        const { render } = (await vite.ssrLoadModule(
          '/src/entry-server.ts'
        )) as EntryServer

        const html = await render()
        res
          .status(StatusCodes.OK)
          .set({ 'Content-Type': 'text/html' })
          .end(transformedTemplate.replace(`<!--app-html-->`, html))
      } catch (e: unknown) {
        if (e instanceof Error) {
          vite.ssrFixStacktrace(e)
          /* eslint-disable-next-line no-console -- Errors go to logs */
          console.error(`Vite error: ${e.message}`)
        }
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .end('Internal Server Error')
      }
    })
  }

  /* eslint-disable-next-line  @typescript-eslint/no-non-null-assertion -- Required in .env file to run */
  const port = parseInt(process.env.PORT!, 10)
  app.listen(port, '0.0.0.0', () => {
    /* eslint-disable-next-line no-console -- Errors go to logs */
    console.log(`App running on ${port}`)
  })
}

await createServer()
