import { useState, useEffect } from "react";

interface ThreadTitleProps {
  title?: string;
  readOnly: boolean;
  sendOutTitle: (title: string) => void;
}

function ThreadTitle({
  title,
  readOnly,
  sendOutTitle,
}: ThreadTitleProps) {
  const [currentTitle, setCurrentTitle] = useState("");
  useEffect(() => {
    setCurrentTitle(title || "");
  }, [title]);

  function onChangeTitle(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setCurrentTitle(e.target.value);
    sendOutTitle(e.target.value);
  };

  return (
    <div className="thread-title-container">
      <strong>Title</strong>
      <div className="field">
        <input
          type="text"
          value={currentTitle}
          onChange={onChangeTitle}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

export default ThreadTitle;
