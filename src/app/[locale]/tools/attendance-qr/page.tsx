import type { Metadata } from 'next'
import { getAlternates, pageTitle } from '@/lib/metadata'
import AttendanceQR from './AttendanceQR'
import { copy } from './copy'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = locale === 'tr' ? copy.tr : copy.en
  return {
    title: pageTitle(t.title),
    description: t.subtitle,
    alternates: getAlternates(locale, '/tools/attendance-qr'),
  }
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return (
    <AttendanceQR locale={locale} t={locale === 'tr' ? copy.tr : copy.en} />
  )
}
