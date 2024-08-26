import MainHeader from './MainHeader';
import Category from '../../../models/Category';

const Main = () => {
  return <main className="content">
    <MainHeader category={new Category("1", "Main")}/>
    </main>;
};

export default Main;
