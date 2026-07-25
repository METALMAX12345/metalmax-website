import Header from '../components/Header'
import Footer from '../components/Footer'
import PageBanner from '../components/PageBanner'
import Equipment from '../components/Equipment'
import { useI18n } from '../i18n'
import { useCms } from '../data/cms'

export default function EquipmentPage() {
  const { t, lang } = useI18n()
  const { content } = useCms()
  const c = content.equipment
  return (
    <>
      <Header />
      <main>
        <PageBanner eyebrow={lang === 'uk' ? c.eyebrow : t.equipment.eyebrow} title={lang === 'uk' ? c.title : t.equipment.title} subtitle={content.hero.subtitle} bgImage="/equipment-bg.png" />
        <Equipment hideHeading />
      </main>
      <Footer />
    </>
  )
}
