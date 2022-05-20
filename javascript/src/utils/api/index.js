import axios from "axios"

const client = axios.create({
  baseURL: "http://localhost:8004/",
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
  transformResponse: [function (data) {
    const responseData = JSON.parse(data)
    return responseData.errors ? responseData.errors : responseData.data
  }],
})


export {
  client
}