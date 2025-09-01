
import mysql from "mysql";
import { HOST, USER, PASSWORD, DATABASE } from "./globalkey.js";

export const connetionDatabase = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE
});

connetionDatabase.connect((err) => {
    if (err) {
        console.log("Error connecting to database:", err);
    } else {
        console.log("Connection to database was successful");
    }
});
