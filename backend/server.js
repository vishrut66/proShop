import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import morgan from 'morgan';

import errorHandel from './middleware/errorHandel.js';

import productRoute from './routes/productRoute.js'
import userRoute from "./routes/userRoute.js"
import orderRoute from "./routes/orderRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"

dotenv.config();

const app = express();

app.use(express.json());

// app.get("/", (req, res) => {
//     res.send("api is runnig...")
// })

app.use('/api/v1/products', productRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/orders', orderRoute);
app.use('/api/v1/upload', uploadRoutes);

app.get('/api/v1/config/paypal', (req, res) =>
    res.send(process.env.PAYPAL_CLIENT_ID)
)

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// if (process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'));
// }

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')))

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    )
} else {
    app.get('/', (req, res) => {
        res.send('API is running....')
    })
}

// globel error handel middleware
app.use(errorHandel);

const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.PASSWORD
);

mongoose.set('strictQuery', false);
mongoose.connect(DB).then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 5000
app.listen(port, console.log(`server is runnig on port ${port}...`))