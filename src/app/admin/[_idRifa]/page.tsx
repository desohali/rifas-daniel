"use client";
import React from 'react';
import Marquee from 'react-fast-marquee';
import { setRifaDetalles } from '@/features/adminSlice';
import { useBuscarBoletoMutation, useBuscarRifaMutation } from '@/services/userApi';
import { Alert, Button, Col, Flex, Row, Spin, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
const { Title } = Typography;

var canvas: any, ctx: any;
var numerosInicio = [0, 0, 0, 0];
var numerosGanadores = [2, 3, 4, 5];
var cordenadas = { x: 300, y: 665 };// y 100
var iniciarJuegoTimeout: any;
var nTimeout1: any, nTimeout2: any, nTimeout3: any, nTimeout4: any;
var width = 1280, height = 833;// 130
var imagen: any;
var imagenRifa: any;
const imageUrl = "https://yocreoquesipuedohacerlo.com/assets/images/juegoDeRifas/";
function getRandomColor() {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);

  return `rgb(${red},${green}, ${blue})`;
};

const detenerJuego = () => {
  clearTimeout(nTimeout1);
  setTimeout(() => {
    clearTimeout(nTimeout2);
  }, 1000);
  setTimeout(() => {
    clearTimeout(nTimeout3);
  }, 2000);
  setTimeout(() => {
    clearTimeout(nTimeout4);
  }, 3000);
};

const imagenLoaded = (imageBase64: string) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => { resolve(img) }
    img.onerror = err => { throw err }
    img.src = imageBase64
  });
};

const page = ({ params }: any) => {

  const dispatch = useDispatch();
  const { rifaDetalles } = useSelector((state: any) => state.admin);

  const [buscarRifa, { data, error, isLoading }] = useBuscarRifaMutation();
  React.useEffect(() => {
    buscarRifa({ _id: params._idRifa })
      .then((rifa: any) => {
        dispatch(setRifaDetalles(rifa.data))
      });
  }, []);


  React.useEffect(() => {
    if (rifaDetalles) {
      (async () => {
        const responseImagen = await fetch(`${imageUrl}${rifaDetalles.imagen}.png`);
        const blobImagen = await responseImagen.blob();
        imagenRifa = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = async function (event: any) {
            const logoImagen = await imagenLoaded(event.target.result);
            resolve(logoImagen);
          };
          reader.readAsDataURL(blobImagen);
        });


        canvas = document.querySelector("canvas");
        ctx = canvas.getContext("2d");
        if (canvas) {
          cordenadas = { x: 410, y: 665 };
        } else {
          cordenadas = { x: 300, y: 665 };
        }

        // Carga la imagen
        imagen = new Image();
        imagen.onload = function () {
          // Dibuja la imagen en el canvas
          ctx.drawImage(imagen, 0, 0);
          ctx.drawImage(imagenRifa, ((imagen?.width / 2) - (imagenRifa?.width / 2) - 75), 0, 450, 450);
        };
        imagen.src = '../../videos/fondoPremioMayor.png';

        // Dibujamos el color de fondo
        ctx.fillStyle = rifaDetalles?.color || "white";

        ctx.font = "bold 170px serif";
        ctx.lineWidth = 5;
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";

        for (const numero of numerosInicio) {
          ctx.fillText("1 ", cordenadas.x, cordenadas.y - 125);
          ctx.strokeText("1 ", cordenadas.x, cordenadas.y - 125);

          ctx.fillText("0 ", cordenadas.x, cordenadas.y);
          ctx.strokeText("0 ", cordenadas.x, cordenadas.y);

          ctx.fillText("9 ", cordenadas.x, cordenadas.y + 125);
          ctx.strokeText("9 ", cordenadas.x, cordenadas.y + 125);

          cordenadas.x += 125;
        }






      })();
    }

    return () => {
      clearTimeout(nTimeout1);
      clearTimeout(nTimeout2);
      clearTimeout(nTimeout3);
      clearTimeout(nTimeout4);
    }

  }, [rifaDetalles]);

  const iniciarNumero1 = React.useCallback(() => {
    cordenadas = { x: 410, y: 540 };
    ctx.clearRect(400, 520, 125, 175);
    // Dibujamos el color de fondo
    ctx.fillStyle = rifaDetalles?.color || "white";
    ctx.fillRect(400, 520, 125, 175);
    ctx.fillStyle = "black";

    cordenadas.y = 540;
    const randoms = [Math.floor(Math.random() * 9), Math.floor(Math.random() * 9), Math.floor(Math.random() * 9)];
    ctx.fillText(randoms[0].toString(), cordenadas.x, cordenadas.y);
    ctx.strokeText(randoms[0].toString(), cordenadas.x, cordenadas.y);
    cordenadas.y += 125;
    ctx.fillText(randoms[1].toString(), cordenadas.x, cordenadas.y);
    ctx.strokeText(randoms[1].toString(), cordenadas.x, cordenadas.y);
    cordenadas.y += 125;
    ctx.fillText(randoms[2].toString(), cordenadas.x, cordenadas.y);
    ctx.strokeText(randoms[2].toString(), cordenadas.x, cordenadas.y);
    // cordenadas.x += 125;

    ctx.drawImage(imagen, 0, 0);
    ctx.drawImage(imagenRifa, ((imagen?.width / 2) - (imagenRifa?.width / 2) - 75), 0, 450, 450);

    nTimeout1 = setTimeout(() => {
      ctx.clearRect(400, 520, 125, 175);
      iniciarNumero1();
    }, 50);
  }, [nTimeout1, rifaDetalles]);

  const iniciarNumero2 = React.useCallback(() => {
    cordenadas = { x: (410 + 125), y: 540 };
    ctx.clearRect(400 + 125, 520, 125, 175);
    // Dibujamos el color de fondo
    ctx.fillStyle = rifaDetalles?.color || "white";
    ctx.fillRect(400 + 125, 520, 125, 175);
    ctx.fillStyle = "black";

    cordenadas.y = 540;
    const randoms = [Math.floor(Math.random() * 9), Math.floor(Math.random() * 9), Math.floor(Math.random() * 9)];
    ctx.fillText(randoms[0].toString(), cordenadas.x, cordenadas.y);
    ctx.strokeText(randoms[0].toString(), cordenadas.x, cordenadas.y);
    cordenadas.y += 125;
    ctx.fillText(randoms[1].toString(), cordenadas.x, cordenadas.y);
    ctx.strokeText(randoms[1].toString(), cordenadas.x, cordenadas.y);
    cordenadas.y += 125;
    ctx.fillText(randoms[2].toString(), cordenadas.x, cordenadas.y);
    ctx.strokeText(randoms[2].toString(), cordenadas.x, cordenadas.y);
    // cordenadas.x += 125;

    ctx.drawImage(imagen, 0, 0);
    ctx.drawImage(imagenRifa, ((imagen?.width / 2) - (imagenRifa?.width / 2) - 75), 0, 450, 450);

    nTimeout2 = setTimeout(() => {
      ctx.clearRect(400 + 125, 520, 125, 175);
      iniciarNumero2();
    }, 50);
  }, [nTimeout2, rifaDetalles]);

  const iniciarNumero3 = React.useCallback(() => {
    cordenadas = { x: (410 + 250), y: 540 };
    ctx.clearRect(400 + 250, 520, 125, 175);
    // Dibujamos el color de fondo

    ctx.fillStyle = rifaDetalles?.color || "white";
    ctx.fillRect(400 + 250, 520, 125, 175);
    ctx.fillStyle = "black";

    cordenadas.y = 540;
    const randoms = [Math.floor(Math.random() * 9), Math.floor(Math.random() * 9), Math.floor(Math.random() * 9)];
    ctx.fillText(randoms[0].toString(), cordenadas.x, cordenadas.y);
    ctx.strokeText(randoms[0].toString(), cordenadas.x, cordenadas.y);
    cordenadas.y += 125;
    ctx.fillText(randoms[1].toString(), cordenadas.x, cordenadas.y);
    ctx.strokeText(randoms[1].toString(), cordenadas.x, cordenadas.y);
    cordenadas.y += 125;
    ctx.fillText(randoms[2].toString(), cordenadas.x, cordenadas.y);
    ctx.strokeText(randoms[2].toString(), cordenadas.x, cordenadas.y);
    // cordenadas.x += 125;

    ctx.drawImage(imagen, 0, 0);
    ctx.drawImage(imagenRifa, ((imagen?.width / 2) - (imagenRifa?.width / 2) - 75), 0, 450, 450);
    
    nTimeout3 = setTimeout(() => {
      ctx.clearRect(400 + 250, 520, 125, 175);
      iniciarNumero3();
    }, 50);
  }, [nTimeout3, rifaDetalles]);

  const iniciarNumero4 = React.useCallback(() => {
    cordenadas = { x: (410 + 375), y: 540 };
    ctx.clearRect(400 + 375, 520, 125, 175);
    // Dibujamos el color de fondo
    ctx.fillStyle = rifaDetalles?.color || "white";
    ctx.fillRect(400 + 375, 520, 125, 175);
    ctx.fillStyle = "black";

    cordenadas.y = 540;
    const randoms = [Math.floor(Math.random() * 9), Math.floor(Math.random() * 9), Math.floor(Math.random() * 9)];
    ctx.fillText(randoms[0].toString(), cordenadas.x, cordenadas.y);
    ctx.strokeText(randoms[0].toString(), cordenadas.x, cordenadas.y);
    cordenadas.y += 125;
    ctx.fillText(randoms[1].toString(), cordenadas.x, cordenadas.y);
    ctx.strokeText(randoms[1].toString(), cordenadas.x, cordenadas.y);
    cordenadas.y += 125;
    ctx.fillText(randoms[2].toString(), cordenadas.x, cordenadas.y);
    ctx.strokeText(randoms[2].toString(), cordenadas.x, cordenadas.y);
    // cordenadas.x += 125;

    ctx.drawImage(imagen, 0, 0);
    ctx.drawImage(imagenRifa, ((imagen?.width / 2) - (imagenRifa?.width / 2) - 75), 0, 450, 450);

    nTimeout4 = setTimeout(() => {
      ctx.clearRect(400 + 375, 520, 125, 175);
      iniciarNumero4();
    }, 50);
  }, [nTimeout4, rifaDetalles]);

  /* const iniciarJuego = React.useCallback(() => {

    cordenadas = { x: 410, y: 540 };
    ctx.clearRect(0, 0, width, height);
    // Dibujamos el color de fondo
    ctx.fillStyle = rifaDetalles?.color || "white";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "black";
    for (const numero of numerosInicio) {

      cordenadas.y = 540;
      const randoms = [Math.floor(Math.random() * 9), Math.floor(Math.random() * 9), Math.floor(Math.random() * 9)];
      ctx.fillText(randoms[0].toString(), cordenadas.x, cordenadas.y);
      ctx.strokeText(randoms[0].toString(), cordenadas.x, cordenadas.y);
      cordenadas.y += 125;
      ctx.fillText(randoms[1].toString(), cordenadas.x, cordenadas.y);
      ctx.strokeText(randoms[1].toString(), cordenadas.x, cordenadas.y);
      cordenadas.y += 125;
      ctx.fillText(randoms[2].toString(), cordenadas.x, cordenadas.y);
      ctx.strokeText(randoms[2].toString(), cordenadas.x, cordenadas.y);
      cordenadas.x += 125;
    }

    ctx.drawImage(imagen, 0, 0);

    iniciarJuegoTimeout = setTimeout(() => {
      ctx.clearRect(0, 0, width, height);
      iniciarJuego();
    }, 50);
  }, [iniciarJuegoTimeout, rifaDetalles]); */

  const iniciarJuego = React.useCallback(() => {
    iniciarNumero1();
    iniciarNumero2();
    iniciarNumero3();
    iniciarNumero4();
  }, [nTimeout1, nTimeout2, nTimeout3, nTimeout4, rifaDetalles]);


  const detenerNumero1 = React.useCallback(() => {

    cordenadas = { x: 410, y: 665 };
    ctx.clearRect(400, 520, 125, 175);
    // Dibujamos el color de fondo
    ctx.fillStyle = rifaDetalles?.color || "white";
    ctx.fillRect(400, 520, 125, 175);
    ctx.fillStyle = "black";
    const [numero] = rifaDetalles?.ganador.split("");

    const randoms = [
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 9),
    ];
    ctx.fillText(randoms[0].toString(), cordenadas.x, cordenadas.y - 125);
    ctx.strokeText(randoms[0].toString(), cordenadas.x, cordenadas.y - 125);

    ctx.fillText(numero.toString(), cordenadas.x, cordenadas.y);
    ctx.strokeText(numero.toString(), cordenadas.x, cordenadas.y);

    ctx.fillText(randoms[2].toString(), cordenadas.x, cordenadas.y + 125);
    ctx.strokeText(randoms[2].toString(), cordenadas.x, cordenadas.y + 125);

    // cordenadas.x += 125;

    ctx.drawImage(imagen, 0, 0);
    ctx.drawImage(imagenRifa, ((imagen?.width / 2) - (imagenRifa?.width / 2) - 75), 0, 450, 450);
  }, [nTimeout1, rifaDetalles]);

  const detenerNumero2 = React.useCallback(() => {

    cordenadas = { x: 410 + 125, y: 665 };
    ctx.clearRect(400 + 125, 520, 125, 175);
    // Dibujamos el color de fondo
    ctx.fillStyle = rifaDetalles?.color || "white";
    ctx.fillRect(400 + 125, 520, 125, 175);
    ctx.fillStyle = "black";
    const [, numero] = rifaDetalles?.ganador.split("");

    const randoms = [
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 9),
    ];
    ctx.fillText(randoms[0].toString(), cordenadas.x, cordenadas.y - 125);
    ctx.strokeText(randoms[0].toString(), cordenadas.x, cordenadas.y - 125);

    ctx.fillText(numero.toString(), cordenadas.x, cordenadas.y);
    ctx.strokeText(numero.toString(), cordenadas.x, cordenadas.y);

    ctx.fillText(randoms[2].toString(), cordenadas.x, cordenadas.y + 125);
    ctx.strokeText(randoms[2].toString(), cordenadas.x, cordenadas.y + 125);

    // cordenadas.x += 125;

    ctx.drawImage(imagen, 0, 0);
    ctx.drawImage(imagenRifa, ((imagen?.width / 2) - (imagenRifa?.width / 2) - 75), 0, 450, 450);
  }, [nTimeout2, rifaDetalles]);

  const detenerNumero3 = React.useCallback(() => {

    cordenadas = { x: 410 + 250, y: 665 };
    ctx.clearRect(400 + 250, 520, 125, 175);
    // Dibujamos el color de fondo
    ctx.fillStyle = rifaDetalles?.color || "white";
    ctx.fillRect(400 + 250, 520, 125, 175);
    ctx.fillStyle = "black";
    const [, , numero] = rifaDetalles?.ganador.split("");

    const randoms = [
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 9),
    ];
    ctx.fillText(randoms[0].toString(), cordenadas.x, cordenadas.y - 125);
    ctx.strokeText(randoms[0].toString(), cordenadas.x, cordenadas.y - 125);

    ctx.fillText(numero.toString(), cordenadas.x, cordenadas.y);
    ctx.strokeText(numero.toString(), cordenadas.x, cordenadas.y);

    ctx.fillText(randoms[2].toString(), cordenadas.x, cordenadas.y + 125);
    ctx.strokeText(randoms[2].toString(), cordenadas.x, cordenadas.y + 125);

    // cordenadas.x += 125;

    ctx.drawImage(imagen, 0, 0);
    ctx.drawImage(imagenRifa, ((imagen?.width / 2) - (imagenRifa?.width / 2) - 75), 0, 450, 450);
  }, [nTimeout3, rifaDetalles]);

  const detenerNumero4 = React.useCallback(() => {

    cordenadas = { x: 410 + 375, y: 665 };
    ctx.clearRect(400 + 375, 520, 125, 175);
    // Dibujamos el color de fondo
    ctx.fillStyle = rifaDetalles?.color || "white";
    ctx.fillRect(400 + 375, 520, 125, 175);
    ctx.fillStyle = "black";
    const [, , , numero] = rifaDetalles?.ganador.split("");

    const randoms = [
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 9),
    ];
    ctx.fillText(randoms[0].toString(), cordenadas.x, cordenadas.y - 125);
    ctx.strokeText(randoms[0].toString(), cordenadas.x, cordenadas.y - 125);

    ctx.fillText(numero.toString(), cordenadas.x, cordenadas.y);
    ctx.strokeText(numero.toString(), cordenadas.x, cordenadas.y);

    ctx.fillText(randoms[2].toString(), cordenadas.x, cordenadas.y + 125);
    ctx.strokeText(randoms[2].toString(), cordenadas.x, cordenadas.y + 125);

    // cordenadas.x += 125;

    ctx.drawImage(imagen, 0, 0);
    ctx.drawImage(imagenRifa, ((imagen?.width / 2) - (imagenRifa?.width / 2) - 75), 0, 450, 450);
  }, [nTimeout4, rifaDetalles]);
  /* if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin tip="CARGANDO..." size="large" />
      </div>
    );
  } */

  return (
    <React.Suspense>
      <Row gutter={16}>
        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24}>
          <Alert style={{ marginBottom: "12px" }} message={
            <Marquee pauseOnHover gradient={false}>
              <Title style={{ marginBottom: "6px" }} level={3}>Juego De Rifas - premio {rifaDetalles?.premio?.toFixed(3)}</Title>
            </Marquee>
          } type="info" showIcon />
        </Col>
        <Col className="gutter-row" xs={24} sm={24} md={2} lg={4}>

        </Col>
        <Col className="gutter-row" xs={24} sm={24} md={20} lg={16}>
          <canvas width={width} height={height} style={{ width: "100%", borderRadius: ".5rem" }}></canvas>
        </Col>
        <Col className="gutter-row" xs={24} sm={24} md={2} lg={4}>
          <Flex vertical gap="small" style={{ width: '100%' }}>
            <Button danger onClick={async () => {
              /* const iniciar = await swal({
                title: "¿ Desea iniciar el juego ?",
                text: "",
                icon: "warning",
                buttons: { cancel: true, confirm: true },
                dangerMode: true,
              });
              if (iniciar) */
              // iniciarJuego();
              iniciarJuego();
            }} type="primary" block>
              Iniciar juego
            </Button>
            <Button onClick={() => {
              detenerJuego();
              detenerNumero1();
              setTimeout(() => {
                detenerNumero2();
              }, 1001);
              setTimeout(() => {
                detenerNumero3();
              }, 2001);
              setTimeout(() => {
                detenerNumero4();
              }, 3001);
            }} type="primary" block>
              Terminar juego
            </Button>
          </Flex>
        </Col>
      </Row>
    </React.Suspense>
  )
}

export default page;