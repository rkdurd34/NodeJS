import axios from "axios"

axios.defaults.baseURL = "http://localhost:5000"


export default {
  login(data) {
    let status = axios.post('/api/auth/login', data, { withCredentials: true })
    return status
  },


}