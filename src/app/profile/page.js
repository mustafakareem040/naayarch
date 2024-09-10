import { Suspense } from 'react';
import ProfileClient from "@/components/ProfileClient";
import Loading from "@/components/Loading";
import AsyncNavBar from "@/components/AsyncNavBar";
export default function ProfilePage() {
    return (
        <Suspense fallback={<Loading />}>
            <AsyncNavBar bg={"#F6F3F1"}/>
            <ProfileClient />
        </Suspense>
    );
}