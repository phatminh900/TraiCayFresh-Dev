import dotenv from "dotenv";
import { z } from "zod";
import { getUserProcedure, router, USER_TYPE } from "../trpc";
import path from "path";
import { getPayloadClient } from "../../payload/get-client-payload";
import { isEmailUser } from "../../utils/util.utls";
import { Product } from "@/payload/payload-types";
import { throwTrpcInternalServer } from "../../utils/server/error-server.util";
import { APP_PARAMS, APP_URL } from "../../constants/navigation.constant";
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
const PaymentRouter = router({
  payWithMomo: getUserProcedure
    .input(
      z.object({
        orderNotes: z.string().optional(),
        shippingAddress: z.object({
          address: z.string(),
          userName: z.string(),
          userPhoneNumber: z.string(),
        }),
        // deliveryInfo: z.object({
        //   deliveryAddress: z.string(),
        //   deliveryFee: z.string(),
        //   quantity: z.string(),
        // }),
        // items: z.array(
        //   z.object({
        //     id: z.string(),
        //     imageUrl: z.string(),
        //     currency: z.literal("VND"),
        //     quantity: z.number(),
        //     // totalAmount: z.number(),
        //   })
        // ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const payload = await getPayloadClient();
        //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
        const { orderNotes, shippingAddress } = input;
        const { user, type: userType } = ctx;
        // if no user already handle in the previous middleware
        const userCart = (
          await payload.findByID({
            collection: isEmailUser(user)
              ? "customers"
              : "customer-phone-number",
            id: user.id,
            depth: 2,
          })!
        ).cart?.items;

        // return total + item.quantity! * (item.priceAfterDiscount! || item.originalPrice!),

        if (!userCart) return;
        const cartTotalPrice = userCart.reduce((total, item) => {
          const product = item.product as Product;
          return (
            total +
            item.quantity! *
              (product.priceAfterDiscount! || product.originalPrice!)
          );
        }, 0);
        // let price
        let totalAfterCoupon = 0;
        let amount = cartTotalPrice;
        // check if having coupon and still valid
        const coupon = userCart.find((item) => item.coupon)?.coupon;
        if (coupon) {
          // check if the coupon still valid
          const couponInDb = await payload.find({
            collection: "coupons",
            where: { coupon: { equals: coupon } },
          });
          if (!couponInDb) {
            amount = cartTotalPrice;
            return;
          }
          const salePrice = userCart.reduce((total, item) => {
            const product = item.product as Product;
            if (item.discountAmount) {
              return (
                total +
                (item.discountAmount *
                  item.quantity! *
                  (product.priceAfterDiscount || product.originalPrice)) /
                  100
              );
            }
            return total;
          }, 0);
          const priceAfterDiscount = cartTotalPrice - salePrice;
          amount = priceAfterDiscount;
          totalAfterCoupon = priceAfterDiscount;
        }
        // create order
        const orderItems = userCart.map((item) => {
          const product = item.product as Product;
          return {
            product: product.id,
            price: product.priceAfterDiscount || product.originalPrice,
            quantity: item.quantity,
          };
        });

        //parameters
        const partnerCode = process.env.MOMO_PARTNER_CODE!;
        const accessKey = process.env.MOMO_ACCESS_KEY!;
        const secretkey = process.env.MOMO_SECRET_KEY!;
        const requestId = partnerCode + new Date().getTime() + user.id;
        const orderId = requestId;
        const orderDetails = userCart.reduce((acc, item) => {
          const product = item.product as Product;
          return `${acc}${acc ? "," : ""} ${item.quantity}KG ${product.title}`;
        }, "");
        const orderInfo = `Thanh toán ${orderDetails}`;

        // create new order in db
        const newOrder = await payload.create({
          collection: "orders",
          data: {
            orderBy: {
              value: user.id,
              relationTo:
                userType === USER_TYPE.email
                  ? "customers"
                  : "customer-phone-number",
            },
            total: amount,
            items: orderItems,
            orderNotes,

            _isPaid: false,
            totalAfterCoupon,
            shippingAddress: shippingAddress,
            status: "pending",
          },
        });

        const redirectUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}${APP_URL.orderStatus}?${APP_PARAMS.cartOrderId}=${newOrder.id}`;
        const ipnUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-momo-payment-success`;
        console.log("------------------");
        console.log(ipnUrl);
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
          notifyUrl: ipnUrl,
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
              if (payUrl) {
                // create order

                resolve({ success: true, payUrl });
              }
            });
            res.on("end", () => {
              console.log("No more data in response.");
            });
          });

          req.on("error", (error: any) => {
            console.error(`Problem with request: ${error.message}`);
            reject({
              message: "Không thể thanh toán bằng momo vui lòng thử lại",
              code: 500,
            });
            // reject(error);
          });

          req.write(requestBody);
          req.end();
        });
      } catch (error) {
        throwTrpcInternalServer(error);
      }
    }),

  verifyMomoPaymentSuccessStatus: getUserProcedure.mutation(({ ctx }) => {
    const { res, req } = ctx;
    const transactionInfo = req.body;
    console.log(transactionInfo);

    // TODO: Xác minh thông tin giao dịch tại đây

    // Phản hồi Momo với status code 200
    res.sendStatus(200);
  }),
});

export default PaymentRouter;
