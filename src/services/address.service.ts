
import { IDistrict, IWard } from "@/types/service.type";

export const getHcmWards = async (districtId:number): Promise<
  { data: IWard[] } | undefined
> => {
  try {
    const response = await fetch(
      `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Token: process.env.NEXT_PUBLIC_GHN_TOKEN!,
        },
        cache:'no-store',
        body: JSON.stringify({ district_id: districtId }),
      }
    );
    if (!response.ok) {
      throw Error("Đang có lỗi vui lòng thử lại sau");
    }
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};
export const getHcmDistricts = async (): Promise<
  { data: IDistrict[] } | undefined
> => {
  try {
    const response = await fetch(
      `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Token: process.env.NEXT_PUBLIC_GHN_TOKEN!,
        },
        body: JSON.stringify({ province_id: 202 }),
      }
    );
    if (!response.ok) {
      throw Error("Đang có lỗi vui lòng thử lại sau");
    }
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};