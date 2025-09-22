import express from "express";
import { PORT } from "./source/configuration/globalkeys.js";
import "./source/configuration/databaseConnection.js";
import cors from 'cors';
import route from "./source/routes/routes.js";
import rateLimit from 'express-rate-limit';

const app = express();
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 20 
});

app.use(cors({
  origin: ['http://localhost:5173'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", route);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
