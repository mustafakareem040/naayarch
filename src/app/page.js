import Dashboard from "@/components/Dashboard";
import MyOrders from "@/components/MyOrders";
import MyCoupons from "@/components/Coupon";

export const runtime = "edge";
export default function Home() {
    return (
        <Dashboard />
  );
}
