require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/connection');
const routes = require('./routes');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded());
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}
app.use(routes);



async function startServer() {
    try {
        await connectDB()
        app.listen(PORT, () => {
            console.log(`Server is running http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error("Database connection failed", error)
        process.exit(1)
    }
}
startServer()
