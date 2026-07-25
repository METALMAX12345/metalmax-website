import Header from '../components/Header'
import Footer from '../components/Footer'
import PageBanner from '../components/PageBanner'
import Contacts from '../components/Contacts'
import { useI18n } from '../i18n'
import { useCms } from '../data/cms'

export default function ContactsPage() {
  const { t, lang } = useI18n()
  const { content } = useCms()
  const c = content.contacts
  return (
    <>
      <Header />
      <main>
        <PageBanner eyebrow={lang === 'uk' ? c.eyebrow : t.contacts.eyebrow} title={lang === 'uk' ? c.title : t.contacts.title} subtitle={lang === 'uk' ? c.formSub : t.contacts.formSub} bgImage="/contacts-bg.png" />
        <Contacts hideHeading />
      </main>
      <Footer />
    </>
  )
}
