import axios from "axios";

// IP da máquina na rede local para conexão com o Expo Go no celular
const API_BASE_URL = "http://192.168.15.11:8080/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});
