import axios from "axios"

axios.defaults.baseURL = "http://localhost:5000"
axios.defaults.withCredentials = true

export default {
  async login(data) {
    let status = await axios.post('/api/auth/login', data)
    return status
  },
  async test() {
    let status = await axios.get('/api/auth/test')
    return status
  }


}