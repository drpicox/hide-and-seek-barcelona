import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hide and Seek - Seguimiento',
  description: 'Aplicación de seguimiento para el juego Hide and Seek',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
  },
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
