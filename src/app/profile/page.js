import ProfileClient from "@/components/ProfileClient";
import AsyncNavBar from "@/components/AsyncNavBar";
export default function ProfilePage() {
    return (
        <>
            <AsyncNavBar bg={"#F6F3F1"}/>
            <ProfileClient />
        </>
    );
}