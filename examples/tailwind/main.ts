(window as any).changeTheme = (themeName: string) => {
  for (const cls of document.body.classList) {
    if (cls.startsWith('themeable')) {
      document.body.classList.remove(cls)
    }
  }
  document.body.classList.add(`themeable-${themeName}`)
}
