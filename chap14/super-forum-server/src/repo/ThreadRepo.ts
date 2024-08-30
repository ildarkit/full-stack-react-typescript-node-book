import {
  isThreadBodyValid,
  isThreadTitleValid,
} from "../common/validators/ThreadValidators";
import {Thread} from './Thread';
import {ThreadCategory} from './ThreadCategory';
import {User} from './User';
import {QueryArrayResult} from './QueryArrayResult';

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
