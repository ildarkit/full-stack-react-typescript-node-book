import { useState, useCallback, useMemo, useEffect, FC } from "react";
import { Editable, withReact, useSlate, Slate } from "slate-react";
import { 
  Editor,
  Transforms,
  createEditor,
  Descendant,
  Element as SlateElement
} from "slate";
import isHotkey from "is-hotkey";
import { withHistory } from "slate-history";
import { Button, Toolbar } from "./RichTextControls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faItalic,
  faUnderline,
  faCode,
  faHeading,
  faQuoteRight,
  faListOl,
  faListUl,
} from "@fortawesome/free-solid-svg-icons";
import "./RichEditor.css";

const HOTKEYS: { [keyName: string]: string } = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];

const INITIAL_VALUE: Descendant = {
  type: "paragraph",
  children: [{text: "Enter your post here."}],
};

function initValue(val: string | undefined): Descendant[] {
  return val ? [{...INITIAL_VALUE, children: [{text: val}]}] : [INITIAL_VALUE];
} 

interface RichEditorProps {
  existingBody?: string;
}

const RichEditor: FC<RichEditorProps> = ({ existingBody }) => {
  const [value, setValue] = useState<Descendant[]>(() => initValue(existingBody));
  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []); 

  useEffect(() => {
    setValue(initValue(existingBody));
  }, [existingBody]);

  const onChangeEditorValue = (value: Descendant[]) => {
    setValue(value);
  };

  return (
    <Slate editor={editor} initialValue={value} onChange={onChangeEditorValue}>
      <Toolbar>
        <MarkButton format="bold" icon="bold" />
        <MarkButton format="italic" icon="italic" />
        <MarkButton format="underline" icon="underlined" />
        <MarkButton format="code" icon="code" />
        <BlockButton format="heading-one" icon="header1" />
        <BlockButton format="block-quote" icon="in_quotes" />
        <BlockButton format="numbered-list" icon="list_numbered" />
        <BlockButton format="bulleted-list" icon="list_bulleted" />
      </Toolbar>
      <Editable
        className="editor"
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={(event) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              toggleMark(editor, mark);
            }
          }
        }}
      />
    </Slate>
  );
};

const MarkButton = ({ format, icon }: { format: string; icon: string }) => {
  const editor = useSlate();
  let thisIcon = faBold;
  if (icon === "italic") {
    thisIcon = faItalic;
  } else if (icon === "underlined") {
    thisIcon = faUnderline;
  } else if (icon === "code") {
    thisIcon = faCode;
  }
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event: any) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <FontAwesomeIcon icon={thisIcon} />
    </Button>
  );
};

const isMarkActive = (editor: Editor, format: string) => {
  const marks: any = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const BlockButton = ({ format, icon }: { format: string; icon: string }) => {
  const editor = useSlate();
  let thisIcon = faHeading;
  if (icon === "heading1") {
    thisIcon = faItalic;
  } else if (icon === "heading2") {
    thisIcon = faUnderline;
  } else if (icon === "in_quotes") {
    thisIcon = faQuoteRight;
  } else if (icon === "list_numbered") {
    thisIcon = faListOl;
  } else if (icon === "list_bulleted") {
    thisIcon = faListUl;
  }
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={(event: any) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <FontAwesomeIcon icon={thisIcon} />
    </Button>
  );
};

const isBlockActive = (editor: Editor, format: string) => {
  const {selection} = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => 
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n.type === format,
    })
  );

  return !!match;
};

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) => 
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true,
  });

  Transforms.setNodes<SlateElement>(editor, {
    type: isActive ? "paragraph" : isList ? "list-item" : format,
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const Element = ({
  attributes,
  children,
  element,
}: {
  attributes: any;
  children: any;
  element: any;
}) => {
  switch (element.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({
  attributes,
  children,
  leaf,
}: {
  attributes: any;
  children: any;
  leaf: any;
}) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.code) {
    children = <code>{children}</code>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

export default RichEditor;
