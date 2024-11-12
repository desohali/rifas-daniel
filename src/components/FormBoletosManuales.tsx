"use client"
import swal from 'sweetalert';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MinusCircleOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Drawer, Flex, Form, Input, List, Select, Space, Tooltip } from 'antd';
import { useEliminarPremioBoletoMutation, useListarBoletosQueryQuery, useRegistrarPremioBoletosMutation } from '@/services/userApi';
import { setListaDeBoletos, setListaDeBoletosConPremio, setOpenFormBoleto } from '@/features/adminSlice';
import { DeleteOutlined } from '@ant-design/icons';


const FormBoletosManuales: React.FC = () => {

  const dispatch = useDispatch();
  const [value, setValue] = React.useState('');
  const [eliminarPremioBoleto, {
    data: dataBoleto,
    error: errorBoleto,
    isLoading: isLoadingBoleto
  }] = useEliminarPremioBoletoMutation();

  const {
    rifaDetalles,
    listaDeBoletos,
    listaDeBoletosConPremio
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
    <div style={{ width: "100%" }}>
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
        placeholder="Buscar ganadores QR manuales"
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
                          <Select.Option value="100000">100 mil</Select.Option>
                          <Select.Option value="120000">120 mil</Select.Option>
                          <Select.Option value="140000">140 mil</Select.Option>
                          <Select.Option value="160000">160 mil</Select.Option>
                          <Select.Option value="180000">180 mil</Select.Option>
                          <Select.Option value="200000">200 mil</Select.Option>
                          <Select.Option value="240000">240 mil</Select.Option>
                          <Select.Option value="260000">260 mil</Select.Option>
                          <Select.Option value="300000">300 mil</Select.Option>
                          <Select.Option value="320000">320 mil</Select.Option>
                          <Select.Option value="350000">350 mil</Select.Option>
                          <Select.Option value="400000">400 mil</Select.Option>
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
        style={{ maxHeight: "300px", overflowY: "auto" }}
        size="small"
        header={(
          <div>
            <p>{`Lista de ganadores QR manuales : ${listaDeBoletosConPremio.length}`}</p>
            <p>{`Total : ${listaDeBoletosConPremio.reduce((a: any, cv: any) => {
              return (a + cv.premio)
            }, 0)?.toLocaleString('en-US')?.replace(/,/g, '.')}`}
            </p>
          </div>
        )}
        bordered
        dataSource={listaDeBoletosConPremio}
        renderItem={(item: any) => {
          return (
            <List.Item key={item?._id} actions={[
              <Tooltip title="Eliminar Premio">
                <Button loading={isLoadingBoleto} danger type="primary" onClick={async () => {
                  const res: any = await eliminarPremioBoleto({ _id: item?._id });
                  if (res?.data?.status) {
                    swal("", "Boleto eliminado correctamente!", "success");
                    refetch();
                  } else {
                    swal("", res?.data?.error, "error");
                  }
                }} shape="circle" icon={<DeleteOutlined />} />
              </Tooltip>
            ]}>
              {`Boleto: ${item.premioMayor} - ${item.premioMenor} Premio: ${item.premio?.toLocaleString('en-US')?.replace(/,/g, '.')} Mil`}
            </List.Item>
          )
        }}
      />
    </div>
  )
};

export default FormBoletosManuales;