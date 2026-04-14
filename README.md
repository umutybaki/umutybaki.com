# Umut Yalçın Baki — Personal Portfolio & Blog

A high-performance, bilingual personal portfolio and blog built with **Next.js 15**, **React 19**, and **Tailwind CSS 4**. Deployed on **AWS** using **SST**.

[![Website](https://img.shields.io/badge/Website-umutybaki.com-3b82f6)](https://umutybaki.com)
[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%2015%20|%20React%2019%20|%20Tailwind%204-black)](https://nextjs.org)
[![Deployment](https://img.shields.io/badge/Deployment-SST%20|%20AWS-orange)](https://sst.dev)

---

## 🚀 Overview

This repository contains the source code for my personal digital garden, hosted at [umutybaki.com](https://umutybaki.com). It serves as a hub for my professional experience, academic notes, and technical blog posts.

The project recently migrated from a vanilla HTML/JS structure to a modern **Next.js App Router** architecture to support better content management, dynamic routing, and improved performance.

## ✨ Key Features

- **✍️ Markdown Blog**: A custom-built blog engine using `remark` and `rehype` with support for:
  - Syntax highlighting via `rehype-highlight`.
  - Math equations via `KaTeX`.
  - Auto-generated slugs and optimized head tags.
- **🌍 Bilingual Support**: Core pages support both **English** and **Turkish** content.
- **📄 Interactive CV**: A dedicated CV section with a custom timeline component and detailed experience tracking.
- **🌓 Theme Support**: Seamless dark and light mode transitions, styled with **Tailwind CSS 4**.
- **⚡ Serverless Deployment**: Fully automated CI/CD and hosting on AWS using **SST Ion**.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Content**: Markdown/MDX with [Unified](https://unifiedjs.com/) (Remark/Rehype)
- **Infrastructure**: [SST v3](https://sst.dev/) (Ion)
- **Cloud**: [AWS](https://aws.amazon.com/) (Lambda, CloudFront, S3)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 📂 Project Structure

```text
.
├── posts/              # Markdown blog posts (.md)
├── public/             # Static assets (images, icons)
├── src/
│   ├── app/            # Next.js App Router (blog, cv, landing)
│   ├── components/     # Reusable React components (Timeline, Navigation)
│   └── lib/            # Utility functions and Markdown processing
├── sst.config.ts       # Infrastructure as Code (SST)
└── package.json        # Dependencies and scripts
```

## 🛠️ Local Development

This project uses **pnpm** as the package manager.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/umutybaki/umutybaki.com.git
   cd umutybaki.com
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Run the development server:**
   ```bash
   pnpm dev
   ```

4. **Open the local site:**
   Navigate to [http://localhost:3000](http://localhost:3000).

## 🚢 Deployment

Deployment is handled via [SST](https://sst.dev/).

- **Preview / Development Stage**:
  ```bash
  npx sst dev
  ```
- **Production Deployment**:
  ```bash
  pnpm deploy
  ```

---

Built with ⚡ by [Umut Yalçın Baki](https://umutybaki.com).
