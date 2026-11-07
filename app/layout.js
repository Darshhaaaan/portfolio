import './globals.css'

import PixelCanvas from '../components/PixelCanvas'
import LiquidChrome from '../components/LiquidChrome'

export const metadata = {
  title: "Darshan's Portfolio",
  description: "Full-stack web developer — React, Next.js, Node.js & more.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{
        position: 'relative',
        isolation: 'isolate'
      }}>

        {/* Liquid Chrome Background */}
        <LiquidChrome
          baseColor={[0.02, 0.10, 0.16]}
          speed={0.35}
          amplitude={0.5}
          interactive={true}
          opacity={0.22}
        />

        {/* Interactive Pixel Background */}
        <PixelCanvas
          gap={10}
          speed={0.075}
          variant="glow"
          opacity={0.35}
        />

        {/* Main Website Content */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh'
        }}>
          {children}
        </div>

      </body>
    </html>
  )
}