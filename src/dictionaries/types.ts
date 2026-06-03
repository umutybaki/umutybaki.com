export type CvJobEntry = {
  title: string
  company: string
  companyUrl: string
  date: string
  description: string[]
}

export type CvEduEntry = {
  name: string
  nameUrl: string
  subtitle: string
  date: string
  description: string[]
}

export type CvListEntry = {
  title: string
  meta: string
  description?: string
}

export type Dictionary = {
  nav: {
    home: string
    projects: string
    blog: string
    cv: string
    tools: string
  }
  home: {
    subtitle: string
    description: string
  }
  blog: {
    pageTitle: string
    allCategories: string
  }
  post: {
    backToCategory: string
    sidebar: string
    relatedPosts: string
    readingTime: string // e.g. "min read" — prepended with the number
    words: string       // e.g. "words"
  }
  projects: {
    pageTitle: string
    subtitle: string
    portWatcherSubtitle: string
  }
  tools: {
    pageTitle: string
    subtitle: string
    qrCodeGeneratorName: string
    qrCodeGeneratorSubtitle: string
  }
  guide: {
    title: string
    subtitle: string
    tagline: string
    backToHome: string
    legend: {
      origins: string
      monopoly: string
      legal: string
      crises: string
      strategy: string
      law: string
    }
    eras: {
      era1: string
      era2: string
      era3: string
      era4: string
      era5: string
      era6: string
    }
  }
  cv: {
    pageTitle: string
    pageDescription: string
    name: string
    subtitle: string
    bio: string
    sections: {
      career: string
      education: string
      volunteering: string
      certificates: string
      competitions: string
      spokenLanguages: string
    }
    career: {
      odarama: CvJobEntry
      gordion: CvJobEntry
      kocTutor: CvJobEntry
      kocRA: CvJobEntry
    }
    education: {
      kocUni: CvEduEntry
      maastricht: CvEduEntry
      tev: CvEduEntry
    }
    volunteering: CvListEntry[]
    certificates: CvListEntry[]
    competitions: CvListEntry[]
    spokenLanguages: string[]
  }
}
