import NavbarSession from '@/components/layout/NavbarSession'
import Footer from '@/components/layout/Footer'

export default function PublicLayout({ children }) {
  return (
    <>
      <NavbarSession />
      {children}
      <Footer />
    </>
  )
}
