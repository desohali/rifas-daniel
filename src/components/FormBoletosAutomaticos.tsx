"use client";
import { Button, Card, Col, Divider, Flex, Form, Input, InputNumber, List, Row, Select, Slider, Switch, Tag, Tooltip } from 'antd'
import React from 'react'
import { TagOutlined } from '@ant-design/icons';
import { useEliminarPremioBoletoMutation, useListarBoletosQueryQuery, useListarRifasMutation, useRegistrarRifaMutation } from '@/services/userApi';
import swal from 'sweetalert';
import { useDispatch, useSelector } from 'react-redux';
import { setIsRifa, setListaDeBoletosConPremioRandom, /* setListaDeBoletosConPremioRandom, */ setOpenFormBoleto, setRifaDetalles } from '@/features/adminSlice';
import { DeleteOutlined } from '@ant-design/icons';

const customizeRequiredMark = (label: React.ReactNode, { required }: { required: boolean }) => (
  <>
    {required ? <Tag color="error">Required</Tag> : <Tag color="warning">optional</Tag>}
    {label}
  </>
);

const OPTIONS_PREMIOS = [
  { label: '5 mil', value: '5000' },
  { label: '10 mil', value: '10000' },
  { label: '20 mil', value: '20000' },
  { label: '30 mil', value: '30000' },
  { label: '50 mil', value: '50000' },
  { label: '80 mil', value: '80000' },
  { label: '100 mil', value: '100000' },
  { label: '120 mil', value: '120000' },
  { label: '140 mil', value: '140000' },
  { label: '160 mil', value: '160000' },
  { label: '180 mil', value: '180000' },
  { label: '200 mil', value: '200000' },
  { label: '240 mil', value: '240000' },
  { label: '260 mil', value: '260000' },
  { label: '300 mil', value: '300000' },
  { label: '320 mil', value: '320000' },
  { label: '350 mil', value: '350000' },
  { label: '400 mil', value: '400000' },
];

const style: React.CSSProperties = { width: '100%' };


const FormBoletosAutomaticos = () => {

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const {
    rifaDetalles,
    listaDeBoletosConPremioRandom
  } = useSelector((state: any) => state.admin);

  const [eliminarPremioBoleto, {
    data: dataBoleto,
    error: errorBoleto,
    isLoading: isLoadingBoleto
  }] = useEliminarPremioBoletoMutation();

  const [registrarRifa, {
    data,
    error,
    isLoading
  }] = useRegistrarRifaMutation();

  const {
    data: dataBoletosGanadores,
    error: errorBoletosGanadores,
    refetch
  } = useListarBoletosQueryQuery({ _idRifa: rifaDetalles?._id, boletosGanadoresRandom: true });
  React.useEffect(() => {
    if (dataBoletosGanadores) {
      dispatch(setListaDeBoletosConPremioRandom(dataBoletosGanadores));
    }
  }, [dataBoletosGanadores]);

  return (
    <>
      <Form
        form={form}
        name="login-form"
        layout="vertical"
        style={style}
        requiredMark={customizeRequiredMark}
        initialValues={{
          checked: rifaDetalles?.checked || false,
          cadaXBoletos: rifaDetalles?.cadaXBoletos || "",
          montoTotal: rifaDetalles?.montoTotal || "",
          premios: rifaDetalles?.premios || [],
        }}
        onFinish={async (values) => {
          registrarRifa({ ...rifaDetalles, ...values }).then(() => {
            form.resetFields();
            dispatch(setOpenFormBoleto(false));
            dispatch(setRifaDetalles(null));
            dispatch(setIsRifa(true));
            setTimeout(() => { dispatch(setIsRifa(false)) }, 50);
          });
        }} >

        <Row gutter={16}>
          <Col xs={10} sm={10} md={10} lg={10}>
            <Form.Item
              name="checked"
              label="Activar"
              valuePropName="checked"
              rules={[{ required: true, message: 'Activar y/o Inactivar' }]}
            >
              <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" onChange={(checked) => {

              }} />
            </Form.Item>
          </Col>
          <Col xs={14} sm={14} md={14} lg={14}>

            <Form.Item
              name="cadaXBoletos"
              label="Cada x boletos"
              rules={[{ required: true, message: 'Seleccione Cada x boletos' }]}
            >
              <Select /* defaultValue="20" */ style={style}>
                <Select.Option value="10">Cada 10 Boletos</Select.Option>
                <Select.Option value="20">Cada 20 Boletos</Select.Option>
                <Select.Option value="30">Cada 30 Boletos</Select.Option>
                <Select.Option value="40">Cada 40 Boletos</Select.Option>
                <Select.Option value="50">Cada 50 Boletos</Select.Option>
                <Select.Option value="60">Cada 60 Boletos</Select.Option>
                <Select.Option value="70">Cada 70 Boletos</Select.Option>
                <Select.Option value="80">Cada 80 Boletos</Select.Option>
                <Select.Option value="90">Cada 90 Boletos</Select.Option>
                <Select.Option value="100">Cada 100 Boletos</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={10} sm={10} md={10} lg={10}>
            <Form.Item
              name="montoTotal"
              label="Monto total"
              rules={[{ required: true, message: 'Seleccione Monto total' }]}
            >
              <Slider min={100000} max={1000000} step={10000} />
            </Form.Item>
          </Col>
          <Col xs={14} sm={14} md={14} lg={14}>
            <Form.Item
              name="premios"
              label="Premios"
              rules={[{ required: true, message: 'Seleccione Premios' }]}
            >
              <Select
                mode="multiple"
                allowClear
                style={style}
                placeholder="Seleccione Premios"
                // defaultValue={[]}
                onChange={() => { }}
                options={OPTIONS_PREMIOS}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Flex vertical gap="small" style={{ width: '50%', margin: "auto" }}>
              <Button loading={isLoading} type="primary" block htmlType="submit">
                Registrar
              </Button>
            </Flex>
          </Col>
        </Row>
      </Form>

      <Row gutter={16}>
        <Col span={24}>
          <List
            style={{ maxHeight: "300px", overflowY: "auto", marginTop: "1.5rem" }}
            size="small"
            header={(
              <div>
                <p>{`Lista de ganadores QR automáticos: ${listaDeBoletosConPremioRandom.length}`}</p>
                <p>{`Total : ${listaDeBoletosConPremioRandom.reduce((a: any, cv: any) => {
                  return (a + cv.premio)
                }, 0).toLocaleString()}`}</p>
              </div>
            )}
            bordered
            dataSource={listaDeBoletosConPremioRandom}
            renderItem={(item: any) => {
              return (
                <List.Item key={item?._id}>
                  {`Boleto: ${item.premioMayor} - ${item.premioMenor} Premio: ${item.premio == 9 ? "Sorpresa" : item.premio?.toFixed(3)}`}
                </List.Item>
              )
            }}
          />
        </Col>
      </Row>
    </>


  )
}

export default FormBoletosAutomaticos