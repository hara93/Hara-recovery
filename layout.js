import './globals.css'

export const metadata = {
  title: 'HARA Recovery',
  description: 'Rehab, strength and return-to-football plan',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'HARA Recovery', statusBarStyle: 'black-translucent' },
  themeColor: '#08111f'
}

export default function RootLayout({ children }) {
  return (
    <html lang="hr">
      <body>{children}</body>
    </html>
  )
}
