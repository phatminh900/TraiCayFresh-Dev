import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { v4 as uuidv4 } from "uuid";

export const verifyToken = async (token: string) => {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return verified.payload as JWTPayload & {userId:string};
  } catch (error) {
    throw new Error("Mã đăng nhập hết hạn");
  }
};
export const signToken = async (userId: string) => {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(uuidv4())
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRATION_TIME!)
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));
  return token;
};
