"use client";
import React from 'react';
import swal from 'sweetalert';
import { useRouter } from 'next/navigation';
import { setUser } from '@/features/userSlice';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useLoginValidadorQRMutation } from '@/services/userApi';
import { Form, Input, Button, Row, Col, Card, Tag, Typography, Spin } from 'antd';
const { Text } = Typography;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const customizeRequiredMark = (label: React.ReactNode, { required }: { required: boolean }) => (
  <>
    {required ? <Tag color="error">Required</Tag> : <Tag color="warning">optional</Tag>}
    {label}
  </>
);

const App: React.FC = () => {

  const [autenticarUsuario, { data, error, isLoading }] = useLoginValidadorQRMutation();
  React.useEffect(() => {
    if (data && data?.tipoUsuario != "v") {
      window.localStorage.setItem("usuarioLuis", JSON.stringify(data));
      dispatch(setUser(data));
    }
  }, [data]);

  const router = useRouter();
  const usuario = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();
  React.useEffect(() => {
    const localStorageUser = window.localStorage.getItem("usuarioLuis");
    if (localStorageUser) {
      dispatch(setUser(JSON.parse(localStorageUser)));
    }
  }, []);

  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setLoading(false);
  }, []);

  React.useEffect(() => {
    if (usuario) {
      router.push('/admin');
    }
  }, [usuario]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin tip="CARGANDO..." size="large" />
      </div>
    );
  }

  return (
    <Row justify="center" align="middle" style={{ height: "100vh", width: "100vw" }}>
      <Col xs={20} sm={18} md={14} lg={12}>
        <Card hoverable style={{ width: "100%" }} title={<Text strong>Autenticación</Text>} >
          <Form {...layout} name="login-form" initialValues={{
            usuario: '',
            password: ''
          }} onFinish={async (values) => {
            const { data }: any = await autenticarUsuario(values);
            if (!data || data?.tipoUsuario == "v") {
              swal("Alerta", "Usuario no autorizado!", "warning");
            }
          }} requiredMark={customizeRequiredMark}>
            <Form.Item label={<Text>Usuario</Text>} name="usuario" rules={[{ required: true, message: 'Por favor ingrese usuario!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label={<Text>Contraseña</Text>} name="password" rules={[{ required: true, message: 'Por favor ingrese contraseña!' }]}>
              <Input type='password' />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button loading={isLoading} icon={<ArrowRightOutlined />} type="primary" htmlType="submit">
                Ingresar
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default App;
