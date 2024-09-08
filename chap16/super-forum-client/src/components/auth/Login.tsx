import React, { useReducer } from "react";
import ReactModal from "react-modal";
import {gql, useMutation} from '@apollo/client';
import {ModalProps} from "../types/ModalProps";
import {userReducer} from "./common/UserReducer";
import { allowSubmit } from "./common/Helpers";
import useRefreshReduxMe, {Me} from "../../hooks/useRefreshReduxMe";

const LoginMutation = gql`
  mutation Login($userName: String!, $password: String!) {
    login(userName: $userName, password: $password)
  }
`;

function Login({ isOpen, onClickToggle }: ModalProps) {
  const [execLogin] = useMutation(LoginMutation, {
    refetchQueries: [
      {
        query: Me,
      }
    ],
  });
  const [
    { userName, password, resultMsg, isSubmitDisabled },
    dispatch,
  ] = useReducer(userReducer, {
    userName: "tester",
    password: "Test123!@#",
    resultMsg: "",
    isSubmitDisabled: false,
  });
  const {execMe, updateMe} = useRefreshReduxMe();

  function onChangeUserName(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({ type: "userName", payload: e.target.value });
    if (!e.target.value)
      allowSubmit(dispatch, "Username cannot be empty", true);
    else allowSubmit(dispatch, "", false);
  };

  function onChangePassword(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({ type: "password", payload: e.target.value });
    if (!e.target.value)
      allowSubmit(dispatch, "Password cannot be empty", true);
    else allowSubmit(dispatch, "", false);
  };

  async function onClickLogin(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    onClickToggle(e);
    await execLogin({
      variables: {
        userName,
        password,
      },
    });
    execMe();
    updateMe();
  };

  function onClickCancel(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
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
            <input type="text" value={userName} onChange={onChangeUserName} />
          </div>
          <div>
            <label>password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={onChangePassword}
            />
          </div>
        </div>
        <div className="form-buttons form-buttons-sm">
          <div className="form-btn-left">
            <button
              style={{ marginLeft: ".5em" }}
              className="action-btn"
              disabled={isSubmitDisabled}
              onClick={onClickLogin}
            >
              Login
            </button>
            <button
              style={{ marginLeft: ".5em" }}
              className="cancel-btn"
              onClick={onClickCancel}
            >
              Close
            </button>
          </div>

          <span className="form-btn-left">
            <strong>{resultMsg}</strong>
          </span>
        </div>
      </form>
    </ReactModal>
  );
};

export default Login;
