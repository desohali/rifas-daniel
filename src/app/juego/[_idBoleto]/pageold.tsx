"use client";
import JuegoSecundario from '@/components/JuegoSecundario';
import { setRifaDetalles } from '@/features/adminSlice';
import { useActualizarBoletoMutation, useBuscarBoletoMutation } from '@/services/userApi';
import { Button, Col, Flex, Row } from 'antd';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import swal from 'sweetalert';

const THREE = require('three');

var canvas: any, ctx: any, imagen: any;
var width = 642, height = 1280;

const App: React.FC<{ params: any }> = ({ params }: any) => {


  const dispatch = useDispatch();
  const { rifaDetalles: boletoDetalles } = useSelector((state: any) => state.admin);


  const [buscarRifa, { data, error, isLoading }] = useBuscarBoletoMutation();
  const [actualizarBoleto, { data: dataBoleto }] = useActualizarBoletoMutation();

  React.useEffect(() => {
    buscarRifa({ _id: params._idBoleto })
      .then((rifa: any) => {
        dispatch(setRifaDetalles(rifa.data))
      });
  }, []);

  const refCanvas2d = React.useRef<any>();
  const refCanvas3d = React.useRef<any>();





  React.useEffect(() => {
    const listenerClick = async (event: any) => {
      const rect = canvas.getBoundingClientRect(); // Posición y tamaño del canvas en la ventana
      const scaleX = canvas.width / rect.width; // Factor de escala en X
      const scaleY = canvas.height / rect.height; // Factor de escala en Y

      // Obtener las coordenadas escaladas dentro del canvas
      const x = (event.clientX - rect.left) * scaleX;
      const y = (event.clientY - rect.top) * scaleY;

      // Coordenadas del rectángulo
      const rectX = 110;
      const rectY = 825;
      const rectWidth = 420;
      const rectHeight = 265;


      // Verificar si el click está dentro del rectángulo
      if (
        x >= rectX &&
        x <= rectX + rectWidth &&
        y >= rectY &&
        y <= rectY + rectHeight
      ) {
        if (boletoDetalles.premio) {

          refCanvas2d.current.remove();
          if (isPlaying) {
            audioRefGana.current.pause();
          } else {
            audioRefGana.current.play();
          }
          setIsPlaying(!isPlaying);
          /* imagen = new Image();
          imagen.src = "../../../siPremio.jpeg";
          imagen.onload = () => {
            // Dibuja la imagen en el canvas
            ctx.drawImage(imagen, 0, 0);
          } */
          // Generar múltiples monedas
          // Crear escena, cámara y renderizador
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(75, 856 / 1024, 0.1, 1000);
          const renderer = new THREE.WebGLRenderer({ canvas: refCanvas3d.current });
          renderer.setSize(856, 1024);


          const textureLoader = new THREE.TextureLoader();
          const backgroundImage = textureLoader.load('../../../siPremio.jpeg'); // Ruta de tu imagen
          backgroundImage.wrapS = THREE.RepeatWrapping;
          backgroundImage.wrapT = THREE.RepeatWrapping;

          scene.background = backgroundImage;
          // Array para almacenar las monedas
          const coins: any = [];
          // Configurar color de fondo teal para la escena
          /* scene.background = new THREE.Color('teal'); */
          // Función para crear moneda
          // Función para crear moneda con borde suave
          const createCoin = () => {
            const extrudeSettings = {
              depth: 0.2, // Grosor de la moneda
              bevelEnabled: false,
            };

            const shape = new THREE.Shape();
            shape.moveTo(0, 0);
            shape.absarc(0, 0, 1, 0, Math.PI * 2, false);

            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            const frontMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700 }); // Color dorado
            const coin = new THREE.Mesh(geometry, frontMaterial);

            coin.position.x = Math.random() * window.innerWidth / 2 - window.innerWidth / 4;
            coin.position.y = Math.random() * 20 + 10;
            coin.position.z = Math.random() * 20 - 10;

            coin.rotation.x = Math.random() * Math.PI * 2;
            coin.rotation.y = Math.random() * Math.PI * 2;
            coin.rotation.z = Math.random() * Math.PI * 2;

            // Agregar borde gris a la moneda
            const edges = new THREE.EdgesGeometry(geometry);
            const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x333333 }));
            coin.add(line);

            scene.add(coin);
            coins.push(coin);


          }


          // Generar múltiples monedas
          for (let i = 0; i < 50; i++) {
            createCoin();
          }

          // Función para animar la lluvia de monedas
          const animateCoins = () => {
            requestAnimationFrame(animateCoins);

            coins.forEach((coin: any) => {
              coin.position.y -= Math.random() * .5; // Velocidad de caída aleatoria
              coin.rotation.z += 0; // Velocidad de rotación constante
              coin.rotation.x += 0.2; // Velocidad de rotación constante

              // Reiniciar posición si la moneda sale del rango visible
              if (coin.position.y < -10) {
                coin.position.y = Math.random() * 20 + 10;
                coin.position.x = Math.random() * 20 - 10;
                coin.position.z = Math.random() * 20 - 10;
                coin.rotation.z = Math.random() * Math.PI * 2;
              }
            });

            renderer.render(scene, camera);
          }

          // Configuración de la cámara
          camera.position.z = 15;

          // Iniciar animación
          animateCoins();

        } else {
          imagen = new Image();
          imagen.src = "../../../noPremio.jpeg";
          imagen.onload = () => {
            // Dibuja la imagen en el canvas
            canvas.width = 715;
            canvas.height = 1024;
            ctx.drawImage(imagen, 0, 0);
            if (isPlaying) {
              audioRef.current.pause();
            } else {
              audioRef.current.play();
            }
            setIsPlaying(!isPlaying);

            canvas.removeEventListener('click', listenerClick);
          }
        }

        await actualizarBoleto({ _id: boletoDetalles._id });
        setTimeout(async () => {
          await swal("", "Aceptar", "success");
          location.reload();
        }, 8000);
      }
    }
    if (!canvas) {
      canvas = document.querySelector("canvas");
    }
    if (boletoDetalles) {

      // Función para dibujar un rectángulo con bordes redondeados
      const roundedRect = (x: number, y: number, width: number, height: number, radius: number) => {

        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.arc(x + width - radius, y + radius, radius, -Math.PI / 2, 0);
        ctx.lineTo(x + width, y + height - radius);
        ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI / 2);
        ctx.lineTo(x + radius, y + height);
        ctx.arc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI);
        ctx.lineTo(x, y + radius);
        ctx.arc(x + radius, y + radius, radius, Math.PI, (Math.PI * 3) / 2);
        ctx.closePath();
      }

      if (boletoDetalles.estadoMenor) {
        canvas.addEventListener("click", listenerClick);
      }

      ctx = canvas.getContext("2d");

      imagen = new Image();
      imagen.src = "../../../raspaYGana.jpeg";
      imagen.onload = () => {
        // Dibuja la imagen en el canvas
        ctx.drawImage(imagen, 0, 0);
        // Dibujamos el rectangulo
        ctx.fillStyle = "teal";
        ctx.fillRect(182.5, ((height / 2) + 25), 277.5, 140);
        // Dibujamos el texto 
        ctx.font = "bold 84px serif";
        ctx.lineWidth = 5;
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        ctx.fillText(boletoDetalles?.premioMayor, 240, ((height / 2) + 90));
        ctx.strokeText(boletoDetalles?.premioMayor, 240, ((height / 2) + 90));

        ctx.fillText(boletoDetalles?.premioMenor, 240, ((height / 2) + 155));
        ctx.strokeText(boletoDetalles?.premioMenor, 240, ((height / 2) + 155));


        /* // Definir propiedades del borde y el relleno
        ctx.lineWidth = 2; // Ancho del borde
        //ctx.strokeStyle = "blue"; // Color del borde
        ctx.fillStyle = "lightblue"; // Color del relleno */

        if (!boletoDetalles.estadoMenor) {
          // Dibujar un rectángulo con bordes redondeados
          ctx.fillStyle = "teal";
          roundedRect(110, 825, 420, 265, 20); // (x, y, width, height, radio de borde)
          ctx.stroke(); // Dibujar el borde
          ctx.fill(); // Rellenar el rectángulo

          ctx.font = "bold 36px serif";
          ctx.fillStyle = "white";
          if (boletoDetalles.premio) {
            ctx.fillText("Este boleto ya fue jugado", 125, 940);
            ctx.fillText(`tiene un premio de ${boletoDetalles.premio.toFixed(3)}`, 125, 980);
          } else {
            ctx.fillText("Este boleto ya fue jugado", 125, 940);
            ctx.fillText(`no tiene premio`, 200, 980);
          }
        }


      };
    }

    return () => {
      // Remover el event listener al desmontar
      canvas.removeEventListener('click', listenerClick);
    };

  }, [boletoDetalles]);



  const audioRef = React.useRef<any>(null);
  const audioRefGana = React.useRef<any>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  return (
    <React.Suspense>
      <Row gutter={16}>
        <Col className="gutter-row" xs={24} sm={4} md={6} lg={8}>

        </Col>
        <Col className="gutter-row" xs={24} sm={16} md={12} lg={8}>
          <canvas ref={refCanvas2d} width={642} height={1280} ></canvas>
          <canvas ref={refCanvas3d} ></canvas>

          <audio ref={audioRef} src="../../../sigueParticipando.mp3" />
          <audio ref={audioRefGana} src="../../../hasGanado.mp3" />


        </Col>
        <Col className="gutter-row" xs={24} sm={4} md={6} lg={8}>

        </Col>
      </Row>
    </React.Suspense>
  )
}

export default App;