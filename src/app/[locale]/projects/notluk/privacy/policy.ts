import type { Locale } from '@/i18n-config'

// The Notluk app links to this page, so keep it in sync with PRIVACY.md in the notluk-app repo.
// The page title comes from dict.notluk.privacyPolicy.pageTitle.
export const privacyPolicy: Record<Locale, string> = {
  en: `
_Last updated: October 12, 2026_

Notluk is an app for keeping track of your classes and attendance. This policy explains what data the app handles and what happens to it.

## What we collect
- **Account details:** your name, email address and password, used to create your account and sign you in. Passwords are stored only as a secure hash by our authentication provider. We never see them in plain text.
- **What you enter:** your terms, courses, sections, class times and rooms, attendance requirements and attendance marks.

That's all. Notluk has no analytics, advertising or tracking, and doesn't collect your location, contacts, device identifiers or usage data.

## How we use it
Only to run the app: to sign you in and to store your schedule and attendance so they're there on every device you sign in on. We don't sell your data, share it with advertisers or data brokers, or use it to track you across apps or websites.

## Where it's stored
Your account and data are stored with [Neon](https://neon.tech), our database and authentication provider, on Amazon Web Services servers in Frankfurt, Germany (EU). Connections are encrypted (HTTPS). Database access rules make sure each account can read and change only its own data. On your device, the app keeps only your sign-in session (in the system Keychain) and a few display preferences.

## Keeping and deleting your data
Your data is kept for as long as you have an account. You can delete your account in the app: open the account menu → **Account…** (on iPhone and iPad) or **Settings → Account** (on Mac), then choose **Delete Account…**. This permanently deletes your account and everything in it. You can also ask us to delete it by email.

## TestFlight
If you test a beta version through Apple's TestFlight, Apple may share crash reports, feedback you choose to send, and basic device information with us. Apple handles that data under its own privacy policy.

## Children
Notluk is meant for university students and isn't directed at children under 13.

## Changes
If this policy changes, we'll update the date above. Significant changes will also be announced in the app's release notes.

## Contact
Questions or requests about your data: [ubaki22@ku.edu.tr](mailto:ubaki22@ku.edu.tr)
`,
  tr: `
_Son güncelleme: 12 Ekim 2026_

Notluk, derslerinizi ve devamsızlığınızı takip etmeniz için bir uygulamadır. Bu politika, uygulamanın hangi verileri işlediğini ve bu verilere ne olduğunu açıklar.

## Topladığımız veriler
- **Hesap bilgileri:** hesabınızı oluşturmak ve giriş yapmanızı sağlamak için kullanılan adınız, e-posta adresiniz ve şifreniz. Şifreler, kimlik doğrulama sağlayıcımız tarafından yalnızca güvenli bir özet (hash) olarak saklanır. Şifrenizi hiçbir zaman düz metin olarak görmeyiz.
- **Girdiğiniz veriler:** dönemleriniz, dersleriniz, şubeleriniz, ders saatleriniz ve sınıflarınız, devam zorunluluklarınız ve devamsızlık işaretleriniz.

Hepsi bu kadar. Notluk'ta analitik, reklam veya takip yoktur; konumunuz, kişileriniz, cihaz tanımlayıcılarınız veya kullanım verileriniz toplanmaz.

## Verileri nasıl kullanıyoruz
Yalnızca uygulamayı çalıştırmak için: giriş yapmanızı sağlamak ve programınızla devamsızlık kayıtlarınızı, giriş yaptığınız her cihazda erişebilmeniz için saklamak. Verilerinizi satmayız, reklamcılarla veya veri simsarlarıyla paylaşmayız ve sizi uygulamalar ya da web siteleri arasında takip etmek için kullanmayız.

## Veriler nerede saklanıyor
Hesabınız ve verileriniz, veritabanı ve kimlik doğrulama sağlayıcımız [Neon](https://neon.tech) tarafından Frankfurt, Almanya'daki (AB) Amazon Web Services sunucularında saklanır. Bağlantılar şifrelidir (HTTPS). Veritabanı erişim kuralları, her hesabın yalnızca kendi verilerini okuyup değiştirebilmesini sağlar. Uygulama, cihazınızda yalnızca oturumunuzu (sistem Anahtar Zinciri'nde) ve birkaç görünüm tercihini saklar.

## Verilerin saklanması ve silinmesi
Verileriniz hesabınız olduğu sürece saklanır. Hesabınızı uygulamanın içinden silebilirsiniz: hesap menüsünü açın → **Account…** (iPhone ve iPad'de) veya **Settings → Account** (Mac'te), ardından **Delete Account…** seçeneğini seçin. Bu işlem hesabınızı ve içindeki her şeyi kalıcı olarak siler. Hesabınızın silinmesini e-postayla da talep edebilirsiniz.

## TestFlight
Bir beta sürümünü Apple'ın TestFlight hizmeti üzerinden test ederseniz Apple; çökme raporlarını, göndermeyi seçtiğiniz geri bildirimleri ve temel cihaz bilgilerini bizimle paylaşabilir. Apple bu verileri kendi gizlilik politikası kapsamında işler.

## Çocuklar
Notluk üniversite öğrencileri için tasarlanmıştır ve 13 yaşından küçük çocuklara yönelik değildir.

## Değişiklikler
Bu politika değişirse yukarıdaki tarihi güncelleriz. Önemli değişiklikler ayrıca uygulamanın sürüm notlarında duyurulur.

## İletişim
Verilerinizle ilgili sorular veya talepler için: [ubaki22@ku.edu.tr](mailto:ubaki22@ku.edu.tr)
`,
}
