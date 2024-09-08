import { useEffect, useState } from "react";
import ThreadItem from "../../../models/ThreadItem";
import ThreadResponse from "./ThreadResponse";

interface ThreadResponsesBuilderProps {
  threadItems?: Array<ThreadItem>;
  readOnly?: boolean;
  refreshThread?: () => void;
}

function ThreadResponsesBuilder({
  threadItems,
  readOnly,
  refreshThread,
}: ThreadResponsesBuilderProps) {
  const [responseElements, setResponseElements] = useState<
    JSX.Element | null
  >(null);

  useEffect(() => {
    if (threadItems) {
      const thResponses = threadItems.map((ti) => {
        return (
          <li key={`thr-${ti.id}`}>
            <ThreadResponse
              body={ti.body}
              userName={ti.user.userName}
              lastModifiedOn={ti.createdOn}
              points={ti.points}
              readOnly={readOnly}
              threadItemId={ti?.id || "0"}
              // threadId={ti.thread.id}
              // refreshThread={refreshThread}
            />
          </li>
        );
      });
      if (thResponses.length > 0)
        setResponseElements(<ul>{thResponses}</ul>);
    }
  }, [threadItems, readOnly]);

  return (
    <div className="thread-body-container">
      <strong style={{ marginBottom: ".75em" }}>Responses</strong>
      {responseElements}
    </div>
  );
};

export default ThreadResponsesBuilder;
