import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import DropDown, {Option} from 'react-dropdown';
import Category from '../models/Category';
import {AppState} from '../store/AppState';
import 'react-dropdown/style.css';

const defaultLabel = "Select a category";
const defaultOption = {
  value: "0",
  label: defaultLabel,
};

class CategoryDropDownProps {
  sendOutSelectedCategory?: (cat: Category) => void;
  navigate?: boolean = false;
  preselectedCategory?: Category; 
}

function CategoryDropDown({
  sendOutSelectedCategory,
  navigate,
  preselectedCategory,
}: CategoryDropDownProps) {
  const categories = useSelector((state: AppState) => state.categories);
  const [categoryOptions, setCategoryOptions] = 
    useState<Array<string | Option>>([defaultOption]);
  const [selectedOption, setSelectedOption] = useState<Option>(defaultOption);
  const history = useNavigate();

  useEffect(() => {
    if (categories) {
      const catOptions: Array<Option> = categories
        .map((cat: Category) => (
          {
            value: cat.id,
            label: cat.name,
          }
        ));
      setCategoryOptions(catOptions);
      setSelectedOption({
        value: preselectedCategory ? preselectedCategory.id : "0",
        label: preselectedCategory ? preselectedCategory.name : defaultLabel,
      });
    }
  }, [categories, preselectedCategory]);

  function onChangeDropDown(selected: Option) {
    setSelectedOption(selected);
    if (sendOutSelectedCategory)
      sendOutSelectedCategory(
        new Category(selected.value, selected.label?.valueOf().toString() ?? "")
      );
    if (navigate)
      history(`/categorythreads/${selected.value}`);
  };

  return (
    <DropDown
      className="thread-category-dropdown"
      options={categoryOptions}
      onChange={onChangeDropDown}
      value={selectedOption}
      placeholder={defaultLabel}
    />
  );
};

export default CategoryDropDown;
