import axios from "axios";

const api = axios.create({
  baseURL: "https://notemanagerbackend.herokuapp.com",
});

export default api;
