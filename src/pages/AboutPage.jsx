import Header from '../components/Header'
import Footer from '../components/Footer'
import PageBanner from '../components/PageBanner'
import Testimonials from '../components/Testimonials'
import { useI18n } from '../i18n'
import { useCms } from '../data/cms'

export default function AboutPage() {
  const { t, lang } = useI18n()
  const { content } = useCms()
  const c = content.about
  return (
    <>
      <Header />
      <main>
        <PageBanner eyebrow={lang === 'uk' ? c.eyebrow : t.about.eyebrow} title={lang === 'uk' ? c.title : t.about.title} subtitle={lang === 'uk' ? c.text : t.about.text} bgImage="/about-bg.png" />
        <Testimonials />
      </main>
      <Footer />
    </>
  )
}
