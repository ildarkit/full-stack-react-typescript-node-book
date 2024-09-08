import { allowSubmit } from "./Helpers";
import {
  isPasswordValid,
  PasswordTestResult,
} from "../../../common/validators/PasswordValidator";

interface PasswordComparisonProps {
  dispatch: React.Dispatch<any>;
  password: string;
  passwordConfirm: string;
}

function PasswordComparison({
  dispatch,
  password,
  passwordConfirm,
}: PasswordComparisonProps) {
  function onChangePassword (e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({ payload: e.target.value, type: "password" });
    const passwordCheck: PasswordTestResult = isPasswordValid(e.target.value);

    if (!passwordCheck.isValid) {
      allowSubmit(dispatch, passwordCheck.message, true);
      return;
    }
    passwordsSame(passwordConfirm, e.target.value);
  };
  function onChangePasswordConfirm(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({ payload: e.target.value, type: "passwordConfirm" });
    passwordsSame(password, e.target.value);
  };
  function passwordsSame(passwordVal: string, passwordConfirmVal: string) {
    if (passwordVal !== passwordConfirmVal) {
      allowSubmit(dispatch, "Passwords do not match", true);
      return false;
    } else {
      allowSubmit(dispatch, "", false);
      return true;
    }
  };

  return (
    <>
      <div>
        <label>password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={onChangePassword}
        />
      </div>
      <div>
        <label>password confirmation</label>
        <input
          type="password"
          placeholder="Password Confirmation"
          value={passwordConfirm}
          onChange={onChangePasswordConfirm}
        />
      </div>
    </>
  );
};

export default PasswordComparison;
