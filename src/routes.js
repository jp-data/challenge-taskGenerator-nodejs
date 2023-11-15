import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'
// módulo p/ criação de ids
import { randomUUID } from 'node:crypto'

const database = new Database

export const routes = [
    {   // listagem de tarefas
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const tasks = database.select('tasks')
            return res.end(JSON.stringify(tasks))
        }

    },
    // criação de tarefas
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: ( req, res ) => {
            const { title, description } = req.body

            // validação dos campos preenchidos
            if (!title) {
                return res.writeHead(400).end(
                    JSON.stringify({ message: 'Title is required'})
                )
            }

            if (!description) {
                return res.writeHead(400).end(
                    JSON.stringify({ message: 'Description is required'})
                )
            }

            // envio dos dados
            const task = {
                id: randomUUID(),
                title,
                description, 
                completed_at: null,
                created_at: new Date(),
                updated_at: null,
            }


            database.insert('tasks', task)

            return res.writeHead(201).end()

        }
    },
    // atualização de tarefas
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body 

            if ( !title || !description ) {
                return res.writeHead(400).end(
                    JSON.stringify({ message: 'Title or description is required'})
                )
            }

            // buscando a tarefa pelo id informado
            const [task] = database.select('tasks', { id })
            // caso não encontre a rota, retorna um erro
            if (!task) {
                return res.writeHead(404).end()
            }
            // atualiza a tarefa
            database.update('tasks', id, {
                title,
                description,
                updated_at: new Date()
            })

            return res.writeHead(204).end()
        }
    },
    // deletar uma tarefa
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            database.delete('tasks', id)

            return res.writeHead(204).end()
        }
    },

    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params
            console.log(id)
            const [ task ] = database.select('tasks', { id })
            console.log(task)

            if (!task) {
                return res.writeHead(404).end()
            }

            // verificando se 'completed_at' existe 
            const isTaskCompleted = !!task.completed_at
            // se não existir será 'null' por padrão e o campo receberá a data atual
            const completed_at = isTaskCompleted ? null : new Date() 

            database.update('tasks', id, { completed_at })

            return res.writeHead(204).end()
        }
    }
]