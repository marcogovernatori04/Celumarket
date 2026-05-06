import axios from 'axios';

export const api = axios.create({
   baseURL: "https://jl5zhbmj-7119.brs.devtunnels.ms/api",
   headers: {
      'Content-Type': 'application/json'
   }
});