export const toHex = (num: number) => {
    const val = Number(num);
    return "0x" + val.toString(16);
};

export const displayFormat = (address: string) => {
    return address?.slice(0, 6) + "..." + address?.slice(address.length - 6, address.length)
}

export const formatTimestamp = (timestamp: number, onlyDate: boolean) => {
    const date = new Date(parseInt(timestamp.toString()) * 1000)
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();
    const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    if (onlyDate){
        return date.toLocaleDateString()
    } else {
        return date.toLocaleDateString() + " " + formattedTime
    }
    

}