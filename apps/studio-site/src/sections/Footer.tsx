import { useConfiguratorStore } from '@care/configurator'
import { t } from '../i18n'

export function Footer() {
  const language = useConfiguratorStore(s => s.language)

  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} {t(language, 'footer.studio')} {t(language, 'footer.rights')}</p>
      <p>{t(language, 'footer.tagline')}</p>
    </footer>
  )
}
