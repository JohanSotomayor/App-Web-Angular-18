export default interface ITableColumn {
    name: string,
    viewValue: string,
    sortable: boolean,
    sticky: boolean,
    isDate?: boolean,
    isCurrency?: boolean,
    isDetail?: boolean,
    isTitlecase?: boolean
}