import { notFound } from 'next/navigation'
import { Inter, Roboto_Mono } from 'next/font/google'
import { cookies } from 'next/headers'
import Nav from '@/components/Nav'
import { getDictionary, AVAILABLE_LOCALES } from '@/dictionaries'
import { locales } from '@/i18n-config'
import '../globals.css'
import 'katex/dist/katex.min.css'
import NextTopLoader from 'nextjs-toploader'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-roboto-mono' })

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!locales.includes(locale as typeof locales[number])) notFound()

  const dict = getDictionary(locale)

  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')?.value === 'light' ? 'light' : 'dark'

  return (
    <html lang={locale} data-theme={theme} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t);document.cookie='theme='+t+'; path=/; max-age=31536000; SameSite=Lax';}else if(window.matchMedia('(prefers-color-scheme: light)').matches){document.documentElement.setAttribute('data-theme','light');document.cookie='theme=light; path=/; max-age=31536000; SameSite=Lax';}}catch(e){}})();` }} />
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
        <NextTopLoader
          color="#ff6400"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #ff6400,0 0 5px #ff6400"
        />
        <Nav locale={locale} dict={dict.nav} availableLocales={AVAILABLE_LOCALES} />
        {children}
      </body>
    </html>
  )
}
