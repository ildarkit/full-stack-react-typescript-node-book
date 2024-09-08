import { useState, useCallback, useMemo } from "react";
import { Editable, withReact, useSlate, Slate } from "slate-react";
import { 
  Editor,
  Transforms,
  createEditor,
  Descendant,
  Node,
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

export function getTextFromNodes(nodes: Node[]) {
  return nodes.map((n: Node) => Node.string(n)).join("\n");
}; 

const HOTKEYS: { [keyName: string]: string } = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];

const INITIAL_VALUE: Descendant[] = [
  {
    type: "paragraph",
    children: [{text: ""}],
  },
];

function parseValue(val?: string): Descendant[] {
  return val && val.length > 0 ? JSON.parse(val) : INITIAL_VALUE;
} 

class RichEditorProps {
  existingBody?: string;
  readOnly?: boolean = false;
  sendOutBody?: (body: Descendant[]) => void;
}

function RichEditor({ 
  existingBody,
  readOnly,
  sendOutBody,
}: RichEditorProps) {
  const [value, setValue] = useState<Descendant[]>(() => parseValue(existingBody));
  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []); 

  function onChangeEditorValue(value: Descendant[]) {
    setValue(value);
    sendOutBody && sendOutBody(value);
  };

  return (
    <Slate editor={editor} initialValue={value} onChange={onChangeEditorValue}>
      {readOnly ? null : (
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
      )}
      <Editable
        className="editor"
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter your post here."
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
        readOnly={readOnly}
      />
    </Slate>
  );
};

function MarkButton({ format, icon }: { format: string; icon: string }) {
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

function isMarkActive(editor: Editor, format: string) {
  const marks: any = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

function toggleMark(editor: Editor, format: string) {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

function BlockButton({ format, icon }: { format: string; icon: string }) {
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

function isBlockActive(editor: Editor, format: string) {
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

function toggleBlock(editor: Editor, format: string) {
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

function Element({
  attributes,
  children,
  element,
}: {
  attributes: any;
  children: any;
  element: any;
}) {
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

function Leaf({
  attributes,
  children,
  leaf,
}: {
  attributes: any;
  children: any;
  leaf: any;
}) {
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
