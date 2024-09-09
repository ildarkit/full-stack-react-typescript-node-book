import {
  getThreadById,
  getThreadsByCategoryId,
  createThread,
  getThreadsLatest
} from '../repo/ThreadRepo';
import {createThreadItem, getThreadItemsByThreadId} from '../repo/ThreadItemRepo';
import {QueryOneResult, QueryArrayResult} from '../repo/QueryArrayResult';
import {GqlContext} from './GqlContext';
import {Thread} from '../repo/Thread';
import {ThreadItem} from '../repo/ThreadItem';
import {ThreadCategory} from '../repo/ThreadCategory';
import {updateThreadPoint} from '../repo/ThreadPointRepo';
import {updateThreadItemPoint} from '../repo/ThreadItemPointRepo';
import {User} from '../repo/User';
import {
  register,
  login,
  logout,
  me,
  changePassword,
  UserResult
} from '../repo/UserRepo';
import {getAllCategories} from '../repo/ThreadCategoryRepo';
import { getTopCategoryThread } from '../repo/CategoryThreadRepo'; 
import CategoryThread from '../repo/CategoryThread';

const UNKNOWN_ERROR = "An error has occured";

interface EntityResult {
  messages: Array<string>;
}

const resolvers = {
  UserResult: {
    __resolveType(obj: any, context: GqlContext, info: any) {
      if (obj.messages) {
        return "EntityResult";
      }
      return "User";
    },
  },
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
            : [UNKNOWN_ERROR],
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
            : [UNKNOWN_ERROR],
        };
      } catch (ex) {
        throw ex;
      }
    },

    me: async (
      obj: any,
      args: null,
      ctx: GqlContext,
      info: any
    ): Promise<User | EntityResult> => {
      let user: UserResult;
      try {
        if (!ctx.req.session?.userID)
          return {
            messages: ["User not logged in."],
          };
        user = await me(ctx.req.session.userID);
        if (user && user.user)
          return user.user;
        return {
          messages: user.messages ? user.messages : [UNKNOWN_ERROR],
        };
      } catch (ex) {
        throw ex;
      }
    },

    getAllCategories: async (
      obj: any,
      args: null,
      ctx: GqlContext,
      info: any
    ): Promise<Array<ThreadCategory> | EntityResult> => {
      let cats: QueryArrayResult<ThreadCategory>;
      try {
        cats = await getAllCategories();
        if (cats.entities)
          return cats.entities;
        return {
          messages: cats.messages ? cats.messages : [UNKNOWN_ERROR],
        };
      } catch (ex) {
        throw ex;
      }
    },

    getThreadsLatest: async (
      obj: any,
      args: null,
      ctx: GqlContext,
      info: any
    ): Promise<{threads: Array<Thread>} | EntityResult> => {
      let threads: QueryArrayResult<Thread>;
      try {
        threads = await getThreadsLatest();
        if (threads.entities)
          return {
            threads: threads.entities,
          };
        return {
          messages: threads.messages
            ? threads.messages
            : [UNKNOWN_ERROR],
        };
      } catch (ex) {
        throw ex;
      }
    },

    getTopCategoryThread: async (
      obj: any,
      args: null,
      ctx: GqlContext,
      info: any
    ): Promise<Array<CategoryThread>> => {
      try {
        return await getTopCategoryThread(); 
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
            : [UNKNOWN_ERROR],
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
            : [UNKNOWN_ERROR],
        };
      } catch (ex) {
        throw ex;
      }
    },

    updateThreadPoint: async (
      obj: any,
      args: {
        threadId: string,
        increment: boolean
      },
      ctx: GqlContext,
      info: any
    ): Promise<string> => {
      let result = "";
      try {
        if (!ctx.req.session || !ctx.req.session?.userID)
          return "You must be logged in to set likes.";
        result = await updateThreadPoint(
          ctx.req.session!.userID,
          args.threadId,
          args.increment
        );
        return result;
      } catch (ex) {
        throw ex;
      }
    },

    updateThreadItemPoint: async (
      obj: any,
      args: {
        threadItemId: string,
        increment: boolean
      },
      ctx: GqlContext,
      info: any
    ): Promise<string> => {
      let result;
      try {
        if (!ctx.req.session || !ctx.req.session?.userID)
          return "You must be logged in to set likes.";
        result = await updateThreadItemPoint(
          ctx.req.session!.userID,
          args.threadItemId,
          args.increment
        );
        return result;
      } catch (ex) {
        throw ex;
      }
    },

    register: async (
      obj: any,
      args: {
        email: string,
        userName: string,
        password: string
      },
      ctx: GqlContext,
      info: any
    ): Promise<string> => {
      let user: UserResult;
      let message = "Registration successfull.";
      try {
        user = await register(args.email, args.userName, args.password);
        if (user && user.user)
          return message;
        return user && user.messages ? user.messages[0] : UNKNOWN_ERROR;
      } catch (ex) {
        throw ex;
      }
    },

    login: async (
      obj: any,
      args: {
        userName: string,
        password: string
      },
      ctx: GqlContext,
      info: any
    ): Promise<string> => {
      let user: UserResult;
      try {
        user = await login(args.userName, args.password);
        if (user && user.user) {
          ctx.req.session!.userID = user.user!.id;
          return `Login successfull for userId ${ctx.req.session!.userID}`;
        }
        return user && user.messages ? user.messages[0] : UNKNOWN_ERROR;
      } catch (ex) {
        console.error(ex.message);
        throw ex;
      }
    },

    logout: async (
      obj: any,
      args: {
        userName: string,
      },
      ctx: GqlContext,
      info: any
    ): Promise<string> => {
      try {
        const result = await logout(args.userName);
        ctx.req.session?.destroy((err: any) => {
          if (err) {
            console.error("session logout failed");
            return;
          }
          console.log("session destroyed");
        }); 
        return result;
      } catch (ex) {
        console.error(ex.message);
        throw ex;
      }
    },

    changePassword: async (
      obj: any,
      args: {
        newPassword: string,
      },
      ctx: GqlContext,
      info: any
    ): Promise<string> => {
      try {
        if (!ctx.req.session || !ctx.req.session.userID)
          return "You must logged in befor you can change your password.";
        const result = await changePassword(
          ctx.req.session.userID,
          args.newPassword
        ); 
        return result;
      } catch (ex) {
        console.error(ex.message);
        throw ex;
      }
    },
  },
};

export default resolvers;
