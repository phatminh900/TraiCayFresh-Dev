import express from "express";
import { getPayloadClient } from "../../payload/get-client-payload";
import { verifyToken } from "../../utils/auth.util";
import { signToken } from "../../utils/server/auth.util";
import multer from "multer";
const router = express.Router();
const upload=multer()
router.post("/reviews",upload.array('reviewImgs'), async (req, res) => {
  try {
    // const payload = await getPayloadClient();
    const { reviewText, rating, productId, reviewImgs } = req.body;
    console.log('-----')
    console.log(reviewText)
    console.log(rating)
    console.log(productId)
    console.log(reviewImgs)
    // console.log('user id in the server',userId)
    // const refreshToken = (
    //   await payload.findByID({
    //     collection: "customer-phone-number",
    //     id: (userId as string) || "",
    //   })
    // )?.refreshToken;
    // const isVerified = await verifyToken(refreshToken || "");
    // if ("code" in isVerified) {
    //   throw new Error();
    // }

    // if ("userId" in isVerified) {
    //   const newToken = await signToken(isVerified.userId);
    //   const expires = new Date(+(isVerified.exp as number) * 1000);

    return res.status(200).json({ok:true})
      // return res.status(200).json({ok:true, token: newToken, expires });
    // }
  } catch (error) {
    // not able to go in caches ???
    return res.status(400).json({ok:false})
  }
});
export default router