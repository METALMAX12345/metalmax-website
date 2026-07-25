import Header from '../components/Header'
import Footer from '../components/Footer'
import PageBanner from '../components/PageBanner'
import Portfolio from '../components/Portfolio'
import { useI18n } from '../i18n'
import { useCms } from '../data/cms'
import portfolioBg from '../assets/photos/portfolio-bg.png'

export default function PortfolioPage() {
  const { t, lang } = useI18n()
  const { content } = useCms()
  const c = content.portfolio
  return (
    <>
      <Header />
      <main>
        <PageBanner eyebrow={lang === 'uk' ? c.eyebrow : t.portfolio.eyebrow} title={lang === 'uk' ? c.title : t.portfolio.title} subtitle={content.hero.subtitle} bgImage={portfolioBg} />
        <Portfolio hideHeading />
      </main>
      <Footer />
    </>
  )
}
