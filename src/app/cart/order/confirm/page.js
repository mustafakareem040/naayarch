import OrderConfirmation from "@/components/OrderConfirmation";

export default function ConfirmPage({searchParams}) {
    return <OrderConfirmation id={searchParams?.id}/>
}