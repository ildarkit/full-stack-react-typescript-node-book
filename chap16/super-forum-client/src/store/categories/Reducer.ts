import Category from "../../models/Category";

export const ThreadCategoriesType = "CATEGORIES_SET";

export interface CategoryAction {
  type: string;
  payload: Array<Category> | null;
}

export const ThreadCategoriesReducer = (
  state: any = null,
  action: CategoryAction
): Array<Category> | null => {
  switch (action.type) {
    case ThreadCategoriesType:
      return action.payload;
    default:
      return state;
  }
};
