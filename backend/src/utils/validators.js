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
      return false;
    }
    
    // Regular expression to validate base64 image strings
    const base64Regex = /^data:image\/(png|jpeg|jpg|gif);base64,[A-Za-z0-9+/=]+$/;
    return base64Regex.test(avatar);
  };
  
// Validate the file type and ensure the URL structure is correct
export const validateAttachmentUrl = (url, type) => {
  const validTypes = ["image", "video", "file"];

  // Check if type is valid
  if (!validTypes.includes(type)) {
    return { isValid: false, message: "Invalid attachment type" };
  }

  // Check if the URL is valid (basic validation)
  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/;
  if (!urlPattern.test(url)) {
    return { isValid: false, message: "Invalid URL format" };
  }

  return { isValid: true };
};

  // Maximum file sizes (in bytes)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const validateAttachmentSize = (fileBuffer, type) => {
  const size = fileBuffer.length;

  if (type === "image" && size > MAX_IMAGE_SIZE) {
    return { isValid: false, message: "Image size exceeds 5MB limit" };
  }
  if (type === "video" && size > MAX_VIDEO_SIZE) {
    return { isValid: false, message: "Video size exceeds 50MB limit" };
  }
  if (type === "file" && size > MAX_FILE_SIZE) {
    return { isValid: false, message: "File size exceeds 10MB limit" };
  }

  return { isValid: true };
};