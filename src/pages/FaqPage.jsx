import Header from '../components/Header'
import Footer from '../components/Footer'
import PageBanner from '../components/PageBanner'
import FAQ from '../components/FAQ'
import { useI18n } from '../i18n'
import { useCms } from '../data/cms'

export default function FaqPage() {
  const { t, lang } = useI18n()
  const { content } = useCms()
  const f = content.faq
  return (
    <>
      <Header />
      <main>
        <PageBanner eyebrow={lang === 'uk' ? f.eyebrow : t.faq.eyebrow} title={lang === 'uk' ? f.title : t.faq.title} bgImage="/faq-bg.png" />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
