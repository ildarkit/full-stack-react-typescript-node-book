import UserNameAndTime from "./UserNameAndTime";

interface ThreadHeaderProps {
  userName?: string;
  lastModifiedOn: Date;
  title?: string;
}

function ThreadHeader({
  userName,
  lastModifiedOn,
  title,
}: ThreadHeaderProps) {
  return (
    <div className="thread-header-container">
      <h3>{title}</h3>
      <UserNameAndTime userName={userName} lastModifiedOn={lastModifiedOn} />
    </div>
  );
};

export default ThreadHeader;
