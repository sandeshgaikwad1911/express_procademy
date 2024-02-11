import dotenv from 'dotenv';
dotenv.config();

export const {
    PORT, Mongo_Url, Node_Env, Jwt_Secret, Login_Expires,
    Email_userName, Email_password, Email_host, Email_port
} = process.env;