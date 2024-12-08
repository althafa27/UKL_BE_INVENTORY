import Express from "express"
import dotenv from "dotenv"

import inventoryRoute from "./routes/inventory_route.js"
import userRoute from "./routes/user_route.js"
import authRoute from "./routes/auth_route.js"
import transaksiRoute from "./routes/transaksi_route.js"

const app = Express()

dotenv.config()
app.use(Express.json())

app.use('/api/inventory', inventoryRoute)
app.use('/api/user', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/transaksi',transaksiRoute)

app.listen(process.env.APP_PORT, () => {
    console.log(`server run on port `+ process.env.APP_PORT);
})