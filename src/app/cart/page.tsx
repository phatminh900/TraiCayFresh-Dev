import CartList from "@/components/molecules/cart-list";
import { getCartOfUser } from "@/services/server/payload/carts.service";
import { getUserServer } from "@/services/server/payload/users.service";
// import CartList from "./_components/cart-list";
import CartSummary from "./_components/cart-summary";


const CartPage = async () => {
  const user = await getUserServer();

  const { data: userCart } = await getCartOfUser(
    user && "email" in user ? "email" : "phoneNumber",
    user?.id
  );


  return (
    <div className="md:flex md:gap-8">
      <CartList user={user} userCart={userCart!} />
      <CartSummary user={user} />
    </div>
  );
};

export default CartPage;
