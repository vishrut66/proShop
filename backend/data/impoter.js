import dotenv from 'dotenv'
import mongoose from 'mongoose';
import users from './users.js';
import products from './products.js';
import User from '../models/userModel.js'
import Product from "../models/productModel.js"
import Order from "../models/orderModel.js"



dotenv.config();

const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.PASSWORD
);


mongoose.set('strictQuery', false);
mongoose.connect(DB).then(() => console.log('DB connection successful!'));

// READ JSON FILE
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
// const product = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
// const reviews = JSON.parse(
//     fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
// );

// IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Product.create(products);
        // await User.create(users, { validateBeforeSave: false });
        console.log('Data successfully loaded!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();
        console.log('Data successfully deleted!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
