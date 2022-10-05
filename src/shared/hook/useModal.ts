import { useSelector } from "react-redux";
import { storeModal } from "../../store/selector/modalSelector";
import * as actions from '../../store/action';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { GeneralModal } from "../../types/modal";


export const useModal = () => {
    const dispatch = useDispatch();

    const callSetModal = useCallback((data: GeneralModal) => {
        dispatch(actions.setModal(data))
    }, [dispatch])

    const callSetResetModal = useCallback(() => {
        dispatch(actions.setResetModal())
    }, [dispatch])

    const callSetLogoutIsOpen = useCallback((data: boolean) => {
        dispatch(actions.setToggleLogout(data))
    }, [dispatch])

    const callSetConnectIsOpen = useCallback((data: boolean) => {
        dispatch(actions.setToggleConnect(data))
    }, [dispatch])

    const modal = useSelector(storeModal)

    return { modal, callSetModal, callSetLogoutIsOpen, callSetConnectIsOpen, callSetResetModal }
}