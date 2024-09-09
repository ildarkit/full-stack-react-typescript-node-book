import { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import { Descendant } from "slate";
import { useSelector } from "react-redux";
import { AppState } from "../../../store/AppState";
import RichEditor from "../../editor/RichEditor";
import UserNameAndTime from "./UserNameAndTime";
import ThreadPointsInline from '../../ThreadPointsInline';

const CreateThreadItem = gql`
  mutation createThreadItem($userId: ID!, $threadId: ID!, $body: String!) {
    createThreadItem(userId: $userId, threadId: $threadId, body: $body) {
      messages
    }
  }
`;

interface ThreadResponseProps {
  body?: string;
  userName?: string;
  lastModifiedOn?: Date;
  points: number;
  readOnly: boolean; 
  threadItemId: string;
  threadId?: string;
  refreshThread?: () => void;
}

function ThreadResponse({
  body,
  userName,
  lastModifiedOn,
  points,
  readOnly,
  threadItemId,
  threadId,
  refreshThread,
}: ThreadResponseProps) {
  const user = useSelector((state: AppState) => state.user);
  const [execCreateThreadItem] = useMutation(CreateThreadItem);
  const [postMsg, setPostMsg] = useState("");
  const [bodyToSave, setBodyToSave] = useState("");

  useEffect(() => {
    if (body) 
      setBodyToSave(body);
  }, [body]);

  async function onClickPost(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();

    if (!user) {
      setPostMsg("Please login before adding a response.");
    } else if (!threadId) {
      setPostMsg("A parent thread must exist before a response can be posted.");
    } else if (!bodyToSave) {
      setPostMsg("Please enter some text.");
    } else {
      await execCreateThreadItem({
        variables: {
          userId: user ? user.id : "0",
          threadId,
          body: bodyToSave,
        },
      });
      refreshThread && refreshThread();
    }
  };

  function receiveBody(body: Descendant[]) {
    const newBody = JSON.stringify(body);
    if (bodyToSave !== newBody) {
      setBodyToSave(newBody);
    }
  };

  return (
    <div>
      <div>
        <UserNameAndTime userName={userName} lastModifiedOn={lastModifiedOn} /> 
        {threadItemId}
        {readOnly ? (
          <span style={{ display: "inline-block", marginLeft: "1em" }}>
            <ThreadPointsInline 
              points={points || 0}
              threadItemId={threadItemId}
              refreshThread={refreshThread}
              allowUpdatePoints={true}
            />
          </span>
        ) : null}
      </div>
      <div className="thread-body-editor">
        <RichEditor 
          existingBody={body}
          readOnly={readOnly}
          sendOutBody={receiveBody}
        />
      </div>
      {!readOnly && threadId ? (
        <>
          <div style={{ marginTop: ".5em" }}>
            <button className="action-btn" onClick={onClickPost}>
              Post Response
            </button>
          </div>
          <strong>{postMsg}</strong>
        </>
      ) : null}
    </div>
  );
};

export default ThreadResponse;
