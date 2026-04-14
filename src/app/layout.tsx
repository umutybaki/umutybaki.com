import type { Metadata } from 'next'
import { Inter, Roboto_Mono } from 'next/font/google'
import { cookies } from 'next/headers'
import './globals.css'
import 'katex/dist/katex.min.css'
import Nav from '@/components/Nav'
import ConstellationCanvas from '@/components/ConstellationCanvas'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-roboto-mono' })

export const metadata: Metadata = {
  title: 'Umut Yalçın Baki',
  description: 'Umut Yalçın Baki – Software Engineer & Computer Engineering/Economics double major at Koç University.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')?.value === 'dark' ? 'dark' : 'light'

  return (
    <html lang="en" data-theme={theme}>
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZZ4R2RV2NP" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ZZ4R2RV2NP');
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${robotoMono.variable}`}>
        <ConstellationCanvas />
        <div className="glow-overlay" />
        <Nav />
        {children}
      </body>
    </html>
  )
}