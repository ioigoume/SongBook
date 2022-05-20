import axios from "axios"

const client = axios.create({
  baseURL: "http://localhost:8000/",
  headers: {
    "Content-type": "application/json"
  },
  transformResponse: [function (data) {
    const responseData = JSON.parse(data)
    return responseData.errors ? responseData.errors : responseData.data
  }],
})


export {
  client
}