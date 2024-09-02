import {getManager} from 'typeorm';
import {Thread} from './Thread'
import {User} from './User';
import {ThreadPoint} from './ThreadPoint';

export const updateThreadPoint = async (
  userId: string,
  threadId: string,
  increment: boolean
): Promise<string> => {

  //todo: user authentication check
  
  let message = "Failed to increment thread point";
  const thread = await Thread.findOne({
    where: {id: threadId},
    relations: ["user"],
  });

  if (thread!.user!.id === userId) {
    message = "Error: users cannot increment thei own thread";
    return message;
  }

  const user = await User.findOne({where: {id: userId}});
  const existingPoint = await ThreadPoint.findOne({
    where: {
      thread: {id: threadId},
      user: {id: userId},
    },
    relations: ["thread"],
  });

  await getManager().transaction(async (manager) => {
    if (existingPoint) {
      if (increment) {
        if (existingPoint.isDecrement) {
          await manager.remove(existingPoint);
          thread!.points = Number(thread!.points) + 1;
          thread!.lastModifiedOn = new Date();
          await manager.save(thread);
        }
      } else {
        if (!existingPoint.isDecrement) {
          await manager.remove(existingPoint);
          thread!.points = Number(thread!.points) - 1;
          thread!.lastModifiedOn = new Date();
          await manager.save(thread);
        }
      }
    } else {
      const threadPoint = manager.create(ThreadPoint, {
        isDecrement: !increment,
        thread: thread!,
        user: user!
      });
      await manager.save(threadPoint);
      if (increment)
        thread!.points = Number(thread!.points) + 1;
      else
        thread!.points = Number(thread!.points) - 1;
      thread!.lastModifiedOn = new Date();
      await manager.save(thread);
    }
    message = `Successfully ${
      increment ? "incremented" : "decremented"
    } point.`;
  });

  return message;
};
