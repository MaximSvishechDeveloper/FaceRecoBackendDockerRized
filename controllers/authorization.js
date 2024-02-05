import { redisClient } from "../server.js";

export const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json("Unathorized");
  }
  const value = await redisClient.get(authorization);
  if (value === null) {
    return res.status(400).json("Unathorized");
  }

  return next();
};
