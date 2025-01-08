export type DictionaryValue<T extends string> = {
    [key in T]: string
}