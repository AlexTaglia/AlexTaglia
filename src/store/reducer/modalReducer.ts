import { ActionType, createReducer } from "typesafe-actions";
import { ModalState } from "../../types/modal";
import * as actions from '../action';

const initialState: ModalState = {
    generalModal: {
        modalIsOpen: false,
        type: "",
        title: "",
        description: ""
    },
    walletModal: {
        connectIsOpen: false,
        logoutIsOpen: false,
    }

}

export type setModalAction = ActionType<typeof actions>
export type setModalActionType = ActionType<typeof actions.setModal>
export type setToggleLogoutType = ActionType<typeof actions.setToggleLogout>
export type setToggleConnectType = ActionType<typeof actions.setToggleConnect>
export type setResetModalType = ActionType<typeof actions.setResetModal>


export const setModalActionTypeCase = (state: ModalState, action: setModalActionType): ModalState => ({
    ...state,
    generalModal: { 
        modalIsOpen: action.payload.modalIsOpen,
        type: action.payload.type,
        title: action.payload.title,
        description: action.payload.description}
});

export const setResetModalTypeCase = (state: ModalState, action: setResetModalType): ModalState => ({
    ...state,
    generalModal: { 
        modalIsOpen: false,
        type: "",
        title: "",
        description: ""}
});

export const setToggleLogoutTypeCase = (state: ModalState, action: setToggleLogoutType): ModalState => ({
    ...state,
    walletModal: { 
        ...state.walletModal, logoutIsOpen:action.payload}
});

export const setToggleConnectTypeCase = (state: ModalState, action: setToggleConnectType): ModalState => ({
    ...state,
    walletModal: { 
        ...state.walletModal, connectIsOpen:action.payload}
});

export const modalReducer = createReducer<ModalState, setModalAction>(initialState)
    .handleAction(
        actions.setModal,
        setModalActionTypeCase
    ).handleAction(
        actions.setToggleLogout,
        setToggleLogoutTypeCase
    ).handleAction(
        actions.setToggleConnect,
        setToggleConnectTypeCase
    ).handleAction(
        actions.setResetModal,
        setResetModalTypeCase
    )