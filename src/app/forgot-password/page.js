import Footer from "@/components/Footer";
import ForgotPasswordPage from "@/account/ForgotPasswordPage";
export const runtime = "edge";

export default function ForgotPassword() {
    return (
        <>
            <ForgotPasswordPage />
            <Footer />
        </>
    )
}