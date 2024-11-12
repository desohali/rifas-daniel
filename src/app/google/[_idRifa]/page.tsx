"use client"

import { useBuscarRifaMutation, useListarBoletosQueryQuery, useListarUsuariosPostMutation } from '@/services/userApi'
import { Avatar, Badge, Button, Col, Divider, List, Result, Row, Select, Spin, Tag } from 'antd'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { QrcodeOutlined } from "@ant-design/icons";
import GoogleMaps from '@/components/GoogleMaps'

function formatearFecha(fechaStr: string) {

  // Descomponer la fecha en componentes
  const [year, month, day] = fechaStr.split('-').map(Number);

  // Crear una fecha con los componentes especificados
  const fecha = new Date(year, month - 1, day);

  // Opciones de formato
  const opciones: any = {
    weekday: 'long',  // nombre completo del día de la semana
    day: 'numeric',   // día del mes
    month: 'long',    // nombre completo del mes
    year: 'numeric'   // año
  };

  // Formateador de fechas
  const formateador = new Intl.DateTimeFormat('es-ES', opciones);

  // Formatear y devolver la fecha
  return formateador.format(fecha);
}

const page = ({ params }: any) => {


  const dispatch = useDispatch();
  const { _idRifa } = params;

  const [boletos, setBoletos] = React.useState<any[]>([]);
  const [usuarios, setUsuarios] = React.useState<any[]>([]);
  const [rifa, setRifa] = React.useState<any>({});
  const [loading, setloading] = React.useState(true);

  const [boletosFiltrados, setBoletosFiltrados] = React.useState<any[]>([]);



  const [listarUsuarios, responseUsuarios] = useListarUsuariosPostMutation();

  const { data, error, isLoading } = useListarBoletosQueryQuery({ _idRifa, boletosVendidos: true });
  React.useEffect(() => {
    if (data) {
      setBoletos(data);

      setBoletosFiltrados(data.filter((b: any) => (b?._idUsuarioVendedor?._id == usuarios[0]?._id)));
    }
  }, [data, usuarios]);


  const [buscarRifa, responseRifa] = useBuscarRifaMutation();
  React.useEffect(() => {
    buscarRifa({ _id: _idRifa })
      .then(async (rifa: any) => {
        setRifa(rifa?.data);
        const listaDeVendedores: any = await listarUsuarios({ idsUsuarios: rifa?.data?.vendedores || [] });
        setUsuarios((listaDeVendedores?.data || []).map((vendedor: any) => {
          return {
            ...vendedor, boletosVendidos: boletos.filter((boleto: any) => {
              return (boleto?._idUsuarioVendedor?._id == vendedor?._id);
            })
          }
        }));
        setloading(false);
      });
  }, [boletos]);


  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin tip="CARGANDO..." size="large" />
      </div>
    );
  }



  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={18} lg={18}>
        <GoogleMaps data={boletosFiltrados} />
      </Col>
      <Col xs={24} sm={24} md={6} lg={6}>



        <Result
          style={{ padding: "24px" }}
          icon={<QrcodeOutlined style={{ fontSize: 64 }} />}
          title={rifa?.nombre}
          subTitle={(
            <div>
              <p>{rifa?.fecha}</p>
              <p>{rifa?.fecha ? formatearFecha(rifa?.fecha || "") : rifa?.fecha}</p>
              <p>Cantidas de boletos vendidos {boletos.length}</p>
              <p>Total de boletos vendidos {(boletos.length * (rifa?.precio * 1000))?.toLocaleString('en-US')?.replace(/,/g, '.')}</p>
              <p>Cantidad de premios {(data || []).filter((boleto: any) => (boleto?.premio))?.length}</p>
              <p>Total de premios {boletos.reduce((a: any, cv: any) => (a + cv?.premio), 0)?.toLocaleString('en-US')?.replace(/,/g, '.')}</p>
              <p>Cantidad de vendedores {(rifa?.vendedores || []).length}</p>
            </div>
          )}
          extra={[
            <Select
              defaultValue={usuarios[0]?._id}
              style={{ width: "100%" }}
              placeholder="Selecciona un vendedor"
              onChange={(value) => {
                if (value) {
                  setBoletosFiltrados(boletos.filter((boleto) => (boleto?._idUsuarioVendedor?._id == value)));
                } else {
                  setBoletosFiltrados(boletos);
                }
              }}
            >

              {usuarios.map(({ _id, usuario, boletosVendidos }) => (
                <Select.Option key={_id} value={_id}>
                  {`${usuario} - ${(boletosVendidos || [])?.length} boletos`}
                </Select.Option>
              ))}

              <Select.Option value="">
                Todos
              </Select.Option>

            </Select>
          ]}
        />
        <Divider>Boletos vendidos {boletosFiltrados?.length}</Divider>
        <List
          style={{ height: "50vh", overflowY: "auto" }}
          itemLayout="horizontal"
          dataSource={boletosFiltrados}
          renderItem={(item: any, index) => (
            <List.Item style={{
              background: item?.premio ? "green" : "white",
              padding: "1rem"
            }}>
              <List.Item.Meta
                /* avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />} */
                style={{
                  color: item?.premio ? "white" : "black"
                }}
                title={`Boleto: ${item?.premioMayor} - ${item?.premioMenor || ""}`}
                description={(
                  <div>
                    <p>Vendedor: {item?._idUsuarioVendedor?.usuario || "Desconocido"}</p>
                    <p>Premio: {item?.premio || ""}</p>
                  </div>
                )}
              />
            </List.Item>
          )}
        />
      </Col>
    </Row>

  )
}

export default page