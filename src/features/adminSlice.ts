import { createSlice } from '@reduxjs/toolkit';
import { Form } from 'antd';

const initialState: any = {
  menuButtonKey: "Rifas",
  openFormRifa: false,
  openFormBoleto: false,
  listaDeRifas: [],
  rifaDetalles: null,
  isRifa: false,
  listaDeBoletos: [],
  listaDeBoletosConPremio: [],
  listaDeBoletosADevolver: [],
  listaDeBoletosConPremioRandom: [],
  // imagen de rifa
  imagenRifa: undefined
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setMenuButtonKey: (state, action) => {
      state.menuButtonKey = action.payload;
    },
    setOpenFormRifa: (state, action) => {
      state.openFormRifa = action.payload;
    },
    setListaDeRifas: (state, action) => {
      state.listaDeRifas = action.payload;
    },
    setIsRifa: (state, action) => {
      state.isRifa = action.payload;
    },
    setRifaDetalles: (state, action) => {
      state.rifaDetalles = action.payload;
    },
    setOpenFormBoleto: (state, action) => {
      state.openFormBoleto = action.payload;
    },
    setListaDeBoletos: (state, action) => {
      state.listaDeBoletos = action.payload;
    },
    setListaDeBoletosConPremio: (state, action) => {
      state.listaDeBoletosConPremio = action.payload;
    },
    setListaDeBoletosADevolver: (state, action) => {
      state.listaDeBoletosADevolver = action.payload;
    },
    // 
    setImagenRifa: (state, action) => {
      state.imagenRifa = action.payload;
    },
    setListaDeBoletosConPremioRandom: (state, action) => {
      state.listaDeBoletosConPremioRandom = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setMenuButtonKey,
  setOpenFormRifa,
  setListaDeRifas,
  setIsRifa,
  setRifaDetalles,
  setOpenFormBoleto,
  setListaDeBoletos,
  setListaDeBoletosConPremio,
  setListaDeBoletosADevolver,
  setImagenRifa,
  setListaDeBoletosConPremioRandom
} = adminSlice.actions;

export default adminSlice.reducer;