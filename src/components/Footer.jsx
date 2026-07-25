import { useI18n } from '../i18n'
import { useCms } from '../data/cms'
import { InstagramIcon, LinkedinIcon } from './SocialIcons'

export default function Footer() {
  const { t, lang } = useI18n()
  const { content } = useCms()
  const f = content.footer

  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-graphite-950 border-t border-white/8 pt-8 pb-8">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[12.5px] text-steel-400">
          <span className="footer-link hover:text-white transition-all duration-300 cursor-default group">
            © {year} METALMAX. {lang === 'uk' ? f.rights : t.footer.rights}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-red-500 to-red-400 transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
          </span>

          <div className="flex items-center gap-4">
            <a href="#" className="footer-link hover:text-white transition-all duration-300">{lang === 'uk' ? f.privacy : t.footer.privacy}</a>
            <div className="w-px h-3 bg-white/10" />
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon text-steel-400 hover:text-red-500 transition-all duration-300">
              <InstagramIcon size={15} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon text-steel-400 hover:text-red-500 transition-all duration-300">
              <LinkedinIcon size={15} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

