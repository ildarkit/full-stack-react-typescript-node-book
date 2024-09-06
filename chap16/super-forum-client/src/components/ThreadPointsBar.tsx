import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHeart,
  faReplyAll,
  faChevronDown,
  faChevronUp
} from "@fortawesome/free-solid-svg-icons";
import { useWindowDimensions } from "../hooks/useWindowDimensions";
import { gql, useMutation } from "@apollo/client";

const UpdateThreadPoint = gql`
  mutation UpdateThreadPoint(
    $threadId: ID!
    $increment: Boolean!
  ) {
    updateThreadPoint(
      threadId: $threadId
      increment: $increment
    )
  }
`;

export class ThreadPointsBarProps {
  points: number = 0;
  responseCount?: number;
  threadId?: string;
  allowUpdatePoints?: boolean = false;
  refreshThread?: () => void;
}

const ThreadPointsBar: FC<ThreadPointsBarProps> = ({
  points,
  responseCount,
  threadId,
  allowUpdatePoints,
  refreshThread,
}) => {
  const { width } = useWindowDimensions();
  const [execUpdateThreadPoint] = useMutation(UpdateThreadPoint);

  const onClickIncThreadPoint = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    e.preventDefault();
    await execUpdateThreadPoint({
      variables: {
        threadId,
        increment: true,
      },
    });
    refreshThread && refreshThread();
  };

  const onClickDecThreadPoint = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    e.preventDefault();
    await execUpdateThreadPoint({
      variables: {
        threadId,
        increment: false,
      },
    });
    refreshThread && refreshThread();
  };

  if (width > 768) {
    return (
      <div className="threadcard-points">
        <div className="threadcard-points-item">
          <div 
            className="threadcard-points-item-btn"
            style={{ display: `${allowUpdatePoints ? "block" : "none"}`}}
          >
            <FontAwesomeIcon
              icon={faChevronUp}
              className="point-icon"
              onClick={onClickIncThreadPoint}
            />
          </div>
          {points}
          <div 
            className="threadcard-points-item-btn"
            style={{ display: `${allowUpdatePoints ? "block" : "none"}`}}
          >
            <FontAwesomeIcon
              icon={faChevronDown}
              className="point-icon"
              onClick={onClickDecThreadPoint}
            />
          </div>
          <FontAwesomeIcon icon={faHeart} className="points-icon" />
        </div>
        <div className="threadcard-points-item">
          {responseCount}
          <br />
          <FontAwesomeIcon icon={faReplyAll} className="points-icon" />
        </div>
      </div>
    );
  }
  return null;
};

export default ThreadPointsBar;
