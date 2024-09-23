import { sql } from "../database/database.js";

const saveMessage = async (sender, message) => {
    try {
        await sql`INSERT INTO messages (sender, message)
            VALUES (${ sender }, ${ message });`;
    } catch (e) {
        console.log(e);
    }
};

const getFiveRecentMessages = async () => {
    try {
        return await sql`SELECT * FROM messages
            ORDER BY id DESC LIMIT 5;`;
    } catch (e) {
        console.log(e);
    }
};

export { saveMessage, getFiveRecentMessages }; 
