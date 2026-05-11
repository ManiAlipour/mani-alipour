import jwt, { Secret, SignOptions } from "jsonwebtoken";

const JWT_SECRET: Secret = process.env.JWT_SECRET as string;

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function signJWT(
  payload: JWTPayload,
  expiresIn: SignOptions["expiresIn"] = "30d",
) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}
