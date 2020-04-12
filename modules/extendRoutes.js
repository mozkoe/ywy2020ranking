// delete js or ts routes filename has 'helpers' in path
// nuxt 1.4.0 is not adding ts files to routes
// only vue and ts files
module.exports = function extendRoutes() {
  this.nuxt.hook('build:extendRoutes', (routes) => {
    for (let i = 0; i < routes.length; i += 1) {
      const route = routes[i]
      try {
        // 去除 helper 文件夹 route
        if (route.path.match(/helpers?\//)) {
          routes.splice(i, 1)
          i -= 1
        }
      } catch (e) {
        //
      }
    }
  })
}
