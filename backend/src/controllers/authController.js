import db from "../config/db.js";
import { hashPassword, generateToken, comparePassword } from "../utils/crypto.js";
import { v4 as uuidv4 } from "uuid";

export const signup = async (req, res) => {
    try {
        const { email, password, baseCurrency, companyName } = req.body;
        if (!email || !password || !companyName)
            return res.status(400).json({ message: "Email, password, and company name are required." });

        db.query("SELECT * FROM Companies WHERE name = ? LIMIT 1", [companyName], async (err, companyResults) => {
            if (err) return res.status(500).json({ message: err.message });

            let companyId;

            if (companyResults.length === 0) {
                companyId = uuidv4();
                db.query("INSERT INTO Companies (company_id, name, base_currency) VALUES (?, ?, ?)",
                    [companyId, companyName, baseCurrency || "USD"],
                    (err) => {
                        if (err) return res.status(500).json({ message: err.message });
                        createAdmin(companyId);
                    }
                );
            } else {
                companyId = companyResults[0].company_id;
                db.query("SELECT * FROM Users WHERE company_id = ? AND role = 'admin'", [companyId],
                    (err, adminResults) => {
                        if (err) return res.status(500).json({ message: err.message });
                        if (adminResults.length > 0) return res.status(400).json({ message: "Admin already exists for this company." });
                        createAdmin(companyId);
                    }
                );
            }

            async function createAdmin(companyId) {
                const password = await hashPassword(password);
                const userId = uuidv4();
                db.query("INSERT INTO Users (user_id, company_id, email, password, role) VALUES (?, ?, ?, ?, ?)",
                    [userId, companyId, email, password, "admin"],
                    (err) => {
                        if (err) return res.status(500).json({ message: err.message });

                        const token = generateToken({ user_id: userId, role: "admin", company_id: companyId });
                        res.status(201).json({ token, user: { id: userId, email, role: "admin", company_id: companyId } });
                    }
                );
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const [rows] = await db.execute(
      "SELECT user_id, company_id, email, password, role FROM Users WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = rows[0];
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = generateToken({
      user_id: user.user_id,
      role: user.role,
      company_id: user.company_id,
    });

    res.json({
      token,
      user: {
        id: user.user_id,
        email: user.email,
        role: user.role,
        company_id: user.company_id
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
