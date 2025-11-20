import dotenv from "dotenv";
dotenv.config();

import { connectMongoose } from "./config/db.config.js";
import { server } from "./server.js";

const PORT = process.env.PORT || 4500;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectMongoose();
})