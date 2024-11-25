import { useState } from 'react';
import { useAuth } from '@/store/useAuth';

const SignUp = () => {
  // State for toggling password visibility
  const [showPassword, setPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
  }); // State for form data

   // Access authentication functions and state
  const { SignUp, isSignUp } = useAuth();

  // Form validation logic (to be implemented)
  const validateForm = () => {
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateForm();
    await SignUp(formData); // Submit the form data
  };

  return (
    <>
      <div>
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
        </form>
      </div>
    </>
  );
};

export default SignUp;
