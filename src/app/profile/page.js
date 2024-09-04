import { Suspense } from 'react';
import ProfileClient from "@/components/ProfileClient";
import Loading from "@/components/Loading";

export default function ProfilePage() {
    return (
        <Suspense fallback={<Loading />}>
            <ProfileClient />
        </Suspense>
    );
}