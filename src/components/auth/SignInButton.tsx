import { GoogleLogin } from "@react-oauth/google";
import { useToast } from "@/hooks/use-toast";

interface SignInButtonProps {
    onSuccess: (credentialResponse: any) => void;
}

const SignInButton = ({ onSuccess }: SignInButtonProps) => {
    const { toast } = useToast();

    return (
        <div className="flex justify-center">
            <GoogleLogin
                onSuccess={onSuccess}
                onError={() => {
                    toast({
                        title: "Login Failed",
                        description: "Something went wrong with Google Login.",
                        variant: "destructive",
                    });
                }}
                useOneTap
                theme="filled_black"
                shape="pill"
            />
        </div>
    );
};

export default SignInButton;
