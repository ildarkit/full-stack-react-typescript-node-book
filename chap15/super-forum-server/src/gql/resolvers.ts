import {getThreadById} from '../repo/ThreadRepo';
import {QueryOneResult} from '../repo/QueryArrayResult';
import {GqlContext} from './GqlContext';
import {Thread} from '../repo/Thread';


interface EntityResult {
  messages: Array<string>;
}

const resolvers = {
  ThreadResult: {
    __resolveType(obj: any, context: GqlContext, info: any) {
      if (obj.messages) {
        return "EntityResult";
      }
      return "Thread";
    },
  },
  Query: {
    getThreadById: async (
      obj: any,
      args: {id: string},
      ctx: GqlContext,
      info: any
    ): Promise<Thread | EntityResult> => {
      let thread: QueryOneResult<Thread>;
      try {
        thread = await getThreadById(args.id);
        if (thread.entity)
          return thread.entity;
        return {
          messages: thread.messages ? thread.messages : ["test"],
        };
      } catch (ex) {
        throw ex;
      }
    },
  },
};

export default resolvers;
