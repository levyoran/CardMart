import he from '../locales/he.json'
import en from '../locales/en.json'
import { useLanguageStore } from '../store/languageStore'

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]> & string}`
    : `${Key}`
}[keyof ObjectType & (string | number)]

export const useTranslation = () => {
  const language = useLanguageStore((state) => state.language)
  const messages = language === 'en' ? en : he

  const t = (key: NestedKeyOf<typeof he>): string => {
    const keys = key.split('.')
    let value: any = messages

    for (const k of keys) {
      value = value?.[k]
    }

    return typeof value === 'string' ? value : key
  }

  return { t }
}
