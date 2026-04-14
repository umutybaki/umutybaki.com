import type { Metadata } from 'next'
import { Inter, Roboto_Mono } from 'next/font/google'
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Blocking script: apply saved theme before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var saved = localStorage.getItem('theme');
                var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                var theme = saved || (prefersDark ? 'dark' : 'light');
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
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