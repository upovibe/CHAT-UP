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
import Mockup from "@/assets/videos/mockup.mov";
import Lottie from "lottie-react";
import arrowAnimation from "@/assets/animations/AnimationArrow.json";
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

  const { signup, isSignUp } = useAuth();
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
      <div className="min-h-screen flex flex-col lg:flex-row w-full bg-white p-2 lg:p-5 gap-5">
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
                className="w-full bg-transparent rounded-full font-bold border-2 border-neutral-900 hover:border-transparent hover:bg-slate-300"
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
                className="w-full bg-transparent rounded-full font-bold border-2 border-neutral-900 hover:border-transparent hover:bg-slate-300"
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
                    className="rounded-full bg-transparent focus:ring-0 border-slate-900 border-2 transition-all ease-linear duration-200 focus:bg-white"
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
                    className="rounded-full bg-transparent focus:ring-0 border-slate-900 border-2 transition-all ease-linear duration-200 focus:bg-white"
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
                    className="rounded-full bg-transparent focus:ring-0 border-slate-900 border-2 transition-all ease-linear duration-200 focus:bg-white"
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
                    className="rounded-full bg-transparent focus:ring-0 border-slate-900 border-2 transition-all ease-linear duration-200 focus:bg-white"
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
                    className="rounded-full bg-transparent focus:ring-0 border-slate-900 border-2 transition-all ease-linear duration-200 focus:bg-white pr-10"
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
                    className="rounded-full bg-slate-950 flex items-center justify-center gap-2"
                    disabled={isSignUp}
                  >
                    {isSignUp ? (
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
        <div className="w-full lg:w-8/12 bg-[#dbdfe5] lg:h-screen h-full flex flex-col items-center justify-between py-5 lg:pl-5 lg:rounded-2xl overflow-hidden">
          {/* First Layer: Heading (Small Height) */}
          <div className="h-max p-5 rounded-xl mb-4 w-full lg:flex flex-col items-center my-3 mr-5 hidden">
            <div className="flex items-center justify-end gap-3 w-full">
              <h1 className="text-white text-lg rounded-full rounded-tr-none bg-blue-600 shadow px-6 py-2 ml-auto">
                Let's Chat!
              </h1>
              <img
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wyMDkyMnwwfDF8c2VhcmNofDg0fHx1c2VyfGVufDB8fHx8MTczMjU1NjgyMHww&ixlib=rb-4.0.3&q=80&w=1080"
                alt="Logo"
                className="size-10 min-h-5 min-w-5 object-cover rounded-full border-2"
              />
            </div>
            <div className="flex items-center justify-end gap-3 w-full">
              <img
                src="https://images.unsplash.com/photo-1499887142886-791eca5918cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wyMDkyMnwwfDF8c2VhcmNofDl8fHVzZXIlMjBmZW1hbGV8ZW58MHx8fHwxNzMyNTU2ODUyfDA&ixlib=rb-4.0.3&q=80&w=1080"
                alt="Logo"
                className="size-10 min-h-5 min-w-5 object-cover rounded-full border-2"
              />
              <h1 className="text-white text-lg rounded-full rounded-tl-none bg-blue-600 shadow px-6 py-2 mr-auto">
                Join the conversation!
              </h1>
            </div>
          </div>

          {/* Second Layer: Arrow Animation (Medium Height) */}
          <div className="h-40 mb-4 w-full flex flex-col items-center justify-center p-5 lg:p-0 gap-3">
            <div className="flex items-center justify-end gap-3 w-full lg:hidden">
              <h1 className="text-white text-lg rounded-full rounded-tr-none bg-blue-600 shadow px-6 py-2 ml-auto">
                Join the conversation!
              </h1>
              <img
                src="https://images.unsplash.com/photo-1499887142886-791eca5918cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wyMDkyMnwwfDF8c2VhcmNofDl8fHVzZXIlMjBmZW1hbGV8ZW58MHx8fHwxNzMyNTU2ODUyfDA&ixlib=rb-4.0.3&q=80&w=1080"
                alt="Logo"
                className="size-10 min-h-5 min-w-5 object-cover rounded-full border-2"
              />
            </div>
            <Lottie
              className="h-full w-full object-contain transform rotate-180"
              animationData={arrowAnimation}
              loop={true}
            />
          </div>

          {/* Third Layer: Video (Remaining Height) */}
          <div className="flex-grow w-full">
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={Mockup} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
