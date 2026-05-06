import { api } from "./api";
import { type CelularListado, type RespuestaPaginadaCelulares } from "../models/Celular";

export const celularService = {
   obtenerCatalogo: async (): Promise<CelularListado[]> => {
      const respuesta = await api.get<RespuestaPaginadaCelulares>('/Celulares');
      return respuesta.data.items;
   }
};