import { apiHelper } from '../utils/helpers.js'

export default {
  signIn({ email, password }) {
    return apiHelper.post('/signin', {
      email,
      password
    })
  },
  signUp(input) {
    return apiHelper.post(`/signup`, input)
  }
}