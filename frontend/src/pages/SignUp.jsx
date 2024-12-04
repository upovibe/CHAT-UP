import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/stores/useAuth";
import Logo from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/assets/svgs/icons/google-icon.svg";
import AppleIcon from "@/assets/svgs/icons/apple-icon.svg";
import Divider from "@/components/ui/Divider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Greetings from "@/components/layouts/Greetings";
import { Eye, EyeOff } from "lucide-react";
import {
  validateFullName,
  validateUsername,
  validateEmail,
  validatePassword,
  validatePhoneNumber,
} from "@/utils/validators";
import { useToast } from "@/hooks/use-toast";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const { signup, isSigingUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form validation logic
  const validateForm = () => {
    const { fullName, userName, email, phoneNumber, password } = formData;

    if (!validateFullName(fullName)) {
      toast({
        variant: "destructive",
        title: "Invalid Full Name",
        description: "Please enter a valid full name (at least two words).",
      });
      return false;
    }

    if (!validateUsername(userName)) {
      toast({
        variant: "destructive",
        title: "Invalid Username",
        description:
          "Username must be at least 3 characters and can include underscores.",
      });
      return false;
    }

    if (!validateEmail(email)) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address.",
      });
      return false;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        variant: "destructive",
        title: "Invalid Phone Number",
        description: "Please enter a valid international phone number.",
      });
      return false;
    }

    if (!validatePassword(password)) {
      toast({
        variant: "destructive",
        title: "Invalid Password",
        description:
          "Password must be at least 6 characters, with an uppercase, lowercase, number, and special character.",
      });
      return false;
    }

    toast({
      description: "All inputs are valid. Proceeding to create your account.",
    });
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success) {
      try {
        await signup(formData);
        toast({
          description: "Account created successfully!",
        });
        navigate("/");
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Signup Failed",
          description: "An error occurred while creating your account.",
        });
        console.error(error);
      }
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <>
      <div className="min-h-screen flex flex-col lg:flex-row w-full p-2 lg:p-5 gap-5 justify-between">
        {/* left side */}
        <div className="w-full lg:w-4/12 lg:h-screen h-full flex flex-col justify-between">
          <Logo />
          {/* Authentication */}
          <div className="md:p-10 h-full flex flex-col items-center justify-center w-full gap-4 py-14 px-5">
            {/* OAuth(Open Authorization)-based */}
            <div className="flex flex-col w-full gap-3">
              <h2 className="text-3xl font-bold text-left mb-4">
                Create account
              </h2>
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
            {/* mail and Password Authentication */}
            <div className="w-full">
              <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                <div className="grid items-start gap-1.5">
                  <Label htmlFor="fullname">Fullname</Label>
                  <Input
                    className="rounded-full border-collapse focus-visible:ring-0 focus-visible:ring-offset-0 border-gray-500"
                    type="text"
                    id="fullname"
                    placeholder="Enter your fullname"
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>
                <div className="grid items-start gap-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    className="rounded-full border-collapse focus-visible:ring-0 focus-visible:ring-offset-0 border-gray-500"
                    type="text"
                    id="username"
                    placeholder="Enter your username"
                    onChange={(e) =>
                      setFormData({ ...formData, userName: e.target.value })
                    }
                  />
                </div>
                <div className="grid items-start gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    className="rounded-full border-collapse focus-visible:ring-0 focus-visible:ring-offset-0 border-gray-500"
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="grid items-start gap-1.5">
                  <Label htmlFor="phonenumber">Phone Number</Label>
                  <Input
                    className="rounded-full border-collapse focus-visible:ring-0 focus-visible:ring-offset-0 border-gray-500"
                    type="text"
                    id="phonenumber"
                    placeholder="Enter your phone number"
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                  />
                </div>
                <div className="grid items-start gap-1.5 relative">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    className="rounded-full border-collapse focus-visible:ring-0 focus-visible:ring-offset-0 border-gray-500 pr-10"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Create a password"
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
                    className="rounded-full bg-slate-950 dark:bg-slate-50  flex items-center justify-center gap-2"
                    disabled={isSigingUp}
                  >
                    {isSigingUp ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5" />
                        Please wait
                      </>
                    ) : (
                      "Join Now"
                    )}
                  </Button>
                </div>
              </form>
              <div className="flex items-center justify-center">
                <span className="text-sm">Already have an account</span>
                <Button
                  className="text-bold px-2"
                  variant="link"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* right side */}
          <Greetings/>
      </div>
    </>
  );
};

export default SignUp;
