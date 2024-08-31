export interface PasswordTestResult {
  message: string;
  isValid: boolean;
}

export const isPasswordValid = (password: string): PasswordTestResult => {
  const result: PasswordTestResult = {
    message: "",
    isValid: true,
  };

  if (password.length <  8) {
    result.message = "Password must be at least 8 characters";
    result.isValid = false;
    return result;
  }

  const strongPassword = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );
  if (!strongPassword.test(password)) {
    result.message = 
      "Password must contain at least 1 special character, 1 cap letter, and 1 number";
    result.isValid = false;
  }
  
  return result;
};
