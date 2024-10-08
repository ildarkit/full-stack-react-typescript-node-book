import CategoryThread from "./CategoryThread";
import { Thread } from "./Thread";
import { ThreadCategory } from "./ThreadCategory";

export async function getTopCategoryThread(): Promise<Array<CategoryThread>> {
  const categories = await ThreadCategory.createQueryBuilder("threadCategory")
    .leftJoinAndSelect("threadCategory.threads", "thread")
    .getMany();

  const categoryThreads: Array<CategoryThread> = [];
  categories.sort((a: ThreadCategory, b: ThreadCategory) => {
    if (a.threads.length > b.threads.length) return -1;
    if (a.threads.length < b.threads.length) return 1;
    return 0;
  });
  const topCats = categories.slice(0, 3);
  topCats.forEach((cat) => {
    cat.threads.sort((a: Thread, b: Thread) => {
      if (a.createdOn > b.createdOn) return -1;
      if (a.createdOn < b.createdOn) return 1;
      return 0;
    });
    cat.threads.forEach(th => {
      categoryThreads.push(
        new CategoryThread(th.id, cat.id, cat.name, th.title, th.createdOn)
      );
    });
  });
  return categoryThreads;
}
