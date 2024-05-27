"use client";
import React from 'react';
import { EyeOutlined, EditOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import { Button, Card, Tooltip } from 'antd';
import { useRouter } from 'next/navigation';
import { setImagenRifa, setListaDeBoletos, setOpenFormBoleto, setOpenFormRifa, setRifaDetalles } from '@/features/adminSlice';
import { useDispatch } from 'react-redux';
import { useListarBoletosMutation, useListarBoletosQueryQuery } from '@/services/userApi';
const { PDFDocument, rgb } = require('pdf-lib');
const QRCode = require('qrcode');

const imageUrl = "https://yocreoquesipuedohacerlo.com/assets/images/juegoDeRifas/";

var pdfDoc: any;
var imagen: any;
var imgFW: any;
////////////////////////////////////////////////////////////////////
const imagenLoaded = (imageBase64: string) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => { resolve(img) }
    img.onerror = err => { throw err }
    img.src = imageBase64
  });
};
const crearBoleto = async (element: any, canvas: any, ctx: any, findRifa: any) => {

  // aqui se puede agregar el id del usuario administrador que nadie lo tiene
  const imageBase64 = await QRCode.toDataURL(`${window?.location?.origin}/juego/${element._id}`, {
    width: 90,
    errorCorrectionLevel: 'L',
    type: 'png',
    rendererOpts: {
      quality: 1,
    }
  });

  const img = await imagenLoaded(imageBase64);
  // rectangulo grande del color de la rifa
  ctx.clearRect(0, 0, 341, 213);
  // rectangulo grande del color de la rifa
  ctx.fillStyle = findRifa.color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // tapamos el rectangulo grande con otro
  // rectangulo de color blanco para que 
  // paresca como si fuera bordes
  ctx.fillStyle = "white";
  ctx.fillRect(15, 15, canvas.width - 30, canvas.height - 30);

  ctx.fillStyle = findRifa.color;//"black";
  // Dibuja la imagen wasap y facebook
  ctx.drawImage(imgFW, 25, 25, Math.ceil(imgFW.width / 4), Math.ceil(imgFW.height / 4));

  // comensasos a dijubar los textos
  ctx.font = "bold 18px serif";
  ctx.fillText(findRifa.facebook, Math.ceil(imgFW.width / 4) + 30, 42.5);
  ctx.fillText(findRifa.whatsapp, Math.ceil(imgFW.width / 4) + 30, 72.5);

  ctx.fillText(findRifa.fecha.split("-").join("/"), 230, 42.5);
  ctx.fillText(findRifa.premio.toFixed(3), 230, 72.5);

  // dibujasmos la imagen
  ctx.drawImage(imagen, 25, 100, 80, 80);
  ctx.font = "bold 22px serif";
  ctx.fillStyle = "white";
  ctx.strokeStyle = findRifa.color; // Color del borde
  ctx.lineWidth = 5; // Grosor del borde

  // Dibujar el texto con borde
  ctx.strokeText(`1N° ${element.premioMayor}`, 120, 120);
  ctx.fillText(`1N° ${element.premioMayor}`, 120, 120);
  ctx.strokeText(`2N° ${element.premioMenor}`, 120, 150);
  ctx.fillText(`2N° ${element.premioMenor}`, 120, 150);
  // suerte
  ctx.fillStyle = findRifa.color;//"black";
  ctx.font = "bold 18px serif";
  ctx.fillText(`Valor: ${findRifa?.precio?.toFixed(3)}`, 117.5, 180);

  ctx.drawImage(img, 225, 90, 90, 90);


  return pdfDoc.embedPng(canvas.toDataURL("image/png"));
};

///////////////////////////////////////////////////////////////////


const { Meta } = Card;


const CardRifa: React.FC<{ rifa: any, formRifa: any }> = ({ rifa, formRifa }: any) => {

  var canvas: any, ctx: any;

  const descargarBoletos = async (boletos: any[]) => {

    pdfDoc = await PDFDocument.create();

    let widthPDF = 767.25, heightPDF = 958.5;
    let page = pdfDoc.addPage([widthPDF, heightPDF]);
    let x = 0;
    let y = widthPDF + 32/* - (159.75 * 4) */;
    let fila = 1;
    let numeroBoletos = 1;

    canvas = canvas ?? document.getElementById(rifa._id);
    ctx = ctx ?? canvas.getContext('2d');

    const boletosImages: any = [];
    for (const boleto of boletos) {

      const imagePng = await crearBoleto(
        boleto,
        canvas,
        ctx,
        rifa
      );
      boletosImages.push(imagePng);
    }

    for (const [i, boletoImage] of boletosImages.entries()) {
      const jpgDims = boletoImage.scale(0.75);

      page.drawImage(boletoImage, {
        x: x,
        y: y,
        width: jpgDims.width,
        height: jpgDims.height,
      });

      if (fila === 3) {
        x = 0;
        y -= (jpgDims.height + 0);
        fila = 1;
      } else {
        x += jpgDims.width + 0;
        fila++;
      }

      if (numeroBoletos === 18) {
        x = 0;
        y = widthPDF + 32/* - (jpgDims.height * 4) */;

        if (i < boletosImages.length - 1) {
          page = pdfDoc.addPage([widthPDF, heightPDF]);
        }

        numeroBoletos = 1;
      } else {
        numeroBoletos++;
      }
    }

    (() => {
      setloading(false);

      // rectangulo grande del color de la rifa
      ctx.fillStyle = rifa.color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // tapamos el rectangulo grande con otro
      // rectangulo de color blanco para que 
      // paresca como si fuera bordes
      ctx.fillStyle = "white";
      ctx.fillRect(15, 15, canvas.width - 30, canvas.height - 30);

      ctx.fillStyle = rifa.color;//"black";
      // Dibuja la imagen wasap y facebook
      ctx.drawImage(imgFW, 25, 25, Math.ceil(imgFW.width / 4), Math.ceil(imgFW.height / 4));

      // comensasos a dijubar los textos
      ctx.font = "bold 18px serif";
      ctx.fillText(rifa.facebook, Math.ceil(imgFW.width / 4) + 30, 42.5);
      ctx.fillText(rifa.whatsapp, Math.ceil(imgFW.width / 4) + 30, 72.5);

      ctx.fillText(rifa.fecha.split("-").join("/"), 230, 42.5);
      ctx.fillText(rifa.premio.toFixed(3), 230, 72.5);

      // dibujasmos la imagen
      ctx.drawImage(imagen, 25, 100, 80, 80);
      ctx.font = "bold 22px serif";
      ctx.fillStyle = "white";
      ctx.strokeStyle = rifa.color; // Color del borde
      ctx.lineWidth = 5; // Grosor del borde

      // numeros premiados
      ctx.strokeText("1N° 0 0 0 0", 120, 120);
      ctx.fillText("1N° 0 0 0 0", 120, 120);
      ctx.strokeText("2N° 0 0 0 0", 120, 150);
      ctx.fillText("2N° 0 0 0 0", 120, 150);
      // suerte
      ctx.fillStyle = rifa.color;//"black";
      ctx.font = "bold 18px serif";
      ctx.fillText(`Valor: ${rifa?.precio?.toFixed(3)}`, 117.5, 180);
      // qr
      ctx.fillStyle = "grey";
      ctx.fillRect(235, 100, 80, 80);
    })();

    const pdfBytes = await pdfDoc.save();

    // Crear un Blob con los datos del PDF
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

    // Crear una URL a partir del Blob
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `Rifa-${rifa.fecha}.pdf`; // Nombre del archivo que se descargará
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(pdfUrl);
    // Abrir una nueva pestaña con el PDF
    // window.open(pdfUrl);
  };

  const router = useRouter();
  const dispatch = useDispatch();

  const [listarBoletos, {
    data,
    error,
    isLoading
  }] = useListarBoletosMutation();

  React.useEffect(() => {

    (async () => {
      const responseImagen = await fetch(`${imageUrl}${rifa.imagen}.png`);
      const blobImagen = await responseImagen.blob();
      imagen = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async function (event: any) {
          const logoImagen = await imagenLoaded(event.target.result);
          resolve(logoImagen);
        };
        reader.readAsDataURL(blobImagen);
      });

      canvas = document.getElementById(rifa._id);
      ctx = canvas.getContext('2d');

      imgFW = await new Promise((resolve) => {
        const img = new Image()
        img.onload = () => { resolve(img) }
        img.onerror = err => { throw err }
        img.src = '../../fw.png';
      });

      // rectangulo grande del color de la rifa
      ctx.fillStyle = rifa.color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // tapamos el rectangulo grande con otro
      // rectangulo de color blanco para que 
      // paresca como si fuera bordes
      ctx.fillStyle = "white";
      ctx.fillRect(15, 15, canvas.width - 30, canvas.height - 30);

      ctx.fillStyle = rifa.color;//"black";
      // Dibuja la imagen wasap y facebook
      ctx.drawImage(imgFW, 25, 25, Math.ceil(imgFW.width / 4), Math.ceil(imgFW.height / 4));

      // comensasos a dijubar los textos
      ctx.font = "bold 18px serif";
      ctx.fillText(rifa.facebook, Math.ceil(imgFW.width / 4) + 30, 42.5);
      ctx.fillText(rifa.whatsapp, Math.ceil(imgFW.width / 4) + 30, 72.5);

      ctx.fillText(rifa.fecha.split("-").join("/"), 230, 42.5);
      ctx.fillText(rifa.premio.toFixed(3), 230, 72.5);

      // dibujasmos la imagen
      ctx.drawImage(imagen, 25, 100, 80, 80);
      ctx.font = "bold 22px serif";
      ctx.fillStyle = "white";
      ctx.strokeStyle = rifa.color; // Color del borde
      ctx.lineWidth = 5; // Grosor del borde

      // numeros premiados
      ctx.strokeText("1N° 0 0 0 0", 120, 120);
      ctx.fillText("1N° 0 0 0 0", 120, 120);
      ctx.strokeText("2N° 0 0 0 0", 120, 150);
      ctx.fillText("2N° 0 0 0 0", 120, 150);
      // suerte
      ctx.fillStyle = rifa.color;//"black";
      ctx.font = "bold 18px serif";
      ctx.fillText(`Valor: ${rifa?.precio?.toFixed(3)}`, 117.5, 180);
      // qr
      ctx.fillStyle = "grey";
      ctx.fillRect(235, 100, 80, 80);

    })();

  }, [rifa._id, rifa.color, rifa.imagen]);


  const [loading, setloading] = React.useState(false);

  return (
    <Card
      onClick={() => {
        router.push(`./${rifa._id}`);
      }}
      hoverable
      style={{ width: "100%" }}
      cover={<canvas id={rifa._id} height={213} width={341} style={{ borderRadius: ".5rem .5rem 0 0" }}></canvas>}
      actions={[
        <Tooltip title="Editar">
          <Button type="primary" onClick={(e) => {
            e.stopPropagation();
            dispatch(setOpenFormRifa(true));
            formRifa.resetFields();
            formRifa.setFieldsValue(rifa);
          }} shape="circle" icon={<EditOutlined />} />
        </Tooltip>,
        <Tooltip title="Descargar">
          <Button loading={loading} type="primary" onClick={async (e) => {
            e.stopPropagation();
            setloading(true);
            const { data = [] }: any = await listarBoletos({ _idRifa: rifa._id });
            dispatch(setListaDeBoletos(data));
            await descargarBoletos(data);

          }} shape="circle" icon={<CloudDownloadOutlined />} />
        </Tooltip>,
        <Tooltip title="2N° ganadores">
          <Button type="primary" onClick={async (e) => {
            e.stopPropagation();
            dispatch(setOpenFormBoleto(true));
            dispatch(setRifaDetalles(rifa));
          }} shape="circle" icon={<EyeOutlined />} />
        </Tooltip>,
      ]}
    >
      <Meta
        title={`Premio : ${rifa?.premio.toFixed(3)}`}
      />
      <Meta description={`Fecha : ${rifa?.fecha}`} />
      <Meta description={`Nombre : ${rifa?.nombre}`} />
      <Meta description={rifa?.descripcion} />
    </Card>
  )
};

export default CardRifa;