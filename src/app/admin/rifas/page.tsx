"use client";
import React from 'react';
import { Button, Col, Flex, Form, Pagination, Row } from 'antd';
import FormRifa from '@/components/FormRifa';
import { useDispatch, useSelector } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';
import { setListaDeRifas, setOpenFormRifa } from '@/features/adminSlice';
import CardRifa from '@/components/CardRifa';
import { useListarRifasMutation } from '@/services/userApi';
import FormBoleto from '@/components/FormBoleto';

const Rifas: React.FC = () => {

  const dispatch = useDispatch();
  const [formRifa] = Form.useForm();

  const [total, setTotal] = React.useState(1);
  const [current, setCurrent] = React.useState(1);
  const onChange = (page: number) => {
    setCurrent(page);
    listarRifas({ skip: page });
  };

  const { listaDeRifas, isRifa, rifaDetalles } = useSelector((state: any) => state.admin);

  const [listarRifas, { data, error, isLoading }] = useListarRifasMutation();

  React.useEffect(() => {
    listarRifas({ skip: current });
  }, []);

  React.useEffect(() => {
    if (data) {
      dispatch(setListaDeRifas(data?.listaDeRifas));
      setTotal(data?.count);
    }
  }, [data]);


  React.useEffect(() => {
    if (isRifa) {
      listarRifas({ skip: current });
    }
  }, [isRifa]);


  return (
    <React.Suspense>
      <canvas id='canvasBoleto' width={300} height={300} style={{ display: "none", border: "2px solid black" }}></canvas>
      <Row gutter={8} style={{ padding: "1rem 0rem" }}>
        <Col className="gutter-row" xs={24} sm={24} md={24} lg={8}>

        </Col>
        <Col className="gutter-row" xs={24} sm={12} md={12} lg={8}>
          <Flex vertical gap="small" style={{ width: '100%', marginBottom: '12px' }}>
            <Button type="primary" onClick={() => {
              dispatch(setOpenFormRifa(true));
              formRifa.resetFields();
            }} icon={<PlusOutlined />}>
              Registrar rifa
            </Button>
          </Flex>
          <FormRifa formRifa={formRifa} />
          {rifaDetalles && <FormBoleto />}
        </Col>
        <Col className="gutter-row" xs={24} sm={12} md={12} lg={8}>
          <div style={{ width: "100%", textAlign: "center" }}>
            <Pagination
              disabled={isLoading}
              current={current}
              defaultPageSize={4}
              onChange={onChange}
              total={total}
              showSizeChanger={false} />
          </div>
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        {listaDeRifas.map((rifa: any) => (
          <Col key={rifa._id} className="gutter-row" xs={12} sm={12} md={8} lg={6}>
            <CardRifa rifa={rifa} formRifa={formRifa} />
          </Col>
        ))}
      </Row>
    </React.Suspense >
  )
}

export default Rifas;