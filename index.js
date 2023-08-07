const express = require("express")
const uuid = require("uuid")
const port = 3000

const app = express()
app.use(express.json())

// Query params => MediaQueryListEvent.com/users?nome=rodolfo&age=28 // FILTROS
// Route params => /users/2  //BUSCAR, DELETAR OU ATUALIZAR ALGO ESPECÍFICO
// Request Body => {"name":"Rodolfo", "age":28}

// Middleware => INTERCEPTOR => Tem o poder de para ou alterar dados da requisição 

const users = []
app.get("/users", (request, response) => {
    
    return response.json(users)
})

app.post("/users", (request, response) => {
    const {name, age} = request.body

    const user = {id:uuid.v4(), name, age}

    users.push(user)

    return response.status(201).json(user)
})

const checkUserIdMiddleware = ("/users/:id", (request, response, next) => {
    const {id} = request.params
    const findIndex = users.findIndex(user => user.id === id)

    if (findIndex < 0 ) {
        return response.status(404).json({error:"User not Found"})
    }

    request.getUserIndex = findIndex
    request.getUserId = id

    next()
})

app.put("/users/:id", checkUserIdMiddleware, (request, response) => {

    const id = request.getUserId
    const {name, age} = request.body
    const userUpdate = {id, name, age}
    
    users[request.getUserIndex] = userUpdate

    return response.json(userUpdate)
})

app.delete("/users/:id", checkUserIdMiddleware, (request, response) => {
    
    users.splice(request.getUserIndex, 1)

    return response.status(204).json()

})



app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`)
})