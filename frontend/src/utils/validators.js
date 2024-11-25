// Validate full name: Must be at least two words, containing only letters and spaces
export const validateFullName = (fullName) => {
    const fullNameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)+$/;
    return fullNameRegex.test(fullName);
  };
  
  // Validate username: Must be at least 3 characters long, containing only alphanumeric characters and underscores
  export const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    return usernameRegex.test(username);
  };
  
  // Validate email: Should follow a basic email format
  export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Validate password: At least 6 characters, including one uppercase, one lowercase, one number, and one special character
  export const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };
  
  // Validate phone number: Must be a valid international phone number format
  export const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
  };
  