export type NavItem = {
  title: string
  href: string
}

export const siteConfig = {
  name: "AI Quiz Generator",
  navigation: [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Upload",
      href: "/upload",
    },
    {
      title: "Generate Quiz",
      href: "/generate",
    },
  ] as NavItem[],
}
