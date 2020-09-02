import './index.less'
import i18nMixin from '@/store/i18n-mixin'

const locales = ['en-US', 'zh-CN']
// eslint-disable-next-line
const languageIcons = {
  'zh-CN': 'CN',
  'en-US': 'EN'
}

const SelectLang = {
  name: 'SelectLang',
  mixins: [i18nMixin],
  render () {
    const changeLang = (key) => {
      this.setLang(key)
    }
    return (
      <div>
        {
          locales.map((locale, idx) => (
            <span
              class={['lang-text']}
            >{idx !== 0 && '/'}
              {this.currentLang === locale
                ? <span class={['lang-chosen']}>
                {languageIcons[locale]}
              </span>
                : <span class={['lang-not-chosen']} onClick={() => changeLang(locale)}>
                {languageIcons[locale]}
              </span>
              }
            </span>
          ))
        }
      </div>
    )
  }
}

export default SelectLang
