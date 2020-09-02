const getters = {
  isMobile: state => state.app.isMobile,
  lang: state => state.app.lang,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  address: state => state.user.address,
  keystore: state => state.user.keystore,
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab
}

export default getters
