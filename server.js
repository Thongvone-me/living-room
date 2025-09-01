
import express from "express";
import { PORT } from "./source/configuration/globalkey.js";
import "./source/configuration/connect_database.js";
import route from "./source/routes/routes.js";

const server = express();

// Middleware
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/api", route);

server.listen(PORT, () => {
  console.log(`Server is running on port ${`http://localhost:${PORT}`}`);
});