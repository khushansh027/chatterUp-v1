import dotenv from 'dotenv';
dotenv.config();

import { connectMongoose } from './config/db.config.js';
import { server } from './server.js';

// Use the PORT from .env or default to 4500
const PORT = process.env.PORT || 4500;

// Start the server and connect to the database
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // Call the function to connect to the database
    connectMongoose();
});