import dynamic from "next/dynamic";
const DynamicMap = dynamic(() => import("@/components/AddAddress"), { ssr: false });
export default function AddAddressPage() {
    return (
        <DynamicMap />
    )
}