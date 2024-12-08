import express from "express"
import { addInventory,
        updateInventory,
        getInventoryById,
        deleteInventory,
        getAllInventory
 } from "../controllers/inventory_controller.js"
 import { usageReport } from "../controllers/transaksi_controller.js"

 import { authorize } from "../controllers/auth_controller.js"
 import { IsAdmin } from "../middleware/role_validation.js"
const app = express()

app.post('/',authorize, IsAdmin, addInventory)
app.put('/:id', authorize, IsAdmin,updateInventory)
app.get('/:id', authorize, IsAdmin,getInventoryById)
app.delete('/:id',authorize, IsAdmin, deleteInventory)
app.get('/',authorize, IsAdmin, getAllInventory)
app.post('/usage-report', authorize, IsAdmin, usageReport)

export default app