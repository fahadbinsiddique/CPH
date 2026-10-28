import NavbarSession from '@/components/layout/NavbarSession'
import Footer from '@/components/layout/Footer'

export default function PublicLayout({ children }) {
  return (
    <>
      <NavbarSession />
      {/* Skip-link target for the header's #main-content link. tabIndex -1
          makes it focusable so keyboard focus actually moves here; a plain
          div (not <main>) because pages render their own <main> and a
          wrapper landmark would nest duplicate main landmarks. */}
      <div id="main-content" tabIndex={-1} className="outline-none">
        {children}
      </div>
      <Footer />
    </>
  )
}
