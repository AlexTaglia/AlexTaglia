import { ModalState } from "../../types/modal";
import { createSelector } from 'reselect';
import { useSelector } from "react-redux";

const sliceState = (state: { modalState: ModalState }) => state.modalState;

export const storeModal = createSelector(sliceState, slice => ({
    generalModal: {
        modalIsOpen: slice.generalModal.modalIsOpen,
        type: slice.generalModal.type,
        title: slice.generalModal.title,
        description: slice.generalModal.description
    },
    walletModal: {
        connectIsOpen:slice.walletModal.connectIsOpen,
        logoutIsOpen:slice.walletModal.logoutIsOpen,
    }

}));


