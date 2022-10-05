export const toHex = (num: number) => {
    const val = Number(num);
    return "0x" + val.toString(16);
};

export const displayFormat = (address: string) => {
    return address?.slice(0, 6) + "..." + address?.slice(address.length - 6, address.length)
}