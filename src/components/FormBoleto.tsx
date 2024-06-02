"use client"
import swal from 'sweetalert';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MinusCircleOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Drawer, Flex, Form, Input, List, Select, Space, Tooltip } from 'antd';
import { useEliminarPremioBoletoMutation, useListarBoletosQueryQuery, useRegistrarPremioBoletosMutation } from '@/services/userApi';
import { setListaDeBoletos, setListaDeBoletosConPremio, setOpenFormBoleto } from '@/features/adminSlice';
import { DeleteOutlined } from '@ant-design/icons';


const FormBoleto: React.FC = () => {

  const dispatch = useDispatch();
  const [value, setValue] = React.useState('');

  const {
    openFormBoleto,
    rifaDetalles,
    listaDeBoletos,
    listaDeBoletosConPremio
  } = useSelector((state: any) => state.admin);

  const [eliminarPremioBoleto, { data: dataBoleto, error: errorBoleto, isLoading: isLoadingBoleto }] = useEliminarPremioBoletoMutation()

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


  const {
    data: dataBoletosGanadores,
    error: errorBoletosGanadores,
    refetch
  } = useListarBoletosQueryQuery({ _idRifa: rifaDetalles?._id, boletosGanadores: true });
  React.useEffect(() => {
    if (dataBoletosGanadores) {
      dispatch(setListaDeBoletosConPremio(dataBoletosGanadores));
    }
  }, [dataBoletosGanadores]);

  const [registrarPremioBoletos, { isLoading: isLoadingRegistrar }] = useRegistrarPremioBoletosMutation();

  const boletosSinPremio = (listaDeBoletos || [])
    .map((b: any) => ({ value: b.premioMenor }));

  const [form] = Form.useForm();
  const refBoletos = React.useRef<any>();

  const onFinish = (values: any) => {

    if (!Boolean(Object.keys(values?.boletos).length)) return;

    registrarPremioBoletos({ boletos: JSON.stringify(values.boletos) })
      .then(async () => {
        swal("", "Los boletos se actualizaron correctamente!", "success");
        form.resetFields();
        refetch();
      });
  };


  return (
    <Drawer
      title="2N° ganadores"
      width={500}
      onClose={() => dispatch(setOpenFormBoleto(false))}
      open={openFormBoleto}
      style={{ width: "100%", }}
      styles={{
        body: {
          paddingBottom: 80,
        },
      }}>
      <AutoComplete
        allowClear
        bordered
        disabled={isLoading}
        value={value}
        style={{ width: "100%", marginBottom: "12px" }}
        options={boletosSinPremio}
        onSearch={(search) => {
          setValue(search);
        }}
        onSelect={(data) => {
          const findBoleto = listaDeBoletos.find((b: any) => (b.premioMenor == data));
          if (findBoleto) {
            refBoletos.current({ ...findBoleto, premio: "" });
            setValue("");
          }
        }}
        placeholder="Buscar 2N° ganadores"
        filterOption={(inputValue, option: any) => {
          return option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }}
      />

      <Form
        form={form}
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        style={{ maxWidth: 600, width: "100%", }}
        autoComplete="off"
      >
        <Form.List name="boletos" >
          {(fields, { add, remove }) => {
            refBoletos.current = add.bind(null);
            return (
              <>
                {fields.map(({ key, name, ...restField }) => {
                  const boleto = form.getFieldValue("boletos")[name];
                  return (
                    <Space key={key} style={{ display: 'flex', justifyContent: "space-between", width: "100%", marginBottom: 8 }} align="baseline">
                      <Form.Item
                        label={`Boleto: ${boleto.premioMayor} - ${boleto.premioMenor}`}
                        {...restField}
                        name={[name, 'premioMayor']}
                      >
                      </Form.Item>
                      <Form.Item
                        style={{ display: "none" }}
                        {...restField}
                        name={[name, '_id']}
                        rules={[{ required: true, message: 'Ingrese _id' }]}
                      >
                        <Input placeholder="_id" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'premio']}
                        style={{ minWidth: "120px" }}
                        rules={[{ required: true, message: 'Ingrese premio' }]}
                      >
                        <Select defaultValue="5000">
                          <Select.Option value="5000">5 mil</Select.Option>
                          <Select.Option value="10000">10 mil</Select.Option>
                          <Select.Option value="20000">20 mil</Select.Option>
                          <Select.Option value="30000">30 mil</Select.Option>
                          <Select.Option value="50000">50 mil</Select.Option>
                          <Select.Option value="80000">80 mil</Select.Option>
                          <Select.Option value="160000">160 mil</Select.Option>
                          <Select.Option value="320000">320 mil</Select.Option>
                          <Select.Option value="600000">600 mil</Select.Option>
                          <Select.Option value="1200000">1.2 millones</Select.Option>
                          <Select.Option value="9">sorpresa</Select.Option>
                        </Select>
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  )
                })}
              </>
            )
          }}
        </Form.List>
        <Form.Item>
          <Flex vertical gap="small" style={{ width: '50%', margin: "auto" }}>
            <Button loading={isLoadingRegistrar} type="primary" htmlType="submit" block>
              Registrar
            </Button>
          </Flex>
        </Form.Item>
      </Form>

      <List
        size="small"
        header={<div>{`Lista de 2N° ganadores : ${listaDeBoletosConPremio.length}`}</div>}
        bordered
        dataSource={listaDeBoletosConPremio}
        renderItem={(item: any) => {
          return (
            <List.Item key={item?._id} actions={[
              <Tooltip title="Eliminar Premio">
                <Button loading={isLoadingBoleto} danger type="primary" onClick={async () => {
                  const res: any = await eliminarPremioBoleto({ _id: item?._id });
                  console.log('res', res);
                  if (res?.data?.status) {
                    swal("", "Boleto eliminado correctamente!", "success");
                    refetch();
                  } else {
                    swal("", res?.data?.error, "error");
                  }
                }} shape="circle" icon={<DeleteOutlined />} />
              </Tooltip>
            ]}>
              {`Boleto: ${item.premioMayor} - ${item.premioMenor} Premio: ${item.premio == 9 ? "Sorpresa" : item.premio.toFixed(3)}`}
            </List.Item>
          )
        }}
      />
    </Drawer>
  )
};

export default FormBoleto;