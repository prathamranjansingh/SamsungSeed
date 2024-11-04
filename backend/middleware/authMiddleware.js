import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  // Get the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Not Authorized. Please login again.",
    });
  }

  // Extract token from "Bearer <token>" format
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using your JWT secret
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = decodedToken.id; // Store user ID in request body
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(403).json({ success: false, message: "Invalid token." });
  }
};

export default authMiddleware;
