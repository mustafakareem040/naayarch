import AddAddress from "@/components/AddAddress";
import {NotificationProvider} from "@/components/NotificationContext";

export default function AddAddressPage() {
    return (
        <NotificationProvider>
            <AddAddress />
        </NotificationProvider>
    )
}