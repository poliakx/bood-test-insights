import './globals.css'
import Navbar from '../components/layout/Navbar'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="pt-16">
        <Navbar />
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
