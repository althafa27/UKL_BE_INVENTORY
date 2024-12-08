import express from 'express'
import {
   getAllPeminjaman,
   getPeminjamanById,
   addPeminjaman,
   pengembalianBarang
} from '../controllers/transaksi_controller.js'

import {authorize} from '../controllers/auth_controller.js'
import {IsMember, IsAdmin} from '../middleware/role_validation.js'

const app = express()


app.get('/borrow', authorize, IsAdmin, getAllPeminjaman)
app.get('/borrow/:id', authorize,IsAdmin, getPeminjamanById)
app.post('/borrow', authorize, IsMember, addPeminjaman)
app.post('/return', authorize, IsMember, pengembalianBarang)

export default app