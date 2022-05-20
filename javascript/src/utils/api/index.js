import axios from "axios"

const client = axios.create({
  baseURL: "http://localhost:8004/",
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-type": "application/json"
  },
  transformResponse: [function (data) {
    try {
      const responseData = JSON.parse(data)
      return responseData.errors ? responseData.errors : responseData.data
    } catch (err) {
      return err
    }
  }],
})


export {
  client
}