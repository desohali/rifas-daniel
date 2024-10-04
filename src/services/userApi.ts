// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://yocreoquesipuedohacerlo.com/juegoDeRifasDaniel/'
  }),
  // keepUnusedDataFor: 3,
  endpoints: (builder) => ({
    registrarRifa: builder.mutation({
      query: (variables) => {
        return {
          url: 'registrarRifa',
          method: 'post',
          body: variables,
          headers: { uid: "token" },
        }
      },
      //transformResponse: (response: any, meta, arg) => response.data,
    }),
    eliminarRifa: builder.mutation({
      query: (variables) => {
        return {
          url: 'eliminarRifa',
          method: 'post',
          body: variables,
          headers: { uid: "token" },
        }
      },
      //transformResponse: (response: any, meta, arg) => response.data,
    }),
    listarRifas: builder.mutation({
      query: (variables) => {
        return {
          url: 'listarRifas',
          method: 'post',
          body: variables,
          headers: { uid: "token" },
        }
      },
      //transformResponse: (response: any, meta, arg) => response.data,
    }),
    listarUsuarios: builder.query({
      query: (variables) => {
        return {
          url: 'listarUsuarios',
          method: 'get',
          // body: variables,// get no lleva body
          headers: { uid: "token" },
        }
      },
      //transformResponse: (response: any, meta, arg) => response.data,
    }),
    listarBoletos: builder.mutation({
      query: (variables) => {
        return {
          url: 'listarBoletos',
          method: 'post',
          body: variables,// get no lleva body
          headers: { uid: "token" },
        }
      },
      //transformResponse: (response: any, meta, arg) => response.data,
    }),
    listarBoletosQuery: builder.query({
      query: (variables) => {
        return {
          url: 'listarBoletos',
          method: 'get',
          params: variables,// get no lleva body lleva params
          headers: { uid: "token" },
        }
      },
      //transformResponse: (response: any, meta, arg) => response.data,
    }),
    buscarRifa: builder.mutation({
      query: (variables) => {
        return {
          url: 'buscarRifa',
          method: 'post',
          body: variables,
          headers: { uid: "token" },
        }
      },
      //transformResponse: (response: any, meta, arg) => response.data,
    }),
    listarSegundosGanadores: builder.mutation({
      query: (variables) => {
        return {
          url: 'listarSegundosGanadores',
          method: 'post',
          body: variables,
          headers: { uid: "token" },
        }
      },
      //transformResponse: (response: any, meta, arg) => response.data,
    }),
    buscarBoleto: builder.mutation({
      query: (variables) => {
        return {
          url: 'buscarBoleto',
          method: 'post',
          body: variables,
          headers: { uid: "token" },
        }
      },
      //transformResponse: (response: any, meta, arg) => response.data,
    }),

    registrarPremioBoletos: builder.mutation({
      query: (variables) => {
        return {
          url: 'registrarPremioBoletos',
          method: 'post',
          body: variables,
          headers: { uid: "token" },
        }
      },
      //transformResponse: (response: any, meta, arg) => response.data,
    }),
    eliminarPremioBoleto: builder.mutation({
      query: (variables) => {
        return {
          url: 'eliminarPremioBoleto',
          method: 'post',
          body: variables,
          headers: { uid: "token" },
        }
      },
      //transformResponse: (response: any, meta, arg) => response.data,
    }),
    actualizarBoleto: builder.mutation({
      query: (variables) => {
        return {
          url: 'actualizarBoleto',
          method: 'post',
          body: variables,
          headers: { uid: "token" },
        }
      },
      //transformResponse: (response: any, meta, arg) => response.data,
    }),
    listarBoletosPagados: builder.mutation({
      query: (variables) => {
        return {
          url: 'listarBoletosPagados',
          method: 'post',
          body: variables,
          headers: { uid: "token" },
        }
      },
      //transformResponse: (response: any, meta, arg) => response.data,
    }),
    pagarBoleto: builder.mutation({
      query: (variables) => {
        return {
          url: 'pagarBoleto',
          method: 'post',
          body: variables,
          headers: { uid: "token" },
        }
      },
      //transformResponse: (response: any, meta, arg) => response.data,
    }),
    registrarUsuario: builder.mutation({
      query: (variables) => {
        return {
          url: 'registrarUsuario',
          method: 'post',
          body: variables,
          headers: { uid: "token" },
        }
      },
      //transformResponse: (response: any, meta, arg) => response.data,
    }),
    loginValidadorQR: builder.mutation({
      query: (variables) => {
        return {
          url: 'loginValidadorQR',
          method: 'post',
          body: variables,
          headers: { uid: "token" },
        }
      },
      //transformResponse: (response: any, meta, arg) => response.data,
    }),
    listarBoletosVendidos: builder.mutation({
      query: (variables) => {
        return {
          url: 'listarBoletosVendidos',
          method: 'post',
          body: variables,
          headers: { uid: "token" },
        }
      },
      //transformResponse: (response: any, meta, arg) => response.data,
    }),
    boletosDevueltos: builder.mutation({
      query: (variables) => {
        return {
          url: 'boletosDevueltos',
          method: 'post',
          body: variables,
          headers: { uid: "token" },
        }
      },
      //transformResponse: (response: any, meta, arg) => response.data,
    }),
    actualizarBoletosDevueltos: builder.mutation({
      query: (variables) => {
        return {
          url: 'actualizarBoletosDevueltos',
          method: 'post',
          body: variables,
          headers: { uid: "token" },
        }
      },
      //transformResponse: (response: any, meta, arg) => response.data,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useRegistrarRifaMutation,
  useListarRifasMutation,
  useListarUsuariosQuery,
  useListarBoletosMutation,
  useBuscarRifaMutation,
  useListarSegundosGanadoresMutation,
  useBuscarBoletoMutation,
  useRegistrarPremioBoletosMutation,
  useActualizarBoletoMutation,
  useListarBoletosPagadosMutation,
  usePagarBoletoMutation,
  useRegistrarUsuarioMutation,
  useEliminarPremioBoletoMutation,
  useLoginValidadorQRMutation,
  useListarBoletosVendidosMutation,
  useListarBoletosQueryQuery,
  useBoletosDevueltosMutation,
  useActualizarBoletosDevueltosMutation,
  useEliminarRifaMutation
} = userApi;