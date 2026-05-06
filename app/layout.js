import './globals.css'

export const metadata = {
  title: "Darshan's Portfolio",
  description: "Full-stack web developer — React, Next.js, Node.js & more.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
