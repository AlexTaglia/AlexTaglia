import { combineReducers } from "redux";
import { modalReducer } from "./modalReducer";

const rootReducer = combineReducers({
    modalState: modalReducer,
})


export {rootReducer}