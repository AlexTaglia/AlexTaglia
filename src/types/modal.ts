export type  ModalState= {
    generalModal: GeneralModal
    walletModal:WalletModal
}



export type  GeneralModal= {
    modalIsOpen:boolean,
    type: string,
    title: string,
    description:string
}

export type  WalletModal= {
    connectIsOpen:boolean,
    logoutIsOpen:boolean,
}