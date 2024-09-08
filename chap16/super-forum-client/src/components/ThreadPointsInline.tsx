import { gql, useMutation } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faChevronUp,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";
import "./ThreadPointsInline.css";
import useUpdateThreadPoint from "../hooks/useUpdateThreadPoint";

const UpdateThreadItemPoint = gql`
  mutation UpdateThreadItemPoint(
    $threadItemId: ID!
    $increment: Boolean!
  ) {
    updateThreadItemPoint(
      threadItemId: $threadItemId
      increment: $increment
    )
  }
`;

class ThreadPointsInlineProps {
  points: number = 0;
  threadId?: string;
  threadItemId?: string;
  allowUpdatePoints?: boolean = false;
  refreshThread?: () => void;
}

function ThreadPointsInline({
  points,
  threadId,
  threadItemId,
  allowUpdatePoints,
  refreshThread,
}: ThreadPointsInlineProps) {
  const [execUpdateThreadItemPoint] = useMutation(UpdateThreadItemPoint);
  const {onClickDecThreadPoint, onClickIncThreadPoint} = useUpdateThreadPoint(
    refreshThread,
    threadId,
  );

  async function onClickIncThreadItemPoint(
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) {
    e.preventDefault();
    await execUpdateThreadItemPoint({
      variables: {
        threadItemId,
        increment: true,
      },
    });
    refreshThread && refreshThread();
  };

  async function onClickDecThreadItemPoint(
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) {
    e.preventDefault();
    await execUpdateThreadItemPoint({
      variables: {
        threadItemId,
        increment: false,
      },
    });
    refreshThread && refreshThread();
  };

  return (
    <span className="threadpointsinline-item">
      <div
        className="threadpointsinline-item-btn"
        style={{ display: `${allowUpdatePoints ? "block" : "none"}` }}
      >
        <FontAwesomeIcon 
          icon={faChevronUp}
          className="point-icon"
          onClick={threadId ? onClickIncThreadPoint : onClickIncThreadItemPoint}
        />
      </div>
      {points}
      <div
        className="threadpointsinline-item-btn"
        style={{ display: `${allowUpdatePoints ? "block" : "none"}` }}
      >
        <FontAwesomeIcon 
          icon={faChevronDown}
          className="point-icon"
          onClick={threadId ? onClickDecThreadPoint : onClickDecThreadItemPoint}
        />
      </div>
      <div className="threadpointsinline-item-btn">
        <FontAwesomeIcon
          icon={faHeart}
          className="points-icon"
        />
      </div>
    </span>
  );
};

export default ThreadPointsInline;
