import Category from "../../../models/Category";
import CategoryDropDown from "../../CategoryDropDown";

interface ThreadCategoryProps {
  category?: Category;
  sendOutSelectedCategory: (cat: Category) => void;
}

function ThreadCategory({
  category,
  sendOutSelectedCategory
}: ThreadCategoryProps) {
  return (
    <div className="thread-category-container">
      <strong>{category?.name}</strong>
      <div style={{ marginTop: "1em" }}>
        <CategoryDropDown
          preselectedCategory={category}
          sendOutSelectedCategory={sendOutSelectedCategory}
        />
      </div>
    </div>
  );
};

export default ThreadCategory;
