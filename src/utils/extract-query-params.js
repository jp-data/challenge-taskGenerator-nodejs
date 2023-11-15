export function extractQueryParams(query) {
    // deletando o primeiro caractere vazio e separando a url pelo em comercial
    return query.substr(1).split('&').reduce((queryParams, param) => {
        const [key, value] = param.split('=')

        queryParams[key] = value

        return queryParams
    }, {})
}