import RichEditor from "../../editor/RichEditor";
import UserNameAndTime from "./UserNameAndTime";
import ThreadPointsInline from '../../ThreadPointsInline';

interface ThreadResponseProps {
  body?: string;
  userName?: string;
  lastModifiedOn?: Date;
  points: number;
  readOnly?: boolean; 
  threadItemId: string;
}

function ThreadResponse({
  body,
  userName,
  lastModifiedOn,
  points,
  readOnly,
  threadItemId,
}: ThreadResponseProps) {
  return (
    <div>
      <div>
        <UserNameAndTime userName={userName} lastModifiedOn={lastModifiedOn} /> 
        <span style={{marginLeft: "1em"}}>
          <ThreadPointsInline 
            points={points || 0}
            threadItemId={threadItemId}
          />
        </span>
      </div>
      <div className="thread-body-editor">
        <RichEditor existingBody={body} readOnly={readOnly}/>
      </div>
    </div>
  );
};

export default ThreadResponse;
