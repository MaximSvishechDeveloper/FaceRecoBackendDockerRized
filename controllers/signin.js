import jwt from "jsonwebtoken";
import redis from "redis";

//setup Redis:

const redisClient = redis.createClient({
  url: process.env.REDIS_URI,
});

async function redisConnect() {
  return await redisClient.connect();
}
redisConnect();

const handleSignIn = async (req, res, bcrypt, db) => {
  try {
    const { email, password } = req.body;

    const hash = await db("login").select("hash").where("email", "=", email);
    if (bcrypt.compareSync(password, hash[0].hash)) {
      const user = await db("users").select("*").where("email", "=", email);
      return user[0];
    } else {
      return Promise.reject("wrong password entered");
    }
  } catch {
    return Promise.reject("email not exicts");
  }
};

const getAuthTokenId = async (req, res) => {
  const { authorization } = req.headers;
  const value = await redisClient.get(authorization);
  if (value === null) {
    return res.status(400).json("Unathorized");
  }
  return res.json({ userId: value });
};

const signToken = (email) => {
  const jwtPayLoad = { email };
  return jwt.sign(jwtPayLoad, process.env.SECRET, { expiresIn: "2 days" });
};

const createSessions = async (user) => {
  try {
    const { email, id } = user;
    const token = signToken(email);
    await redisClient.set(token, id);
    return { success: "true", userId: id, token };
  } catch {
    return Promise.reject("Couldnt create Session");
  }
};

export const signInAuthentication = (req, res, bcrypt, db) => {
  console.log(req.headers);
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenId(req, res)
    : handleSignIn(req, res, bcrypt, db)
        .then((data) => createSessions(data))
        .then((session) => res.json(session))
        .catch((err) => res.status(400).json(err));
};
