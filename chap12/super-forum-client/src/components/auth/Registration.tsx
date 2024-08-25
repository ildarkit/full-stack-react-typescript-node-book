import React, {FC, useReducer} from 'react';
import ReactModal from 'react-modal';
import './Registration.css';
import {PasswordTestResult, isPasswordValid} from '../../common/validators/PasswordValidator';
import {ModalProps} from '../types/ModalProps';
import {userReducer} from '../auth/common/UserReducer';
import {allowSubmit} from '../auth/common/Helpers'; 

const Registration: FC<ModalProps> = ({isOpen, onClickToggle}) => {
  const [
    {userName, password, email, passwordConfirm, isSubmitDisabled, resultMsg},
    dispatch,
  ] = useReducer(userReducer, {
    userName: "davec",
    password: "",
    email: "admin@dzhaven.com",
    passwordConfirm: "",
    isSubmitDisabled: true,
    resultMsg: "",
  });

  const onChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({payload: e.target.value, type: "userName"});
    if (!e.target.value) allowSubmit(dispatch, "Username cannot be empty", true)
    else allowSubmit(dispatch, "", false);
  };

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({payload: e.target.value, type: "email"});
    if (!e.target.value) allowSubmit(dispatch, "Email cannot be empty", true)
    else allowSubmit(dispatch, "", false);
  }; 

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({payload: e.target.value, type: "password"});
    const passwordCheck: PasswordTestResult = isPasswordValid(e.target.value);
    if (!passwordCheck.isValid) {
      allowSubmit(dispatch, passwordCheck.message, true);
      return;
    }
    passwordsSame(passwordConfirm, e.target.value);
  };

  const onChangePasswordConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({payload: e.target.value, type: "passwordConfirm"});
    passwordsSame(password, e.target.value);
  };

  const passwordsSame = (passwordVal: string, passwordConfirmVal: string) => {
    if (passwordVal !== passwordConfirmVal) {
      allowSubmit(dispatch, "Password do not match", true);
      return false;
    }
    allowSubmit(dispatch, "", false);
    return true;
  };

  const onClickRegister = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    onClickToggle(e);
  };

  const onClickCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onClickToggle(e);
  };

  return (
    <ReactModal
      className="modal-menu"
      isOpen={isOpen}
      onRequestClose={onClickToggle}
      shouldCloseOnOverlayClick={true}
    >
      <form>
        <div className="reg-inputs">
          <div>
            <label>username</label>
            <input type="text" value={userName} onChange={onChangeUserName}/>
          </div>
          <div>
            <label>email</label>
            <input type="email" value={email} onChange={onChangeEmail}/>
          </div>
          <div>
            <label>password</label>
            <input
              type="password"
              placeholder="Password"
              value={password} 
              onChange={onChangePassword}/>
          </div>
          <div>
            <label>password conformation</label>
            <input
              type="password"
              placeholder="Password Conformation"
              value={passwordConfirm} 
              onChange={onChangePasswordConfirm}/>
          </div>
        </div>
        <div className="reg-buttons">
          <div className="reg-btn-left">
            <button 
              style={{marginLeft: ".5em"}}
              className="action-btn"
              disabled={isSubmitDisabled}
              onClick={onClickRegister}
            >
            Register
            </button>
            <button
              style={{marginLeft: ".5em"}}
              className="cancel-btn"
              onClick={onClickCancel}
            >
            Close
            </button>
          </div>
          <span className="reg-btn-right">
            <strong>{resultMsg}</strong>
          </span>
        </div>
      </form>
    </ReactModal>
  );
};

export default Registration;
