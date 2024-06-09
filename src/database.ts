// database.ts
import { Pool } from 'pg';
import * as config from './config';

const pool = new Pool({
    user: config.DB_USER,
    host: config.DB_HOST,
    database: config.DB_NAME,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
});

export const query = (text: string, params: any[]) => pool.query(text, params);