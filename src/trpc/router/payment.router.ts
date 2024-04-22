import dotenv from "dotenv";
import { z } from "zod";
import { getUserProcedure, router } from "../trpc";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
const PaymentRouter = router({
  payWithMomo: getUserProcedure
    .input(
      z.object({
        orderId: z.string(),
        amount: z.string(),
        deliveryInfo: z.object({
          deliveryAddress: z.string(),
          deliveryFee: z.string(),
          quantity: z.string(),
        }),
        items: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            imageUrl: z.string(),
            currency: z.literal("VND"),
            quantity: z.number(),
            // totalAmount: z.number(),
            price: z.number(),
          })
        ),
      })
    )
    .mutation(({ ctx, input }) => {
      //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
      const { amount, items, deliveryInfo } = input;
      //parameters
      const partnerCode = process.env.MOMO_PARTNER_CODE!;
      const accessKey = process.env.MOMO_ACCESS_KEY!;
      const secretkey = process.env.MOMO_SECRET_KEY!;
      const requestId = partnerCode + new Date().getTime();
      const orderId = requestId;

      const orderInfo = "pay with MoMo";
      const redirectUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you`;
      const ipnUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you`;
      // const ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
      const requestType = "payWithATM";
      const extraData = ""; //pass empty value if your merchant does not have stores

      //before sign HMAC SHA256 with format
      //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
      const rawSignature =
        "accessKey=" +
        accessKey +
        "&amount=" +
        amount +
        "&extraData=" +
        extraData +
        "&ipnUrl=" +
        ipnUrl +
        "&orderId=" +
        orderId +
        "&orderInfo=" +
        orderInfo +
        "&partnerCode=" +
        partnerCode +
        "&redirectUrl=" +
        redirectUrl +
        "&requestId=" +
        requestId +
        "&requestType=" +
        requestType;

      //puts raw signature
      //signature
      const crypto = require("crypto");
      const signature = crypto
        .createHmac("sha256", secretkey)
        .update(rawSignature)
        .digest("hex");

      //json object send to MoMo endpoint
      const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        extraData: extraData,
        requestType: requestType,
        signature: signature,
        lang: "vi",
        // items: {
        //   id: "204727",
        //   name: "YOMOST Bac Ha&Viet Quat 170ml",
        //   description: "YOMOST Sua Chua Uong Bac Ha&Viet Quat 170ml/1 Hop",
        //   category: "beverage",
        //   imageUrl: "https://momo.vn/uploads/product1.jpg",
        //   manufacturer: "Vinamilk",
        //   price: 11000,
        //   quantity: 5,
        //   unit: "hộp",
        //   totalPrice: 55000,
        //   taxAmount: "200",
        // },
      });
      //Create the HTTPS objects
      const https = require("https");
      return new Promise((resolve, reject) => {
        const options = {
          hostname: "test-payment.momo.vn",
          port: 443,
          path: "/v2/gateway/api/create",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(requestBody),
          },
        };

        const req = https.request(options, (res: any) => {
          res.setEncoding("utf8");
          res.on("data", (body: any) => {
            const payUrl = JSON.parse(body).payUrl;
            resolve({ success: true, payUrl });
          });
          res.on("end", () => {
            console.log("No more data in response.");
          });
        });

        req.on("error", (error: any) => {
          console.error(`Problem with request: ${error.message}`);
          reject(error);
        });

        req.write(requestBody);
        req.end();
      });
    }),
});

export default PaymentRouter;
