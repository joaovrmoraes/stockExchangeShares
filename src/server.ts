import { fastify } from 'fastify'
import puppeteer from 'puppeteer'

const server = fastify()

server.get('/', async (request, reply) => {

    const { stock, stockExchange } = request.query as any

    let stockExchangeSharesData // declare pageContent outside of the async function

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(`https://www.google.com/finance/quote/${stock}:${stockExchange}`)

    stockExchangeSharesData = await page.evaluate(() => {
        const name = document.querySelector('.zzDege')
        return {
            name: name?.innerHTML
        }
    })

    await browser.close()


    reply.code(200).send({ stockExchangeSharesData })
})

server.listen({ port: 3000 }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})