import AddAddress from "@/components/AddAddress";
import {Suspense} from "react";
import Loading from "@/components/Loading";

export default function AddAddressPage() {
    return (
        <Suspense fallback={<Loading />}>
            <AddAddress />
        </Suspense>
    )
}