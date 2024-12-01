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

  // Validate avatar: Must be a valid base64 string representing an image
export const validateAvatar = (avatar) => {
  if (!avatar || typeof avatar !== "string") {
    return { isValid: false, error: "Avatar must be a valid base64 string." };
  }

  // Regular expression to validate base64 image strings
  const base64Regex = /^data:image\/(png|jpeg|jpg|gif);base64,[A-Za-z0-9+/=]+$/;

  if (!base64Regex.test(avatar)) {
    return { isValid: false, error: "Invalid image format. Only JPEG, PNG, or GIF images are allowed." };
  }

  // Decode the base64 string and check size (optional, assuming 4/3 ratio of base64 to bytes)
  const sizeInBytes = (avatar.length * 3) / 4 - (avatar.endsWith("==") ? 2 : avatar.endsWith("=") ? 1 : 0);
  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

  if (sizeInBytes > maxSizeInBytes) {
    return { isValid: false, error: "Image size must be less than 5MB." };
  }

  return { isValid: true };
};
