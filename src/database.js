import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)


export class Database {

    #database = {}

    // configurações do DB
    constructor() {
        fs.readFile(databasePath, 'utf-8')
            .then(data => {
                this.#database = JSON.parse(data)
            })
            .catch(() => {
                this.#persist()
            })
    }

    // método que escreve o DB em um arquivo físico
    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }


    // método para listar as tarefas
    select(table, search) {
        let data = this.#database[table] ?? []

        if (search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    if (!value) return true

                    return row[key].includes(value)
                })
            })
        }

        return data
    }

    // método para inserir dados na tabela
    insert(table, data) {
        // se existir um array na tabela
        if (Array.isArray(this.#database[table])) {
            // inserimos esse dado na tabela
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }
        this.#persist()

        return data
    }

    update(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id == id)

        if (rowIndex > -1){
            const row = this.#database[table][rowIndex]
            // acessa na tabela o indice buscado e altera os valores correspontes
            this.#database[table][rowIndex] = {id, ...row, ...data}
            // salva o db com o dado atualizado
            this.#persist()
        }
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)
        if(rowIndex > -1) {
            // remove a linha da tabela com o método splice
            this.#database[table].splice(rowIndex, 1)
            this.#persist
        }
    }
}