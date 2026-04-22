/**
 * Root layout — passthrough.
 * The actual <html>/<body> shell is rendered by app/[locale]/layout.tsx
 * so the lang attribute can be set dynamically per locale.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
