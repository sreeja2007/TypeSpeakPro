import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import SignInButton from "./SignInButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSuccess = (credentialResponse: any) => {
        if (credentialResponse.credential) {
            login(credentialResponse.credential);
            navigate("/dashboard");
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-neutral-900 border-neutral-800 text-white">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                        Welcome Back
                    </DialogTitle>
                    <DialogDescription className="text-center text-neutral-400">
                        Sign in to continue your progress and access the dashboard.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center space-y-4 py-4">
                    <div className="w-full flex justify-center">
                        <SignInButton onSuccess={handleSuccess} />
                    </div>
                    <p className="text-xs text-neutral-500">
                        By signing in, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LoginModal;
