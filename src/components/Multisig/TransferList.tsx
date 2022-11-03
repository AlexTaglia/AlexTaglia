import React from "react";
import { Transfer } from "../../types/types";

interface iTransferList {
    transfers: Transfer[]
    approveTransfer: any
}

export const TransferList = (p:iTransferList) => {
    return (
        <div>
            <h2>Transfer List</h2>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>Amount</th>
                            <th>To</th>
                            <th>Approvals</th>
                            <th>Sent</th>
                        </tr>
                    </thead>
                    <tbody>
                        {p.transfers.map((transfer:any) => (
                            <tr key={transfer.id}>
                                <td>{transfer.id}</td>
                                <td>{transfer.amount}</td>
                                <td>{transfer.to}</td>
                                <td>
                                    {transfer.approvals}
                                    <button onClick={()=>p.approveTransfer(transfer.id)}>approve</button>
                                </td>
                                <td>{transfer.sent ? 'yes' : 'no'}</td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default TransferList