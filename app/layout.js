import './globals.css'

export const metadata = {
  title: 'HARA Recovery',
  description: 'Rehab i povratak nogometu',
  manifest: '/manifest.webmanifest',
  themeColor: '#0b1220',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'HARA Recovery' },
  icons: { apple: '/icon-192.png' }
}

export default function RootLayout({ children }) {
  return <html lang="hr"><body>{children}</body></html>
}
