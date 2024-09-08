import { getTimePastIfLessThanDay } from "../../../common/dates";

interface UserNameAndTimeProps {
  userName?: string;
  lastModifiedOn?: Date;
}

function UserNameAndTime({
  userName,
  lastModifiedOn,
}: UserNameAndTimeProps) {
  return (
    <span>
      <strong>{userName}</strong>
      <label style={{ marginLeft: "1em" }}>
        {lastModifiedOn ? getTimePastIfLessThanDay(lastModifiedOn) : ""}
      </label>
    </span>
  );
};

export default UserNameAndTime;
