import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Authenticated user:", decoded); // <-- DEBUG
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token error:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};
