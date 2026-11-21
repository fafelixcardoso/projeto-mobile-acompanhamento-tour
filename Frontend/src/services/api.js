import axios from "axios";

// Para testes no Expo Go, troque 'localhost' pelo IP da sua máquina na rede local (ex: http://192.168.1.15:8080/api)
const API_BASE_URL = "http://localhost:8080/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});
