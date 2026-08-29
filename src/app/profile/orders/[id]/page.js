import OrderDetail from "@/components/OrderDetail";

export const metadata = {
    title: "Order Details | Bhagvat Prasadam",
    description: "View details of your order"
};

export default async function ProfileOrderDetailPage({ params }) {
    const { id } = await params;
    return <OrderDetail orderId={id} />;
}
