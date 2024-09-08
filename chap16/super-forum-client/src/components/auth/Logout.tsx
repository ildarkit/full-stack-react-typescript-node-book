import ReactModal from "react-modal";
import {gql, useMutation} from '@apollo/client';
import {useSelector} from 'react-redux';
import {AppState} from '../../store/AppState';
import {ModalProps} from "../types/ModalProps";
import useRefreshReduxMe, {Me} from '../../hooks/useRefreshReduxMe';
import "./Logout.css";

const LogoutMutation = gql`
  mutation logout($userName: String!) {
    logout(userName: $userName)
  }
`;

function Logout({ isOpen, onClickToggle }: ModalProps) { 
  const user = useSelector((state: AppState) => state.user);
  const [execLogout] = useMutation(LogoutMutation, {
    refetchQueries: [
      {query: Me},
    ],
  });
  const {deleteMe} = useRefreshReduxMe();

  async function onClickLogout(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    onClickToggle(e);
    await execLogout({
      variables: {
        userName: user?.userName ?? "",
      },
    });
    deleteMe();
  };

  function onClickCancel(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
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
        <div className="logout-inputs">
          Are you sure you want to logout?
        </div>
        <div className="form-buttons form-buttons-sm">
          <div className="form-btn-left">
            <button
              style={{ marginLeft: ".5em" }}
              className="action-btn"
              onClick={onClickLogout}
            >
            Logout
            </button>
            <button
              style={{ marginLeft: ".5em" }}
              className="cancel-btn"
              onClick={onClickCancel}
            >
            Close
            </button>
          </div>
        </div>
      </form>
    </ReactModal>
  )
}

export default Logout;
