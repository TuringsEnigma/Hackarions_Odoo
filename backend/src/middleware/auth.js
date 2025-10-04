import { verifyToken } from "../utils/crypto.js";

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    const user = verifyToken(token);
    if (user) {
      req.user = user;
      return next();
    }
  }
  res.status(401).json({ message: "Authentication required." });
};

export const restrictToRoles = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden. Insufficient permissions." });
  }
  next();
};
