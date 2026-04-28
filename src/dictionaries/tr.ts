import type { Dictionary } from './types'

const tr: Dictionary = {
  nav: {
    home: 'Ana Sayfa',
    projects: 'Projeler',
    blog: 'Blog',
    cv: 'Özgeçmiş',
  },
  home: {
    subtitle: 'Koç Üniversitesi — Bilgisayar Mühendisliği & Ekonomi ÇAP',
    description: 'Bilgisayar Mühendisliği & Ekonomi çift anadal öğrencisi. Mantıklı şeyler inşa etmeyi seviyorum.',
  },
  blog: {
    pageTitle: 'Blog',
    allCategories: 'Tüm Kategoriler',
  },
  post: {
    backToCategory: 'Tüm İçerikler',
    sidebar: 'İçindekiler',
  },
  projects: {
    pageTitle: 'Projeler',
    subtitle: 'Geliştirdiğim projelerden küçük bir koleksiyon.',
    portWatcherSubtitle: 'macOS Menü Çubuğu Uygulaması',
  },
  guide: {
    title: 'De Beers & ABD Rekabet Hukuku',
    subtitle: 'ECON 499 · Modül 2 · Rekabet Ekonomisi · Koç Üniversitesi',
    tagline: '"Elmas Sonsuzdur" — ve kartel de öyleydi, ta ki çöküşüne dek.',
    backToHome: 'Ana Sayfaya Dön',
    legend: {
      origins: 'Kökenler & Yükseliş',
      monopoly: 'Tekel Mekanizmaları',
      legal: 'Hukuki Mücadeleler',
      crises: 'Krizler & Ayrılmalar',
      strategy: 'Stratejik Dönüşüm',
      law: 'Hukuk & Politika',
    },
    eras: {
      era1: 'Keşif Dönemi · 1866–1890',
      era2: "Oppenheimer'ın İmparatorluğu · 1902–1940'lar",
      era3: 'CSO Sistemi & Hukuki Mücadeleler · 1945–1980',
      era4: 'Çatlaklar · 1981–1995',
      era5: 'Stratejik Hesaplaşma · 1997–1999',
      era6: 'Çözüm & Miras · 2000–2004+',
    },
  },
  cv: {
    pageTitle: 'Özgeçmiş',
    pageDescription: 'Umut Yalçın Baki — Yazılım Mühendisi & Koç Üniversitesi Bilgisayar Mühendisliği/Ekonomi çift anadal öğrencisi.',
    name: 'Umut Yalçın Baki',
    subtitle: 'Koç Üniversitesi - Bilgisayar Mühendisliği & Ekonomi ÇAP',
    bio: 'Mantıklı ve işe yarar şeyler inşa etmeyi seviyorum. Etkili ve ölçeklenebilir çözümler geliştiren bir yazılım mühendisi olmak istiyorum. Düşük levelde uğraşmayı seviyorum ve bir şeyleri sıfırdan inşa etmek için gereken mantığa ve kararlılığa sahibim.',
    sections: {
      career: 'Kariyer',
      education: 'Eğitim',
      volunteering: 'Gönüllülük & Ders Dışı Etkinlikler',
      certificates: 'Sertifikalar & Eğitimler',
      competitions: 'Yarışmalar & Başarılar',
      spokenLanguages: 'Konuşulan Diller',
    },
    career: {
      odarama: {
        title: 'Yazılım Geliştirici Stajyeri',
        company: 'Odarama',
        companyUrl: 'https://odarama.com',
        date: 'Haziran 2025 - Ağustos 2025',
        description: [
          'Satış ekibinin mekan verisi giriş süresini %50 kısaltan, entegre yapay zeka destekli açıklama oluşturuculu ve toplu görüntü işleme (WebP dönüştürme) özelliğine sahip özel bir WordPress eklentisi geliştirdim.',
          'Dış UI/UX tasarımlarından yeni frontend mimarisini entegre ettim; tasarım ekibiyle koordineli çalışarak ve çeviri iş akışlarını optimize ederek hızda %40 artış sağladım.',
          'Pazarlama analitiği takibini sağlamak için JavaScript ile dinamik bir DataLayer (Veri Katmanı) mimarisi kurguladım.',
        ],
      },
      gordion: {
        title: 'İş Geliştirme Stajyeri',
        company: 'Gordion Partners',
        companyUrl: 'https://investment.com.tr',
        date: 'Kasım 2023 - Ekim 2024',
        description: [
          "Yapay zeka API'leri, Python ve VBA kullanarak iş akışı otomasyon araçları programladım, iş operasyonlarını optimize ederek iç verimliliği artırdım.",
          "15'ten fazla şirket web sitesini hızlandıran yeni AWS sunucu altyapılarını kurdum.",
          "Doğrudan CEO'ya bağlı olarak işletme stratejisini destekledim, yeni operasyonların planlanmasına ve mevcut iş kollarının geliştirilmesine yardımcı oldum.",
        ],
      },
      kocTutor: {
        title: 'Python Programlama Eğitmeni',
        company: 'KOLT, Koç Üniversitesi',
        companyUrl: 'https://ku.edu.tr',
        date: 'Ekim 2023 - Haziran 2024',
        description: [
          'Öğrencilere sınıfını "A" harf notu ile tamamlamış bir öğrenci olarak Python programlama derslerinde (COMP132, UNIV199) rehberlik ettim.',
        ],
      },
      kocRA: {
        title: 'Araştırma Asistanı',
        company: 'Koç Üni, Ekonomi Bölümü',
        companyUrl: 'https://ku.edu.tr',
        date: 'Kasım 2022 - Şubat 2023',
        description: [
          'ERC tarafından 2 Milyon € fonlanan "Akran Etkileşimleri ve Çocukların Kapsayıcılık İnançlarının Şekillenmesindeki Rolü" projesinde veri girişi ve sınıflandırmasına yardımcı oldum.',
        ],
      },
    },
    education: {
      kocUni: {
        name: 'Koç Üniversitesi',
        nameUrl: 'https://ku.edu.tr',
        subtitle: 'Mühendislik Fakültesi / İktisadi ve İdari Bilimler Fakültesi',
        date: 'Eylül 2022 - Haziran 2027 (Beklenen)',
        description: [
          'Not Ortalaması: 3.69 / 4.00',
          "Üstün Başarı Yüzde 100 Burslusu (YKS Türkiye 144.'sü) — Vehbi Koç Onur Ödülü ve Dekanlık Onur Ödülü sahibi.",
        ],
      },
      maastricht: {
        name: 'Maastricht Üniversitesi',
        nameUrl: 'https://maastrichtuniversity.nl',
        subtitle: 'İşletme ve Ekonomi Okulu',
        date: 'Eylül 2025 - Şubat 2026',
        description: ["Hollanda'da Erasmus Değişim Programı (1 yarıyıl)."],
      },
      tev: {
        name: 'TEV İnanç Türkeş Özel Lisesi',
        nameUrl: 'https://tevinanc.k12.tr',
        subtitle: 'Kocaeli',
        date: 'Eylül 2017 - Haziran 2022',
        description: ['Not Ortalaması: 96.72 / 100'],
      },
    },
    volunteering: [
      {
        title: 'Koç Üniversitesi Yatırım Kulübü',
        meta: 'Ekim 2024 - Haziran 2025',
        description: 'İş Yatırım destekli eğitimleri tamamladıktan sonra seçildim. Hisse senedi/emtia analizi ve sunumu; seminer ve finansal eğitim programları organizasyonu görevlerinde bulundum.',
      },
      {
        title: 'Koç Üniversitesi Girişimcilik Kulübü',
        meta: 'Ekim 2022 - Şubat 2025',
        description: 'Aktif Üye.',
      },
      {
        title: 'Koç Üniversitesi Ekonomi Kulübü',
        meta: 'Ekim 2022 - Ekim 2024',
        description: 'Kariyer odaklı etkinlikler.',
      },
      {
        title: 'İLMED — TEV İnanç Türkeş Lisesi Mezunları Derneği',
        meta: 'Ekim 2022 - Haziran 2023',
        description: 'TEV Vakfı ve mezunlarla ilgili topluluk haberlerini içeren sezonluk e-posta bültenleri hazırladım.',
      },
    ],
    certificates: [
      {
        title: 'YASED Akademi Stajyeri',
        meta: 'Uluslararası Yatırımcılar Derneği · Şubat 2025',
        description: 'Dijital Dönüşüm & Yapay Zeka, Sürdürülebilirlik, İletişim ve Finansal & Hukuki Okuryazarlık eğitimlerini tamamladım.',
      },
      {
        title: 'Proje Yönetiminin Temelleri',
        meta: 'Google via Coursera · Ağustos 2022',
      },
    ],
    competitions: [
      {
        title: 'Boğaziçi İş Dünyası Yarışması',
        meta: 'Nisan 2024',
        description: 'Bir iş simülasyonu yarışmasında takım olarak ikinci olduk.',
      },
      {
        title: "Ignite'23 Girişimcilik Yarışması",
        meta: 'QNB Finansbank · Eylül 2023',
        description: 'İki günlük ideathon sonunda jüriye FinTech takım projesini sundum.',
      },
    ],
    spokenLanguages: ['Türkçe (Anadil)', 'İngilizce (Akıcı)'],
  },
}

export default tr
