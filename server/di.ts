import { container } from 'tsyringe'
import {
  Client as GoodReadsClient,
  type ClientConfig as GoodReadsClientConfig,
} from './lib/goodreads/client'
import { Repository as GoodReadsRepository } from './lib/goodreads/repository'

container.register<GoodReadsClient>(GoodReadsClient, {
  useFactory: (c) => {
    const config = c.resolve<GoodReadsClientConfig>('GoodReadsClientConfig')
    return new GoodReadsClient(config)
  },
})

container.register<GoodReadsClientConfig>('GoodReadsClientConfig', {
  useValue: {
    /* eslint-disable-next-line  @typescript-eslint/no-non-null-assertion -- Required in .env file to run */
    apiKey: process.env.GOODREADS_KEY!,
    baseUrl: 'https://www.goodreads.com',
  },
})

container.registerSingleton(GoodReadsRepository)
