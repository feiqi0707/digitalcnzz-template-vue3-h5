const getters = {
  userInfo: ({ app }: { app: any }) => app.userInfo,
  token: ({ app }: { app: any }) => app.userInfo.accessToken
}
export default getters
