import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/store/useAuth";
import Logo from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/assets/svgs/icons/google-icon.svg";
import AppleIcon from "@/assets/svgs/icons/apple-icon.svg";
import Divider from "@/components/ui/Divider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Greetings from "@/components/layouts/Greetings";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "", // Can be email, username, or phone number
    password: "",
  });  

  const { login, isLoggingIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { identifier, password } = formData;
  
    let loginData = { password };
  
    if (identifier.includes("@")) {
      loginData.email = identifier;
    } else if (/^\d+$/.test(identifier)) {
      loginData.phoneNumber = identifier;
    } else {
      loginData.userName = identifier;
    }
  
    try {
      const user = await login(loginData);
      toast({
        variant: "success",
        title: "Login Successful",
        description: `Welcome back, ${user.fullName || "User"}!`,
      });
      
      navigate("/");
    } catch {
      toast({
        variant: "destructive",
        title: "Invalid Credentials",
        description: "The credentials you entered are incorrect.",
      });
    }
  };  

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full bg-white p-2 lg:p-5 gap-5">
      {/* left side */}
      <div className="w-full lg:w-4/12 lg:h-screen h-full flex flex-col justify-between">
        <Logo />
        {/* Authentication */}
        <div className="md:p-10 h-full flex flex-col items-center justify-center w-full gap-4 py-14 px-5">
          {/* OAuth(Open Authorization)-based */}
          <div className="flex flex-col w-full gap-3">
            <h2 className="text-3xl font-bold text-left mb-4">Log in</h2>
            <Button
              className="w-full bg-transparent rounded-full font-bold border-collapse focus-visible:ring-0 focus-visible:ring-offset-0 border-gray-500 hover:border-transparent hover:bg-slate-300"
              variant="outline"
            >
              <img
                src={GoogleIcon}
                alt="Google-icon"
                className="size-5 min-h-5 min-w-5 mr-1"
              />
              Sign in with Google
            </Button>
            <Button
              className="w-full bg-transparent rounded-full font-bold border-collapse focus-visible:ring-0 focus-visible:ring-offset-0 border-gray-500 hover:border-transparent hover:bg-slate-300"
              variant="outline"
            >
              <img
                src={AppleIcon}
                alt="Google-icon"
                className="size-5 min-h-5 min-w-5 mr-1"
              />
              Sign in with Apple
            </Button>
          </div>
          <Divider />
          {/* Email and Password Authentication */}
          <div className="w-full">
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <div className="grid items-start gap-1.5">
                <Label htmlFor="identifier">
                Identifier
                </Label>
                <Input
                  className="rounded-full border-collapse focus-visible:ring-0 focus-visible:ring-offset-0 border-gray-500"
                  type="text"
                  id="identifier"
                  placeholder="Email | username | phone number"
                  onChange={(e) =>
                    setFormData({ ...formData, identifier: e.target.value })
                  }
                />
              </div>

              <div className="grid items-start gap-1.5 relative">
                <Label htmlFor="password">Password</Label>
                <Input
                  className="rounded-full border-collapse focus-visible:ring-0 focus-visible:ring-offset-0 border-gray-500 pr-10"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                {/* Eye Icon Button */}
                <button
                  type="button"
                  className="absolute right-1 top-[1.4rem] bg-transparent hover:bg-transparent p-2 rounded-full focus:outline-none focus:ring-0 focus:border-0"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-slate-700" />
                  ) : (
                    <Eye className="w-5 h-5 text-slate-700" />
                  )}
                </button>
              </div>
              <div className="flex flex-col w-full">
                <Button
                  type="submit"
                  className="rounded-full bg-slate-950  dark:bg-slate-50  flex items-center justify-center gap-2"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" />
                      Please wait
                    </>
                  ) : (
                    "Log In"
                  )}
                </Button>
              </div>
            </form>
            <div className="flex items-center justify-center">
              <span className="text-sm">Don&apos; t have an account?</span>
              <Button
                className="text-bold px-2"
                variant="link"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* right side */}
      <Greetings />
    </div>
  );
};

export default Login;