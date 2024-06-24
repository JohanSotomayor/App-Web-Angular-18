export default interface IProduct {
    productID?: number,
    code: number,
    description?: string | null,
    hasIva: boolean,
    name: string
    percentIva: number | null,
    price: number,
    stock: number,
    categoryID?: number
    categoryName?: string
}