const express = require('express');
const dotenv = require('dotenv');
const connectDb = require('./config/connectDb');
const ownerRoute = require('./routes/ownerRoute');
const businessRoute = require('./routes/businessRoute');
const cors = require('cors');

const app = express();

dotenv.config();
connectDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/owner', ownerRoute);
app.use('/api/business', businessRoute);


app.listen(process.env.PORT, ()=> console.log(`Server is running on localhost ${process.env.PORT}`))