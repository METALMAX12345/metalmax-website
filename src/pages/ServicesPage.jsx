import Header from '../components/Header'
import Footer from '../components/Footer'
import PageBanner from '../components/PageBanner'
import Services from '../components/Services'
import { useI18n } from '../i18n'
import { useCms } from '../data/cms'

export default function ServicesPage() {
  const { t, lang } = useI18n()
  const { content } = useCms()
  const c = content.services
  return (
    <>
      <Header />
      <main>
        <PageBanner eyebrow={lang === 'uk' ? c.eyebrow : t.services.eyebrow} title={lang === 'uk' ? c.title : t.services.title} subtitle={content.hero.subtitle} bgImage="/services-bg.png" />
        <Services hideHeading />
      </main>
      <Footer />
    </>
  )
}
