const trimRoutes = (routes) => {
  for (let i = 0; i < routes.length; i += 1) {
    const route = routes[i]
    if (route.component.endsWith('.ts')) {
      routes.splice(i, 1)
      i -= 1
    } else if (Array.isArray(route.children)) {
      trimRoutes(route.children)
    }
  }
}

export default function typescript() {
  this.extendRoutes((routes) => {
    trimRoutes(routes)
  })
}
