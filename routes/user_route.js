import express from 'express'
import {
    getAllUser,
    getUserById,
    addUser,
    updateUser,
    deleteUser
} from '../controllers/user_controller.js'

import { authorize } from '../controllers/auth_controller.js'
import { IsAdmin } from '../middleware/role_validation.js'

const app = express()
app.use(express.json())

app.get('/', getAllUser)
app.get('/:id', getUserById)
app.post('/', authorize, IsAdmin, addUser)
app.put('/:id', authorize, IsAdmin, updateUser)
app.delete('/:id', authorize, IsAdmin, deleteUser)

export default app