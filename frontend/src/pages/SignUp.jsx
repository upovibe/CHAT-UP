import { useState } from "react";
import { useAuth } from "@/store/useAuth";

const SignUp = () => {
  // State for toggling password visibility
  const [showPassword, setPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
  }); // State for form data

  // Access authentication functions and state
  const { SignUp, isSignUp } = useAuth();

  // Form validation logic (to be implemented)
  const validateForm = () => {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateForm();
    await SignUp(formData); // Submit the form data
  };

  return (
    <>
      <div className="min-h-screen flex flex-col lg:flex-row w-full bg-red-600 p-5">
        {/* left side */}
        <div className="w-full lg:w-6/12 xl:w-4/12 bg-yellow-600 lg:h-screen h-full flex flex-col">
          <div>

          </div>
        </div>
        {/* right side */}
        <div className="w-full lg:w-6/12 xl:w-4/12 bg-blue-600 h-full">
          SignUp Form Goes here
        </div>
      </div>
    </>
  );
};

export default SignUp;

// <form onSubmit={handleSubmit}>
//         </form>
