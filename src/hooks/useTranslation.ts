import he from '../locales/he.json'

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]> & string}`
    : `${Key}`
}[keyof ObjectType & (string | number)]

export const useTranslation = () => {
  const t = (key: NestedKeyOf<typeof he>): string => {
    const keys = key.split('.')
    let value: any = he

    for (const k of keys) {
      value = value?.[k]
    }

    return typeof value === 'string' ? value : key
  }

  return { t }
}
