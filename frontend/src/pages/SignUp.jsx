import React from 'react'
 
const SignUp = () => {
  const [showPassword, setPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  const { SignUp, isSignUp } = useAuth();

  const validateForm = () => {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateForm();
    await SignUp(formData);
  }


  return (
    <>
      <div>
        SignUp
      </div>
    </>
  )
}

export default SignUp