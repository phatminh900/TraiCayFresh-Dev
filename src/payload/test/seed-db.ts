import { formUserAddress } from "../../utils/util.utls";
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
    const OrderModal = payload.db.collections["orders"];
    await CustomerModel.deleteMany();
    await OrderModal.deleteMany();

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
        phoneNumber: "0386325681",
        phoneNumbers: [{ phoneNumber: "0386325681", isDefault: true }],
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
        phoneNumber: "0985215845",
        cart: {
          items: [
            { product: "660e7631eec6f5aff6b5b77c", quantity: 4.5 },
            { product: "660eaf2fcfcdb0d6817dcd32", quantity: 3 },
          ],
        },
        // cart for later
      },
    });

    // user with cart items and address
    // email
    const userCartAndAddressEmail = await payload.create({
      collection: "customers",
      data: {
        email: "testUsercheckout@gmail.com",
        password: "test12345",
        name: "Phat",
        _verified: true,
        cart: {
          items: [
            { product: "660e7631eec6f5aff6b5b77c", quantity: 4.5 },
            { product: "660eaf2fcfcdb0d6817dcd32", quantity: 3 },
          ],
        },
        address: [
          {
            isDefault: true,
            district: "Thành Phố Thủ Đức 1",
            ward: "Phường Linh Tây",
            name: "Phat",
            phoneNumber: "0352769981",
            street: "42 duong so 8",
          },
        ],
        // cart for later
      },
    });
    // phone number
    const userCartAndAddressPhoneNumber = await payload.create({
      collection: "customer-phone-number",
      data: {
        phoneNumber: "0352769981",

        address: [
          {
            isDefault: true,
            district: "Thành Phố Thủ Đức 1",
            ward: "Phường Linh Tây",
            name: "Phat Tran",
            phoneNumber: "0352769981",
            street: "42 duong so 8",
          },
        ],
        cart: {
          items: [
            { product: "660e7631eec6f5aff6b5b77c", quantity: 4.5 },
            { product: "660eaf2fcfcdb0d6817dcd32", quantity: 3 },
          ],
        },
        // cart for later
      },
    });
    console.log(userCartAndAddressPhoneNumber)
    //create SUCCESS ORDERS
    // email
    // order by cash
    // use userCartAndAddressToBuy

    await payload.create({
      collection: "orders",
      data: {
        // @ts-ignore
        _id: "662bb02771b2f125b0b807a3",
        shippingAddress: {
          address: formUserAddress({
            street: userCartAndAddressEmail!.address![0]!.street,
            ward: userCartAndAddressEmail!.address![0]!.ward,
            district: userCartAndAddressEmail!.address![0]!.district,
          }),
          userName: userCartAndAddressEmail!.address![0]!.name,
          userPhoneNumber: userCartAndAddressEmail!.address![0]!.phoneNumber,
        },

        total: 468000,
        _isPaid: false,
        deliveryStatus: "pending",
        paymentMethod: "cash",
        status: "pending",
        orderNotes: "Giao trước 14h",
        // 4.5 kg mangosteens and 3 kg durian
        items: [
          { product: "660e7631eec6f5aff6b5b77c", quantity: 4.5 },
          { product: "660eaf2fcfcdb0d6817dcd32", quantity: 3 },
        ],
        orderBy: { relationTo: "customers", value: userCartAndAddressEmail.id },
      },
    });

    // phoneNumber
    // order by cash
    // use userCartAndAddressToBuy
    await payload.create({
      collection: "orders",
      data: {
        shippingAddress: {
          address: formUserAddress({
            street: userCartAndAddressPhoneNumber!.address![0]!.street,
            ward: userCartAndAddressPhoneNumber!.address![0]!.ward,
            district: userCartAndAddressPhoneNumber!.address![0]!.district,
          }),
          userName: userCartAndAddressPhoneNumber!.address![0]!.name,
          userPhoneNumber:
            userCartAndAddressPhoneNumber!.address![0]!.phoneNumber,
        },

        total: 468000,
        _isPaid: false,
        deliveryStatus: "pending",
        paymentMethod: "cash",
        status: "pending",
        orderNotes: "Giao trước 14h",
        // 4.5 kg mangosteens and 3 kg durian
        items: [
          { product: "660e7631eec6f5aff6b5b77c", quantity: 4.5 },
          { product: "660eaf2fcfcdb0d6817dcd32", quantity: 3 },
        ],
        orderBy: {
          relationTo: "customer-phone-number",
          value: userCartAndAddressPhoneNumber.id,
        },
      },
    });
    // 662d058a75cd684035a9e0d0

    // create CANCELED ORDERS
    await payload.create({
      collection: "orders",
      data: {
        // @ts-ignore
        _id: "662d058a75cd684035a9e0d0",
        shippingAddress: {
          address: formUserAddress({
            street: userCartAndAddressEmail!.address![0]!.street,
            ward: userCartAndAddressEmail!.address![0]!.ward,
            district: userCartAndAddressEmail!.address![0]!.district,
          }),
          userName: userCartAndAddressEmail!.address![0]!.name,
          userPhoneNumber: userCartAndAddressEmail!.address![0]!.phoneNumber,
        },

        total: 468000,
        _isPaid: false,
        deliveryStatus: "canceled",
        paymentMethod: "cash",
        status: "canceled",
        orderNotes: "Giao trước 14h",
        // 4.5 kg mangosteens and 3 kg durian
        items: [
          { product: "660e7631eec6f5aff6b5b77c", quantity: 4.5 },
          { product: "660eaf2fcfcdb0d6817dcd32", quantity: 3 },
        ],
        orderBy: { relationTo: "customers", value: userCartAndAddressEmail.id },
      },
    });

    // phoneNumber
    // order by cash
    // use userCartAndAddressToBuy
    await payload.create({
      collection: "orders",
      data: {
        shippingAddress: {
          address: formUserAddress({
            street: userCartAndAddressPhoneNumber!.address![0]!.street,
            ward: userCartAndAddressPhoneNumber!.address![0]!.ward,
            district: userCartAndAddressPhoneNumber!.address![0]!.district,
          }),
          userName: userCartAndAddressPhoneNumber!.address![0]!.name,
          userPhoneNumber:
            userCartAndAddressPhoneNumber!.address![0]!.phoneNumber,
        },

        total: 468000,
        _isPaid: false,
        deliveryStatus: "canceled",
        paymentMethod: "cash",
        status: "canceled",
        orderNotes: "Giao trước 14h",
        // 4.5 kg mangosteens and 3 kg durian
        items: [
          { product: "660e7631eec6f5aff6b5b77c", quantity: 4.5 },
          { product: "660eaf2fcfcdb0d6817dcd32", quantity: 3 },
        ],
        orderBy: {
          relationTo: "customer-phone-number",
          value: userCartAndAddressPhoneNumber.id,
        },
      },
    });
    // 662d0b7a97b7d0c8cfd50e1e

    // CREATE FAILED ORDER
    await payload.create({
      collection: "orders",
      data: {
        // @ts-ignore
        _id: "662d0b7a97b7d0c8cfd50e1e",
        shippingAddress: {
          address: formUserAddress({
            street: userCartAndAddressEmail!.address![0]!.street,
            ward: userCartAndAddressEmail!.address![0]!.ward,
            district: userCartAndAddressEmail!.address![0]!.district,
          }),
          userName: userCartAndAddressEmail!.address![0]!.name,
          userPhoneNumber: userCartAndAddressEmail!.address![0]!.phoneNumber,
        },

        total: 468000,
        _isPaid: false,
        deliveryStatus: "canceled",
        paymentMethod: "momo",
        status: "failed",
        orderNotes: "Giao trước 14h",
        // 4.5 kg mangosteens and 3 kg durian
        items: [
          { product: "660e7631eec6f5aff6b5b77c", quantity: 4.5 },
          { product: "660eaf2fcfcdb0d6817dcd32", quantity: 3 },
        ],
        orderBy: { relationTo: "customers", value: userCartAndAddressEmail.id },
      },
    });

    // phoneNumber
    // order by cash
    // use userCartAndAddressToBuy
    await payload.create({
      collection: "orders",
      data: {
        shippingAddress: {
          address: formUserAddress({
            street: userCartAndAddressPhoneNumber!.address![0]!.street,
            ward: userCartAndAddressPhoneNumber!.address![0]!.ward,
            district: userCartAndAddressPhoneNumber!.address![0]!.district,
          }),
          userName: userCartAndAddressPhoneNumber!.address![0]!.name,
          userPhoneNumber:
            userCartAndAddressPhoneNumber!.address![0]!.phoneNumber,
        },

        total: 468000,
        _isPaid: false,
        deliveryStatus: "canceled",
        paymentMethod: "cash",
        status: "failed",
        orderNotes: "Giao trước 14h",
        // 4.5 kg mangosteens and 3 kg durian
        items: [
          { product: "660e7631eec6f5aff6b5b77c", quantity: 4.5 },
          { product: "660eaf2fcfcdb0d6817dcd32", quantity: 3 },
        ],
        orderBy: {
          relationTo: "customer-phone-number",
          value: userCartAndAddressPhoneNumber.id,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};
