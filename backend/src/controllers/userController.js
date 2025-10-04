import db from "../config/db.js";
import { hashPassword } from "../utils/crypto.js";

export const createUser = async (req, res) => {
  const { email, password, role, managerId } = req.body;
  const companyId = req.user.company_id;

  db.query("SELECT * FROM user WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length > 0) return res.status(409).json({ message: "Email exists" });

    const password_hash = await hashPassword(password);

    db.query(
      "INSERT INTO user (company_id, email, password, role, manager_id) VALUES (?, ?, ?, ?, ?)",
      [companyId, email, password_hash, role, managerId || null],
      (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ message: `${role} created`, userId: result.insertId });
      }
    );
  });
};
