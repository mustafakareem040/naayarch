import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const SignInAlert = ({ isOpen, onClose, onLogin }) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="w-[90%] max-w-[364px] p-6 rounded-md shadow-lg">
                <div className="flex flex-col items-center">
                    <div className="w-full  mb-6">
                        <video autoPlay loop muted playsInline className="w-full max-h-[20vh]">
                            <source src="/waiting.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <AlertDialogHeader className="font-serif text-center">
                        <AlertDialogTitle className="text-2xl font-serif font-medium mb-2">Sign In Required !</AlertDialogTitle>
                        <p className="text-gray-500 font-serif mb-6">
                            You need to sign in first to add items in your Wishlist.
                        </p>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="w-full max-w-52 pt-4 font-serif flex flex-col gap-3">
                        <Button
                            className="w-full bg-[#44594A] py-6 text-white hover:bg-[#3a4d40] transition-colors duration-200"
                            onClick={onLogin}
                        >
                            Login
                        </Button>
                        <Button
                            className="w-full bg-gray-200 py-6 text-gray-700 hover:bg-gray-300 transition-colors duration-200"
                            variant="secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                    </AlertDialogFooter>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default SignInAlert;