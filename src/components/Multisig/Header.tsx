import React from "react";

interface IHeaderProp {
    approvers: string[]
    quorum: any
}

export const Header = (p: IHeaderProp) => {
    return (
        <header>
            <ul>
                <li>Approvers:
                    <ul>
                        {p.approvers?.map((addr) => {
                            return <li key={addr}>{addr}</li>
                        })}
                    </ul>
                </li>

                <li>Quorum: {p.quorum}</li>
            </ul>
        </header >
    )
}