import type { Dictionary } from './types'

const en: Dictionary = {
  nav: {
    home: 'Home',
    projects: 'Projects',
    blog: 'Blog',
    cv: 'CV',
  },
  home: {
    subtitle: 'Koç University — Computer Engineering & Economics DM',
    description: 'Computer Engineering & Economics double major. I like building things that make sense.',
  },
  blog: {
    pageTitle: 'Lecture Notes',
    allCategories: 'All Categories',
    categories: {
      comp201: 'COMP 201 — Computer Systems & Programming',
      comp341: 'COMP 341 — Artificial Intelligence',
      econ499: 'ECON 499 — Economics Capstone',
      comp202: 'COMP 202 — Data Structures & Algorithms',
    },
  },
  post: {
    backToCategory: 'Back to Category',
    onThisPage: 'On this page',
  },
  projects: {
    pageTitle: 'Projects',
    subtitle: 'A small collection of projects I have created.',
    portWatcherSubtitle: 'macOS Menubar App',
  },
  guide: {
    title: 'De Beers & U.S. Antitrust Law',
    subtitle: 'ECON 499 · Module 2 · Antitrust Economics · Koç University',
    tagline: '"A Diamond is Forever" — and so was the cartel, until it wasn\'t.',
    backToHome: 'Back to Home',
    legend: {
      origins: 'Origins & Rise',
      monopoly: 'Monopoly Mechanics',
      legal: 'Legal Battles',
      crises: 'Crises & Defections',
      strategy: 'Strategic Pivot',
      law: 'Law & Policy',
    },
    eras: {
      era1: 'The Discovery Era · 1866–1890',
      era2: "Oppenheimer's Empire · 1902–1940s",
      era3: 'The CSO System & Legal Battles · 1945–1980',
      era4: 'Cracks in the Foundation · 1981–1995',
      era5: 'Strategic Reckoning · 1997–1999',
      era6: 'Resolution & Legacy · 2000–2004+',
    },
  },
  cv: {
    pageTitle: 'CV',
    pageDescription: 'Portfolio of Umut Yalçın Baki, Software Engineer & Computer Engineering/Economics double major at Koç University.',
    name: 'Umut Yalçın Baki',
    subtitle: 'Koç University - Computer Engineering & Economics DM',
    bio: 'I like building things that make sense. I want to be a software engineer who develops impactful and scalable solutions. I like tinkering on the low-level, but I have the sense required to actually build things ground up.',
    sections: {
      career: 'Career',
      education: 'Education',
      volunteering: 'Volunteering & Extracurriculars',
      certificates: 'Certificates & Training',
      competitions: 'Competitions & Achievements',
      spokenLanguages: 'Spoken Languages',
    },
    career: {
      odarama: {
        title: 'Software Developer Intern',
        company: 'Odarama',
        companyUrl: 'https://odarama.com',
        date: 'June 2025 - August 2025',
        description: [
          "Built a custom WordPress plugin for batch image processing (WebP conversion) with an integrated AI-based description generator, cutting the sales team's venue data entry time by 50%.",
          'Implemented the new frontend architecture from external UI/UX designs, achieving a 40% speed increase by optimizing translation workflows and coordinating with the design team.',
          'Engineered a dynamic DataLayer implementation using JavaScript to enable marketing analytics tracking.',
        ],
      },
      gordion: {
        title: 'Business Development Intern',
        company: 'Gordion Partners',
        companyUrl: 'https://investment.com.tr',
        date: 'Nov 2023 - Oct 2024',
        description: [
          'Programmed workflow automation tools using AI APIs, Python, and VBA, optimizing business operations and boosting internal efficiency.',
          'Deployed faster AWS server infrastructure across 15+ company websites.',
          'Supported business strategy directly under the CEO, helping strategize new businesses and develop existing ones.',
        ],
      },
      kocTutor: {
        title: 'Python Programming Tutor',
        company: 'KOLT, Koç University',
        companyUrl: 'https://ku.edu.tr',
        date: 'Oct 2023 - June 2024',
        description: [
          'Guided students on Python programming courses (COMP132, UNIV199) as an "A"-graded student.',
        ],
      },
      kocRA: {
        title: 'Research Assistant',
        company: 'Koç Uni, Economics Dept',
        companyUrl: 'https://ku.edu.tr',
        date: 'Nov 2022 - Feb 2023',
        description: [
          'Assisted with data entry and classification for the "Peer Interactions and Their Role in Shaping Children\'s Beliefs on Inclusivity" project funded €2M by ERC.',
        ],
      },
    },
    education: {
      kocUni: {
        name: 'Koç University',
        nameUrl: 'https://ku.edu.tr',
        subtitle: 'College of Engineering / College of Administrative Sciences and Economics',
        date: 'Sep 2022 - June 2027 (Expected)',
        description: [
          'GPA: 3.69 / 4.00',
          "Merit-based 100% Scholarship (ranked 144th nationally at YKS) — Vehbi Koç Honor Award & Dean's Honor Award recipient.",
        ],
      },
      maastricht: {
        name: 'Maastricht University',
        nameUrl: 'https://maastrichtuniversity.nl',
        subtitle: 'School of Business and Economics',
        date: 'Sep 2025 - Feb 2026',
        description: ['Erasmus Exchange (1 semester) in Netherlands.'],
      },
      tev: {
        name: 'TEV İnanç Türkeş High School',
        nameUrl: 'https://tevinanc.k12.tr',
        subtitle: 'Kocaeli',
        date: 'Sep 2017 - June 2022',
        description: ['GPA: 96.72 / 100'],
      },
    },
    volunteering: [
      {
        title: 'Koç University Investment Group',
        meta: 'Oct 2024 - June 2025',
        description: 'Selected after completing training supported by İş Yatırım. Analyzed and presented stock commodities; organized seminars and financial training programs.',
      },
      {
        title: 'Koç University Entrepreneurship Club',
        meta: 'Oct 2022 - Feb 2025',
        description: 'Active member.',
      },
      {
        title: 'Koç University Economics Club',
        meta: 'Oct 2022 - Oct 2024',
        description: 'Career-focused activities.',
      },
      {
        title: 'İLMED — TEV İnanç Türkeş High School Alumni Foundation',
        meta: 'Oct 2022 - June 2023',
        description: 'Prepared seasonal e-mail bulletins covering community news about the TEV Foundation and alumni.',
      },
    ],
    certificates: [
      {
        title: 'YASED Academy Trainee',
        meta: 'International Investors Association · Feb 2025',
        description: 'Covered Digital Transformation & AI, Sustainability, Communication, and Financial & Legal Literacy.',
      },
      {
        title: 'Foundations of Project Management',
        meta: 'Google via Coursera · Aug 2022',
      },
    ],
    competitions: [
      {
        title: 'Boğaziçi Business Challenge',
        meta: 'Apr 2024',
        description: 'Second place as a team in a business simulation competition.',
      },
      {
        title: "Ignite'23 Entrepreneurship Competition",
        meta: 'QNB Finansbank · Sep 2023',
        description: 'Presented a FinTech team project to the jury after a two-day ideathon.',
      },
    ],
    spokenLanguages: ['Turkish (Native)', 'English (Fluent)'],
  },
}

export default en
