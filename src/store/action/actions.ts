import {createAction} from 'typesafe-actions';
import {  GeneralModal } from '../../types/modal';


// MODAL
export const setModal = createAction("SET_MODAL")< GeneralModal>();
export const setToggleLogout = createAction("TOGLLE_LOGOUT")<boolean>();
export const setToggleConnect = createAction("TOGGLE_WALLET_CONNECT")<boolean>();
export const setResetModal = createAction("RESET_MODAL")();
