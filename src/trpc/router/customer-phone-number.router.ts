import { z } from "zod";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import otpGenerator from "otp-generator";
import cookie from 'cookie'
import { publicProcedure, router } from "../trpc";
import { PhoneValidationSchema } from "../../validations/user-infor.valiator";
import { getPayloadClient } from "../../payload/get-client-payload";
import { signToken } from "../../utils/auth.util";
import { COOKIE_USER_PHONE_NUMBER_TOKEN } from "../../constants/constants.constant";

const customerPhoneNumberRouter = router({
  requestOtp: publicProcedure
    .input(PhoneValidationSchema)
    .mutation(async ({ input }) => {
      try {
        const { phoneNumber } = input;
        const payload = await getPayloadClient();
  
        const otp = otpGenerator.generate(6, {
          digits: true,
          specialChars: false,
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
        });
        console.log("OTP:::", otp)
        // TODO: send to user
        const salt = await bcrypt.genSalt(10);
        const hashOtp = await bcrypt.hash(otp, salt);
        // still send otp
        await payload.create({
          collection: "otp",
          data: {
            otp: hashOtp,
            phoneNumber,
          },
        });
  
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  verifyOtp: publicProcedure
    .input(
      PhoneValidationSchema.extend({otp:z.string()})
    )
    .mutation(async ({ input ,ctx}) => {
      const {res}=ctx
      const {phoneNumber,otp}=input
      const payload=await getPayloadClient()
      // check if the otp  matches the phone number
      const {docs}=await payload.find({collection:'otp',where:{phoneNumber:{equals:phoneNumber}}})
      if(!docs.length) {
        throw new TRPCError({code:"NOT_FOUND",message:"Mã OTP đã hết hạn hoặc sai vui lòng nhập lại."})
      }
      const lastOtp=docs[docs.length-1]
      // TODO: check again in production
      const isValidOtp=await bcrypt.compare(otp,lastOtp.otp!)
        if(!isValidOtp){
        throw new TRPCError({code:"UNAUTHORIZED",message:"Mã OTP không đúng"})
        }
        if(isValidOtp && phoneNumber===lastOtp.phoneNumber){
          const {docs}=await payload.find({collection:'customer-phone-number',where:{phoneNumber:{equals:lastOtp.phoneNumber}}})
          // send only the jwt
         
          // if exist no need to create new one
          if(docs.length){
            await payload.delete({collection:'otp',where:{phoneNumber:{equals:lastOtp.phoneNumber}}})
            const token=await signToken(docs[0].id)
            res.setHeader('Set-Cookie',cookie.serialize(COOKIE_USER_PHONE_NUMBER_TOKEN,token,{
              secure:process.env.NODE_ENV==='production',
              path:'/',
              httpOnly:true
            }))
            return {success:true}
          }
          // if user do not  exist ==> create a new one
          const newCustomer=await payload.create({collection:'customer-phone-number',data:{
            phoneNumber
          }})
          if(newCustomer){
            const token=await signToken(newCustomer.id)
            res.setHeader('Set-Cookie',cookie.serialize(COOKIE_USER_PHONE_NUMBER_TOKEN,token,{
              secure:process.env.NODE_ENV==='production',
              path:'/',
              httpOnly:true
            }))
            await payload.delete({collection:'otp',where:{phoneNumber:{equals:lastOtp.phoneNumber}}})
            return {success:true}
          }
          
        }
    }),
});
export default customerPhoneNumberRouter;
