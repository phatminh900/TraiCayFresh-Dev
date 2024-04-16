import { getPayloadClient } from "../get-client-payload";
export const seedDb = async () => {
  try {
    console.log("SEEDING...");
    const payload = await getPayloadClient();
    console.log("DELETING...");
    const CustomerPhoneNumberModel =
      payload.db.collections["customer-phone-number"];
    await CustomerPhoneNumberModel.deleteMany();
    const CustomerModel = payload.db.collections["customers"];
    await CustomerModel.deleteMany();

    console.log("CREATING....");

    await payload.create({
      collection: "customers",
      data: {
        email: "testuser1@gmail.com",
        password: "test12345",
        name: "Phat",
        _verified: true,
      },
    });

    await payload.create({
      collection: "customer-phone-number",
      data: {
        phoneNumber: "84386325681",
      },
    });

    // user with cart items
    await payload.create({
      collection: "customers",
      data: {
        email: "testUserCart@gmail.com",
        password: "test12345",
        name: "Phat",
        _verified: true,
        cart: {
          items: [
            { product: "660e7631eec6f5aff6b5b77c", quantity: 4.5 },
            { product: "660eaf2fcfcdb0d6817dcd32", quantity: 3 },
          ],
        },
        // cart for later
      },
    });

    await payload.create({
      collection: "customer-phone-number",
      data: {
        phoneNumber: "84985215845",
        cart: {
          items: [
            { product: "660e7631eec6f5aff6b5b77c", quantity: 4.5 },
            { product: "660eaf2fcfcdb0d6817dcd32", quantity: 3 },
          ],
        },
        // cart for later
      },
    });
  } catch (error) {
    console.log(error);
  }
};
