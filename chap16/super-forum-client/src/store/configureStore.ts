import {createStore} from "redux";
import {rootReducer} from "./AppState";

export default function configureStore() {
  return createStore(rootReducer, {});
};
