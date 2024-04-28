import cookie from "cookie";

import { getPayloadClient } from "../../payload/get-client-payload";
import dotenv from "dotenv";
import express from "express";
import { jwtVerify, decodeJwt } from "jose";
import path from "path";
import { COOKIE_USER_PHONE_NUMBER_TOKEN } from "../../constants/configs.constant";
import { verifyToken } from "../../utils/auth.util";
import { signToken } from "../../utils/server/auth.util";

const router = express.Router();
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const CustomerPhoneNumberRouter = router.post(
  "/refresh-token",
  async (req, res, next) => {
    try {
      const { token } = req.body;
      const decoded = decodeJwt(token);
      const userId = decoded?.userId || "";

      const payload = await getPayloadClient();
      const user = await payload.findByID({
        collection: "customer-phone-number",
        id: userId as string,
      });
      const userRefreshToken = user.refreshToken;
      const verifiedRefreshToken = await verifyToken(userRefreshToken || "");
      if (!("code" in verifiedRefreshToken)) {
        const newToken = await signToken(user.id);
        console.log(newToken)
        res.status(200).json({ ok: true, newToken });
        next();
      }
      if ("code" in verifiedRefreshToken) {
        throw new Error("");
      }
    } catch (error) {
      console.log("go in here huh");
      res.clearCookie(COOKIE_USER_PHONE_NUMBER_TOKEN);
      res.status(401).json({ ok: false });
      next();
    }
  }
);
export default CustomerPhoneNumberRouter;
