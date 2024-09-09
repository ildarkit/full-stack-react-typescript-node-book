import {FC, useState, useEffect} from 'react';
import CategoryThread from '../../../models/CategoryThread';
import './TopCategory.css';

interface TopCategoryProps {
  topCategories: Array<CategoryThread>;
}

const TopCategory: FC<TopCategoryProps> = ({topCategories}) => {
  const [threads, setThreads] = useState<JSX.Element | undefined>();

  useEffect(() => {
    if (topCategories && topCategories.length > 0) {
      const topThreadElements = topCategories.map(category =>
        <li key={category.threadId}>
          <span className="clickable-span">
            {category.title}
          </span>
        </li>
      );
      setThreads(
        <ul className="topcat-threads">
          {topThreadElements}
        </ul>
      );
    }
  }, [topCategories]);

  return (
    <div className="topcat-item-container">
      <div>
        <strong>{topCategories[0].categoryName}</strong>
      </div>
      {threads}
    </div>
  );
};

export default TopCategory;
