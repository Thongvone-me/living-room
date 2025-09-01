
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT;
const HOST = process.env.HOST;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE;
const SECRET_KEY = process.env.SECRET_KEY;
const SECRET_KEY_REFRESH = process.env.SECRET_KEY_REFRESH;

export {
    PORT,
    HOST,
    USER,
    PASSWORD,
    DATABASE,
    SECRET_KEY,
    SECRET_KEY_REFRESH
};