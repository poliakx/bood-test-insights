import './globals.css'
import Navbar from '../components/layout/Navbar'
import FloatingChat from '../components/chat/FloatingChat'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="pt-16">
        <Navbar />
        <main>
          {children}
        </main>
        <FloatingChat />
      </body>
    </html>
  )
}
