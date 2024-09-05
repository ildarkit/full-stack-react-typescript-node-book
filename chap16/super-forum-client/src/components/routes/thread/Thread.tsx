import { useEffect, useState } from "react";
import {gql, useLazyQuery} from "@apollo/client";
import { useParams } from "react-router-dom";
import "./Thread.css";
import ThreadHeader from "./ThreadHeader";
import ThreadCategory from "./ThreadCategory";
import ThreadTitle from "./ThreadTitle";
import ThreadModel from "../../../models/Thread";
import { getThreadById } from "../../../services/DataService";
import Nav from "../../areas/Nav";
import ThreadBody from './ThreadBody';
import ThreadResponsesBuilder from "./ThreadResponsesBuilder";
import ThreadPointsBar from '../../ThreadPointsBar';

const GetThreadById = gql`
  query GetThreadById($id: ID!) {
    getThreadById(id: $id) {
      ... on EntityResult {
        messages
      }

      ... on Thread {
        id
        user {
          userName
        }
        lastModifiedOn
        title
        body
        points
        category {
          id
          name
        }
        threadItems {
          id
          body
          points
          user {
            userName
          }
        }
      }
    }
  }
`;

const Thread = () => {
  const [execGetThreadById, {data: threadData}] = useLazyQuery(GetThreadById); 
  const [thread, setThread] = useState<ThreadModel | undefined>();
  const { id } = useParams();
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    const parsed = id ? Number.parseInt(id) : undefined;
    if (parsed && !Number.isNaN(parsed) && parsed > 0) {
      execGetThreadById({
        variables: {
          id,
        },
      });
    }
  }, [id, execGetThreadById]);

  useEffect(() => {
    if (threadData && threadData.getThreadById)
      setThread(threadData.getThreadById);
    else setThread(undefined);
  }, [threadData]);

  return (
    <div className="screen-root-container">
      <div className="thread-nav-container">
        <Nav />
      </div>
      <div className="thread-content-container">
        <div className="thread-content-post-container">
          <ThreadHeader
            userName={thread?.user.userName}
            lastModifiedOn={thread ? thread.lastModifiedOn : new Date()}
            title={thread?.title}
          />
          <ThreadCategory category={thread?.category} />
          <ThreadTitle title={thread?.title} />
          <ThreadBody 
            body={thread?.body}
            readOnly={readOnly}
          /> 
        </div>
        <div className="thread-content-points-container">
          <ThreadPointsBar
            points={thread?.points || 0}
            responseCount={
              thread && thread.threadItems && thread.threadItems.length
            }
          />
        </div>
      </div>
      <div className="thread-content-response-container">
        <hr className="thread-section-divider" />
        <ThreadResponsesBuilder 
          threadItems={thread?.threadItems}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

export default Thread;
