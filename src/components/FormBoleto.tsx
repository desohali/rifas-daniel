"use client"
import swal from 'sweetalert';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MinusCircleOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Divider, Drawer, Flex, Form, Input, List, Radio, Select, Space } from 'antd';
import { useListarBoletosQueryQuery, useRegistrarPremioBoletosMutation } from '@/services/userApi';
import { setListaDeBoletos, setListaDeBoletosConPremio, /* setListaDeBoletosConPremioRandom, */ setOpenFormBoleto, setRifaDetalles } from '@/features/adminSlice';
import FormBoletosManuales from './FormBoletosManuales';
import FormBoletosAutomaticos from './FormBoletosAutomaticos';

const FormBoleto: React.FC = () => {

  const dispatch = useDispatch();
  const [value, setValue] = React.useState('random');

  const {
    openFormBoleto,
    rifaDetalles
  } = useSelector((state: any) => state.admin);

  const {
    data,
    error,
    isLoading
  } = useListarBoletosQueryQuery({ _idRifa: rifaDetalles?._id });
  React.useEffect(() => {
    if (data) {
      dispatch(setListaDeBoletos(data));
    }

    return () => {
      dispatch(setListaDeBoletos([]));
    }
  }, [data]);

  /* const {
    data: dataBoletosGanadoresRandom,
    error: errorBoletosGanadoresRandom,

  } = useListarBoletosQueryQuery({ _idRifa: rifaDetalles?._id, boletosGanadoresRandom: true });
  React.useEffect(() => {
    if (dataBoletosGanadoresRandom) {
      dispatch(setListaDeBoletosConPremioRandom(dataBoletosGanadoresRandom));
    }
  }, [dataBoletosGanadoresRandom]); */


  const {
    data: dataBoletosGanadores,
    error: errorBoletosGanadores,

  } = useListarBoletosQueryQuery({ _idRifa: rifaDetalles?._id, boletosGanadores: true });
  React.useEffect(() => {
    if (dataBoletosGanadores) {
      dispatch(setListaDeBoletosConPremio(dataBoletosGanadores));
    }
  }, [dataBoletosGanadores]);



  return (
    <Drawer
      title="Premios 2N° ganadores"
      width={500}
      onClose={() => {
        dispatch(setOpenFormBoleto(false));
        dispatch(setRifaDetalles(null));
      }}
      open={openFormBoleto}
      style={{ width: "100%", }}
      styles={{
        body: {
          paddingBottom: 80,
        },
      }}>

      <Flex onChange={(e: any) => {
        setValue(e.target.value);
      }} style={{ width: '100%' }}>
        <Radio.Group value={value} buttonStyle="solid" style={{ width: '100%', display: 'flex' }}>
          <Radio.Button value="random" style={{ flex: 1, textAlign: 'center' }}>Automáticos</Radio.Button>
          <Radio.Button value="manual" style={{ flex: 1, textAlign: 'center' }}>Manuales</Radio.Button>
        </Radio.Group>
      </Flex>

      <Divider></Divider>

      {value == "manual" && <FormBoletosManuales />}
      {value == "random" && <FormBoletosAutomaticos />}
    </Drawer>
  )
};

export default FormBoleto;