import {getThreadById, getThreadsByCategoryId, createThread} from '../repo/ThreadRepo';
import {createThreadItem, getThreadItemsByThreadId} from '../repo/ThreadItemRepo';
import {QueryOneResult, QueryArrayResult} from '../repo/QueryArrayResult';
import {GqlContext} from './GqlContext';
import {Thread} from '../repo/Thread';
import {ThreadItem} from '../repo/ThreadItem';


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
  ThreadArrayResult: {
    __resolveType(obj: any, context: GqlContext, info: any) {
      if (obj.messages)
        return "EntityResult";
      return "ThreadArray";
    },
  },
  ThreadItemResult: {
    __resolveType(obj: any, context: GqlContext, info: any) {
      if (obj.messages) {
        return "EntityResult";
      }
      return "ThreadItem";
    },
  },
  ThreadItemArrayResult: {
    __resolveType(obj: any, context: GqlContext, info: any) {
      if (obj.messages)
        return "EntityResult";
      return "ThreadItemArray";
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
    getThreadsByCategoryId: async (
      obj: any,
      args: {categoryId: string},
      ctx: GqlContext,
      info: any
    ): Promise<{threads: Array<Thread>} | EntityResult> => {
      let threads: QueryArrayResult<Thread>;
      try {
        threads = await getThreadsByCategoryId(args.categoryId);
        if (threads.entities)
          return {
            threads: threads.entities,
          };
        return {
          messages: threads.messages
            ? threads.messages
            : ["An error has occured"],
        };
      } catch (ex) {
        throw ex;
      }
    },

    getThreadItemsByThreadId: async (
      obj: any,
      args: {threadId: string},
      ctx: GqlContext,
      info: any
    ): Promise<{threadItems: Array<ThreadItem>} | EntityResult> => {
      let threadItems: QueryArrayResult<ThreadItem>;
      try {
        threadItems = await getThreadItemsByThreadId(args.threadId);
        if (threadItems.entities)
          return {
            threadItems: threadItems.entities,
          };
        return {
          messages: threadItems.messages
            ? threadItems.messages
            : ["An error has occured"],
        };
      } catch (ex) {
        throw ex;
      }
    },
  },
  Mutation: {
    createThread: async (
      obj: any,
      args: {
        userId: string,
        categoryId: string,
        title: string,
        body: string
      },
      ctx: GqlContext,
      info: any
    ): Promise<EntityResult> => {
      let result: QueryOneResult<Thread>;
      try {
        result = await createThread(
          args.userId,
          args.categoryId,
          args.title,
          args.body
        );
        return {
          messages: result.messages
            ? result.messages
            : ["Ane error occured"],
        };
      } catch (ex) {
        throw ex;
      }
    },

    createThreadItem: async (
      obj: any,
      args: {
        userId: string,
        threadId: string,
        body: string
      },
      ctx: GqlContext,
      info: any
    ): Promise<EntityResult> => {
      let result: QueryOneResult<ThreadItem>;
      try {
        result = await createThreadItem(
          args.userId,
          args.threadId,
          args.body
        );
        return {
          messages: result.messages
            ? result.messages
            : ["Ane error occured"],
        };
      } catch (ex) {
        throw ex;
      }
    },
  },
};

export default resolvers;
