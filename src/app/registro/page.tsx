"use client";
import React from 'react';
import { Button, Col, QRCode, Row } from 'antd';
import swal from 'sweetalert';
var ObjectID = require("bson-objectid");
const QRCodeR = require('qrcode');

const downloadQRCode = () => {
  const canvas = document.getElementById('myqrcode')?.querySelector<HTMLCanvasElement>('canvas');
  if (canvas) {
    const url = canvas.toDataURL();
    const a = document.createElement('a');
    a.download = 'QRCode.png';
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

const App: React.FC = () => {

  const [codigos, setCodigos] = React.useState<any>([]);
  const audioRefGana = React.useRef<any>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  return (
    <Row>
      <Col xs={24} sm={3} md={6} lg={4}>

        <video ref={audioRefGana} style={{ width: "100%" }}>
          <source src="../premio5000-u0qqqvsd-jqbuimxn_hX874pD5.mp4" type="video/mp4" />
          <source src="../premio5000-u0qqqvsd-jqbuimxn_hX874pD5.webm" type="video/webm" />
          <source src="../premio5000-u0qqqvsd-jqbuimxn_hX874pD5.ogg" type="video/ogg" />
        </video>



        <div id="myqrcode">
          <QRCode size={200}
            errorLevel="H"
            value="https://ant.design/"
            bgColor="#fff"
            style={{ marginBottom: 16 }} />
          <Button type="primary" onClick={() => {
            if (isPlaying) {
              audioRefGana.current.pause();
            } else {
              audioRefGana.current.play();
            }
          }}>
            Download
          </Button>
        </div>
      </Col>
      <Col xs={24} sm={3} md={6} lg={20}>
        <Button type="primary" onClick={() => {
          const _ids = [];
          for (let index = 0; index < 10; index++) {
            _ids.push(ObjectID());
          }
          const codes: any = [];
          for (const _id of _ids) {
            codes.push(_id.toString());
          }
          setCodigos(codes);

        }}>
          Generar códigos
        </Button>

        <Button type="primary" onClick={async () => {
          const formData = new FormData();
          formData.append("codigos", JSON.stringify(codigos));

          const response = await fetch("https://rifas.desohali.com/registrarTickets", {
            method: "post",
            body: formData
          });
          const json = await response.json();
          swal("", "Se registro correctamente!", "success");

        }}>
          Guardar códigos
        </Button>
        <Row>

          {codigos.map((code: any) => (
            <Col xs={12} sm={8} md={6} lg={4}>
              <QRCode size={160}
                errorLevel="H"
                value={`${location.origin}/juego/${code}`}
                bgColor="#fff"
                style={{ marginBottom: 16 }} />
            </Col>
          ))}
        </Row>


      </Col>

    </Row>
  )

};

export default App;