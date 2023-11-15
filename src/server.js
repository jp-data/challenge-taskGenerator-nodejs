// módulo interno do node
import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'



// criando o servidor
const server = http.createServer(async (req, res) => {

    // os 2 métodos de req
    const { method, url } = req
    // console.log(method, url)

    // 'await' para esperar o código rodar 
    await json(req, res)

    const route = routes.find(route => {
        return route.method === method && route.path.test(url)
    })

    if (route) {
        const routeParams = req.url.match(route.path)
        // console.log(extractQueryParams(routeParams.groups.query))


        const { query, ...params} = routeParams.groups

        req.params = params
        req.query = query ? extractQueryParams(query) : {}
        

        return route.handler(req, res)
    }

    return res.writeHead(404).end()
})

server.listen(3333)