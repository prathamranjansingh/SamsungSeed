import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized. Please login again." });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decode.id; // Store user ID in request body
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(403).json({ success: false, message: "Invalid token." });
  }
};

export default authMiddleware;
