import type { Metadata, Viewport } from 'next'
import './globals.css'

const basePath = process.env.NODE_ENV === 'production' ? '/hide-and-seek-barcelona' : ''

export const metadata: Metadata = {
  title: 'Hide and Seek - Barcelona',
  description: 'Joc d\'amagar-se i cercar per Barcelona amb transport públic',
  manifest: `${basePath}/manifest.json`,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Hide & Seek BCN',
  },
  icons: {
    icon: [
      { url: `${basePath}/favicon.ico`, sizes: 'any' },
      { url: `${basePath}/icon-192.png`, sizes: '192x192', type: 'image/png' },
      { url: `${basePath}/icon-512.png`, sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: `${basePath}/apple-touch-icon.png`, sizes: '180x180', type: 'image/png' },
    ],
  },
  themeColor: '#7c3aed',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
