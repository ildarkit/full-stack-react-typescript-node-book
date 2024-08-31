import {
  isThreadBodyValid,
  isThreadTitleValid,
} from "../common/validators/ThreadValidators";
import {Thread} from './Thread';
import {ThreadCategory} from './ThreadCategory';
import {User} from './User';
import {QueryArrayResult, QueryOneResult} from './QueryArrayResult';

export const createThread = async (
  userId: string | undefined,
  categoryId: string,
  title: string,
  body: string,
): Promise<QueryArrayResult<Thread>> => {

  const titleMsg = isThreadTitleValid(title);
  if (titleMsg)
    return {
      messages: [titleMsg],
    };

  const bodyMsg = isThreadBodyValid(body);
  if (bodyMsg)
    return {
      messages: [bodyMsg],
    };

  const user = !userId ? undefined : await User.findOne({where: {id: userId}});
  if (!user)
    return {
      messages: ["User not logged in."],
    };

  const category = await ThreadCategory.findOne({
    where: {id: categoryId},
  });

  if (!category)
    return {
      messages: ["category not found."],
    };

  const thread = await Thread.create({
    title,
    body,
    user,
    category,
  }).save();

  if (!thread) 
    return {
      messages: ["Failed to create thread."],
    };

  return {
    messages: ["Thread created successfully."],
  };
};

export const getThreadById = async (
  id: string
): Promise<QueryOneResult<Thread>> => {
  const thread = await Thread.findOne({
    where: {id}
  });
  if (!thread)
    return {
      messages: ["Thread not found."],
    };
  return {
    entity: thread,
  };
};

export const getThreadsByCategoryId = async (
  categoryId: string
): Promise<QueryArrayResult<Thread>> => {
  const threads = await Thread.createQueryBuilder("thread")
    .where(`thread."categoryId" = :categoryId`, {categoryId})
    .leftJoinAndSelect("thread.category", "category")
    .orderBy("thread.createdOn", "DESC")
    .getMany();
  if (!threads)
    return {
      messages: ["Threads of category not found."],
    };
  console.log(threads);
  return {
    entities: threads,
  };
};
