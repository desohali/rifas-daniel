"use client";
import React from 'react';
import {
  MenuFoldOutlined,
  LogoutOutlined,
  UsergroupAddOutlined,
  QrcodeOutlined,
  GiftOutlined,
  SketchOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme, Spin, Breadcrumb, Drawer, Space, DrawerProps, Typography, Flex, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setMenuButtonKey } from '@/features/adminSlice';
import { Footer } from 'antd/es/layout/layout';
import { useRouter } from 'next/navigation';
import { setUser } from '@/features/userSlice';

const { Title } = Typography;
const { Header, Content } = Layout;
enum OpcionesMenu {
  Rifas = 'Rifas',
  Usuarios = 'Usuarios',
  PremiosQR = 'PremiosQR',
  ValidadorQR = 'ValidadorQR',
}

const App: React.FC = ({ children }: any) => {

  const router = useRouter();

  const dispatch = useDispatch();
  const { menuButtonKey } = useSelector((state: any) => state.admin);

  const { user } = useSelector((state: any) => state.user);

  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setLoading(false);
  }, []);

  React.useEffect(() => {
    const [, , path] = location.pathname.split("/");
    const findMenuActive = (menu || []).find((m) => m?.path == path);
    if (findMenuActive) {
      dispatch(setMenuButtonKey(findMenuActive?.key));
    }
  }, []);

  const handleMenuClick = (e: any) => {
    // Verificar la opción seleccionada
    const pathnameLength = location.pathname.split("/").length - 2;
    let path = "";
    for (let index = 0; index < pathnameLength; index++) {
      path += "../";
    }

    switch (e.key as OpcionesMenu) {
      case OpcionesMenu.Rifas:
        router.push(`${path}admin/rifas`);
        break;
      case OpcionesMenu.Usuarios:
        router.push(`${path}admin/usuarios`);
        break;
      case OpcionesMenu.PremiosQR:
        router.push(`${path}admin/premios`);
        break;
      case OpcionesMenu.ValidadorQR:
        router.push(`${path}admin/boletos-devueltos`);
        break;
    }

    dispatch(setMenuButtonKey(e.key as OpcionesMenu));
    setOpen(false);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Drawer
  const [open, setOpen] = React.useState(false);
  const [size, setSize] = React.useState<DrawerProps['size']>();

  const showDefaultDrawer = () => {
    setSize('default');
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const menu: any[] = [];

  if (user) {
    if (user?.tipoUsuario == "s") {// super usuario
      menu.push(
        {
          key: OpcionesMenu.Rifas,
          icon: <SketchOutlined />,
          label: 'Rifas',
          path: 'rifas'
        },
        {
          key: OpcionesMenu.Usuarios,
          icon: <UsergroupAddOutlined />,
          label: 'Usuarios',
          path: 'usuarios'
        },
        {
          key: OpcionesMenu.PremiosQR,
          icon: <GiftOutlined />,
          label: 'Premios QR',
          path: 'premios'
        },
        {
          key: OpcionesMenu.ValidadorQR,
          icon: <QrcodeOutlined />,
          label: 'Validador QR',
          path: 'boletos-devueltos'
        }
      );
    }
    if (user?.tipoUsuario == "a") {// administrador
      menu.push(
        {
          key: OpcionesMenu.PremiosQR,
          icon: <GiftOutlined />,
          label: 'Premios QR',
          path: 'premios'
        },
        {
          key: OpcionesMenu.ValidadorQR,
          icon: <QrcodeOutlined />,
          label: 'Validador QR',
          path: 'boletos-devueltos'
        }
      );
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin tip="CARGANDO..." size="large" />
      </div>
    );
  }

  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        {/* <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[menuButtonKey]}
          items={[{ key: menuButtonKey || "Rifas", icon: <MenuFoldOutlined style={{ fontSize: "18px", marginLeft: "12px" }} /> }]}
          onClick={showDefaultDrawer}
        /> */}
        {/* <Button type="primary" onClick={showDefaultDrawer} style={{ height: "100%" }}>tetsst</Button> */}
        <Button onClick={showDefaultDrawer} type="primary" style={{ height: "100%", width: "64px" }} icon={<MenuFoldOutlined />} size={'large'} />

        <Space direction="vertical" style={{ margin: "auto" }}>
          <Title style={{ color: "white", marginBottom: "4px" }} level={3}>Juego De Rifas</Title>
        </Space>

      </Header>
      <Content style={{ padding: '0 12px' }}>
        <Drawer
          title="Opciones de rifas QR"
          placement="left"
          size={size}
          onClose={onClose}
          open={open}>
          <Menu
            theme='light'
            defaultSelectedKeys={[menuButtonKey]}
            onClick={handleMenuClick}
            mode="inline"
            items={menu}
          />
          <Flex vertical gap="small" style={{ width: '100%', marginTop: "1rem" }}>
            <Button icon={<LogoutOutlined />} onClick={() => {
              window.localStorage.removeItem("usuarioLuis");
              dispatch(setUser(null));

              const pathnameLength = location.pathname.split("/").length - 2;
              let path = "";
              for (let index = 0; index < pathnameLength; index++) {
                path += "../";
              }
              router.push(`${path}login`);
            }} type="primary" block danger>
              Cerrar Sesión
            </Button>
          </Flex>
        </Drawer>
        <Breadcrumb
          items={menu.filter((m: any) => m.key == menuButtonKey).map((m: any) => ({
            title: (
              <>
                {m.icon}
                <span>{m.label}</span>
              </>
            )
          }))}
          style={{ margin: '16px 0' }} />
        <div className="site-layout-content" style={{ background: colorBgContainer, padding: "12px" }}>
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        <Title level={5}>Copyright ©2024 | Juego De Rifas. Todos los derechos reservados.</Title>
      </Footer>
    </Layout>
  );
};

export default App;