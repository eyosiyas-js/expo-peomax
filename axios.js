import axios from 'axios'

const Axiosinstance = axios.create({
  baseURL: 'https://api.peomax.com/', // Replace this with your API's base URL
  timeout: 10000, // Optional: Define the request timeout
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
})

export default Axiosinstance
