"use client";
import React from 'react';
import { Result, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';


const App: React.FC = () => {

  const router = useRouter();

  const { user } = useSelector((state: any) => state.user);

  const [loading, setloading] = React.useState<Boolean>(true);
  React.useEffect(() => {
    setloading(false);
    if (user) {
      if (user?.tipoUsuario == "s") {
        router.push('./admin/rifas');
      }

      if (user?.tipoUsuario == "a") {
        router.push('./admin/premios');
      }
    }
  }, [user]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin tip="CARGANDO..." size="large" />
      </div>
    );
  }

  return (
    <Result
      status="403"
      title="403"
      subTitle="Lo sentimos, no está autorizado a acceder a esta página."
    />
  );
};

export default App;