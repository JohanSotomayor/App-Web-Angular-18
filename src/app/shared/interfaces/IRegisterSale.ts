export default interface ISale {
    orderID?: number,
    consecutive :number,
    orderDate : Date,
    clientID? : number,
    totalAmount :number
    clientName?:string,
    clientCardId?:string,
    orderDetails?:Array<any>
}
