export const siteConfig = {
  name: "BookNest",
  tagline: "Share • Borrow • Read",

  navigation: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Browse Books",
      href: "/catalog",
    },
    {
      label: "How It Works",
      href: "/#how-it-works",
    },
    {
      label: "Why BookNest",
      href: "/#why-booknest",
    },
  ],

  banners: [
    {
      id: 1,
      eyebrow: "A community bookshelf",
      title: "Good books don't belong on one shelf.",
      description:
        "Discover books shared by real people, lend books from your own shelf, and keep reading through the BookNest community.",
      primaryText: "Browse the shelves",
      primaryHref: "/catalog",
      secondaryText: "Request to join",
      secondaryHref: "/signup",
    },

    {
      id: 2,
      eyebrow: "Read more, buy less",
      title: "Find your next book without buying every book.",
      description:
        "Browse a growing collection of books made available by BookNest members.",
      primaryText: "Explore books",
      primaryHref: "/catalog",
      secondaryText: "How it works",
      secondaryHref: "/#how-it-works",
    },

    {
      id: 3,
      eyebrow: "Give books another life",
      title: "Your unused books can become someone else's next read.",
      description:
        "Approved members can list books, lend them, and build a trusted reading community.",
      primaryText: "Join BookNest",
      primaryHref: "/signup",
      secondaryText: "Why BookNest",
      secondaryHref: "/#why-booknest",
    },
  ],
};