import RichEditor from "../../editor/RichEditor";
import { Descendant } from "slate";

interface ThreadBodyProps {
  body?: string;
  readOnly?: boolean;
  sendOutBody: (body: Descendant[]) => void;
}

function ThreadBody({
  body,
  readOnly,
  sendOutBody
}: ThreadBodyProps) {
  return (
    <div className="thread-body-container">
      <strong>Body</strong>
      <div className="thread-body-editor">
        <RichEditor 
          existingBody={body}
          readOnly={readOnly}
          sendOutBody={sendOutBody}
        />
      </div>
    </div>
  );
};

export default ThreadBody;
