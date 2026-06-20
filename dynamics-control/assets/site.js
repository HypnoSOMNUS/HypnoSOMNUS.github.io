(function () {
  const root = document.documentElement
  const savedTheme = localStorage.getItem("theme")
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  root.dataset.theme = savedTheme || (prefersDark ? "dark" : "light")

  const themeButton = document.querySelector("[data-theme-toggle]")
  if (themeButton) {
    themeButton.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark"
      root.dataset.theme = next
      localStorage.setItem("theme", next)
    })
  }

  const search = document.querySelector("[data-search]")
  const searchableLinks = Array.from(document.querySelectorAll("[data-search-item]"))
  if (search) {
    search.addEventListener("input", () => {
      const query = search.value.trim().toLowerCase()
      searchableLinks.forEach((link) => {
        const match = link.textContent.toLowerCase().includes(query)
        link.closest("li").classList.toggle("hidden", query.length > 0 && !match)
      })
    })
  }

  const headings = Array.from(document.querySelectorAll("article h2[id], article h3[id]"))
  const tocLinks = Array.from(document.querySelectorAll(".toc-list a"))
  if ("IntersectionObserver" in window && headings.length > 0) {
    const byId = new Map(tocLinks.map((link) => [decodeURIComponent(link.hash.slice(1)), link]))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (!visible) return
        tocLinks.forEach((link) => link.classList.remove("active"))
        byId.get(visible.target.id)?.classList.add("active")
      },
      { rootMargin: "-12% 0px -72% 0px", threshold: 0.01 },
    )
    headings.forEach((heading) => observer.observe(heading))
  }
})()
