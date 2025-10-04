import db from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "../utils/crypto.js";
import { sendPasswordEmail } from "../utils/email.js";

export const createUser = async (req, res) => {
    try {
        const { username, email, role, manager_id, company_id } = req.body;

        // Validate required fields
        if (!username || !email || !role || !company_id) {
            return res.status(400).json({ message: "Name, Email, role, and company_id are required." });
        }

        // Check if company exists
        const [companyRows] = await db.execute(
            "SELECT company_id FROM Companies WHERE company_id = ?",
            [company_id]
        );
        if (companyRows.length === 0) {
            return res.status(400).json({ message: "Company does not exist." });
        }

        // If manager_id is provided, check if it exists
        let userManagerId = null;
        if (manager_id && manager_id !== "NULL") {
            const [managerRows] = await db.execute(
                "SELECT user_id FROM Users WHERE user_id = ?",
                [manager_id]
            );
            if (managerRows.length === 0) {
                return res.status(400).json({ message: "Manager ID does not exist." });
            }
            userManagerId = manager_id;
        }

        // Generate temp password
        const tempPassword = Math.random().toString(36).slice(-8);
        const password = await hashPassword(tempPassword);
        const userId = uuidv4();

        // Insert user
        await db.execute(
            `INSERT INTO Users 
            (user_id, name, company_id, email, password, role, manager_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userId, username, company_id, email, password, role, userManagerId]
        );

        // Send password via email
        //await sendPasswordEmail(email, tempPassword);

        console.log("Generated password for user:", tempPassword);

        res.status(201).json({ 
            message: "User created and password sent via email", 
            user_id: userId 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT u.user_id, u.email, u.role, CONCAT(m.email) as manager_email
             FROM Users u
             LEFT JOIN Users m ON u.manager_id = m.user_id
             WHERE u.company_id = ?`,
            [req.user.company_id]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
