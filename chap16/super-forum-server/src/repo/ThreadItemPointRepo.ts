import {getManager} from 'typeorm';
import {ThreadItem} from './ThreadItem'
import {User} from './User';
import {ThreadItemPoint} from './ThreadItemPoint';

export const updateThreadItemPoint = async (
  userId: string,
  threadItemId: string,
  increment: boolean
): Promise<string> => {
  if (!userId || userId === "0")
    return "User is not authenticated.";
  
  let message = "Failed to increment thread point";
  const threadItem = await ThreadItem.findOne({
    where: {id: threadItemId},
    relations: ["user"],
  });

  if (threadItem!.user!.id === userId) {
    message = "Error: users cannot increment their own thread item";
    return message;
  }

  const user = await User.findOne({where: {id: userId}});
  const existingPoint = await ThreadItemPoint.findOne({
    where: {
      threadItem: {id: threadItemId},
      user: {id: userId},
    },
    relations: ["threadItem"],
  });

  await getManager().transaction(async (manager) => {
    if (existingPoint) {
      if (increment) {
        if (existingPoint.isDecrement) {
          await manager.remove(existingPoint);
          threadItem!.points = Number(threadItem!.points) + 1;
          threadItem!.lastModifiedOn = new Date();
          await manager.save(threadItem);
        }
      } else {
        if (!existingPoint.isDecrement) {
          await manager.remove(existingPoint);
          threadItem!.points = Number(threadItem!.points) - 1;
          threadItem!.lastModifiedOn = new Date();
          await manager.save(threadItem);
        }
      }
    } else {
      const threadItemPoint = manager.create(ThreadItemPoint, {
        isDecrement: !increment,
        threadItem: threadItem!,
        user: user!
      });
      await manager.save(threadItemPoint);
      if (increment)
        threadItem!.points = Number(threadItem!.points) + 1;
      else
        threadItem!.points = Number(threadItem!.points) - 1;
      threadItem!.lastModifiedOn = new Date();
      await manager.save(threadItem);
    }
    message = `Successfully ${
      increment ? "incremented" : "decremented"
    } point.`;
  });

  return message;
};
