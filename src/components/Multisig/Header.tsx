import React from "react";

interface IHeaderProp {
    approvers: any
    quorum: any
}

export const Header = (p:IHeaderProp) =>{
    return (
        <header>
            <ul>
                <li>Approvers: {p.approvers.join(', ')}</li>
                <li>Quorum: {p.quorum}</li>
            </ul>
        </header>
    )
}