import OrderConfirmation from "@/components/OrderConfirmation";

export default async function ConfirmPage({searchParams}) {
    const {id} = await searchParams
    return <OrderConfirmation id={await id}/>
}