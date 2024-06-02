"use client";
import React from 'react';
import swal from 'sweetalert';
import { useDispatch, useSelector } from 'react-redux';
import { useRegistrarRifaMutation } from '@/services/userApi';
import { setIsRifa, setOpenFormRifa } from '@/features/adminSlice';
import { Button, Col, Drawer, Flex, Form, Input, InputNumber, Row, Tag, Upload } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';

var canvas: any;// = document.getElementById("canvasPerfil");
var ctx: any;// = canvas.getContext("2d");

function resizeImage(img: any, { width = 300, height = 300 }: any) {

  const sizeCanvas = width;

  let positionX = 0;
  let positionY = 0;

  const newImg = new Image();
  newImg.src = window.URL.createObjectURL(img);
  newImg.addEventListener("load", function () {
    width = canvas.width;
    height = ((this.height * width) / this.width);

    positionX = 0;
    positionY = (height < sizeCanvas) ? ((sizeCanvas - height) / 2) : 0;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(this, positionX, positionY, width, height);
    window.URL.revokeObjectURL(this.src);

  }, false);
};

const customizeRequiredMark = (label: React.ReactNode, { required }: { required: boolean }) => (
  <>
    {required ? <Tag color="error">Required</Tag> : <Tag color="warning">optional</Tag>}
    {label}
  </>
);

const uploadImageRifa = async (imagenFile: string, idRifa: string) => {
  const formData = new FormData();
  formData.append("imagen", imagenFile);
  formData.append("idRifa", idRifa);

  const response = await fetch(`https://yocreoquesipuedohacerlo.com/juegoDeRifas/uploadImageRifa`, {
    method: "post",
    body: formData
  });

  return await response.json();
}

const FormRifa: React.FC<{ formRifa: any }> = ({ formRifa }) => {

  const dispatch = useDispatch();

  const { openFormRifa, listaDeRifas } = useSelector((state: any) => state.admin);
  const [imagenRifa, setImagenRifa] = React.useState("");

  const [lastRifa] = listaDeRifas;

  const existeIdRifa = Boolean(formRifa.getFieldValue("_id"));

  const style: React.CSSProperties = { width: '100%' };
  const [registrarRifa, { data, error, isLoading }] = useRegistrarRifaMutation();

  const [fechaMinima, setFechaMinima] = React.useState('');
  React.useEffect(() => {
    setFechaMinima(new Date().toISOString().split('T')[0]);
  }, []);

  React.useEffect(() => {
    canvas = document.getElementById("canvasBoleto");
    ctx = canvas.getContext("2d");
  }, []);




  return (
    <>
      <Drawer
        title={`${existeIdRifa ? 'Actualizar' : 'Registar'} rifa`}
        width={500}
        onClose={() => dispatch(setOpenFormRifa(false))}
        open={openFormRifa}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}>
        <Form
          form={formRifa}
          name="login-form"
          layout="vertical"
          style={{ width: "100%" }}
          requiredMark={customizeRequiredMark}
          initialValues={{
            _id: "",
            nombre: "",
            imagen: "",
            fecha: new Date().toLocaleDateString().split("/").reverse().map((value: string) => value.padStart(2, "0")).join("-"),
            ganador: undefined,
            premio: undefined,
            descripcion: "",
            color: "#008080",
            whatsapp: !existeIdRifa ? lastRifa?.whatsapp : "",
            facebook: !existeIdRifa ? lastRifa?.facebook : ""
          }}
          onFinish={async (values) => {
            const inputFile: any = document.getElementById("imagenRifa");
            if (!values._id && !inputFile?.files?.length) {
              swal("", 'Seleccione Imagen', "warning");
              return;
            }

            // registramos la rifa
            const nameImagen = uuidv4();
            const { data }: any = await registrarRifa({
              ...values,
              imagen: inputFile?.files?.length ? nameImagen : values?.imagen
            });
            if (!data) {
              swal("", "Error al registrar rifa!", "error");
              return;
            }

            // cargamos la imagen mini
            if (inputFile?.files?.length) {
              await uploadImageRifa(canvas.toDataURL("image/png", 1), nameImagen);
            }
            if (error) {
              swal("", `El número ${values.ganador} no es válido!`, "error");
              return;
            }
            dispatch(setIsRifa(true));
            dispatch(setOpenFormRifa(false));
            setTimeout(() => { dispatch(setIsRifa(false)) }, 50);
            formRifa.resetFields();
            swal("", `Rifa ${existeIdRifa ? 'actualizada' : 'registrada'}!`, "success");
          }} >
          <Row gutter={16}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Form.Item
                name="_id"
                label="_id"
                style={{ display: "none" }}
              >
                <Input placeholder="_id" />
              </Form.Item>
              <Form.Item
                name="imagen"
                label="imagen"
                style={{ display: "none" }}
              >
                <Input placeholder="imagen" />
              </Form.Item>
              <Form.Item
                name="nombre"
                label="Nombre"
                rules={[{ required: true, message: 'Por favor, ingrese nombre' }]}
              >
                <Input placeholder="Nombre" />
              </Form.Item>

            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Form.Item
                name="fecha"
                label="Fecha"
                rules={[{ required: true, message: 'Por favor, ingrese fecha' }]}
              >
                <Input type='date' placeholder="Fecha" min={fechaMinima} style={style} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="ganador"
                label="1N° ganador"
                rules={[
                  { required: true, message: 'Por favor, ingrese 1N° ganador' },
                  {
                    validator: (_, value) => {
                      if (value && value.toString().length == 4 && new RegExp("[0-9]{4}").test(value)) return Promise.resolve(true);
                      return Promise.reject("1N° ganador, debe tener 4 digitos");
                    }
                  }
                ]}
              >
                <Input placeholder="1N° ganador" style={style} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="premio"
                label="Premio"
              >
                <InputNumber placeholder="Premio" style={style} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>

            <Col span={12}>
              <Form.Item name="whatsapp" label="Whatsapp">
                <Input placeholder="Whatsapp" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="facebook"
                label="Facebook"
              >
                <Input placeholder="Facebook" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>

            <Col span={12}>
              <Form.Item name="color" label="Color del ticket">
                <Input type='color' placeholder="1N° ganador" style={style} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="precio"
                label="Precio Boleto"
                rules={[{ required: true, message: 'Por favor, ingrese precio' }]}
              >
                <InputNumber placeholder="Precio " style={style} />
              </Form.Item>
            </Col>

          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="descripcion"
                label="Descripción"
              >
                <Input.TextArea rows={1} placeholder="Descripción" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <input id='imagenRifa' accept="image/*" style={{ display: "none" }} type='file' onChange={() => {
                const inputFile: any = document.getElementById("imagenRifa");
                if (inputFile?.files?.length) {
                  const maxSize = 0.5 * 1024 * 1024; // 0.5 MB en bytes
                  if (inputFile?.files[0]?.size > maxSize) {
                    swal("", `El archivo ${inputFile?.files[0]?.name} excede el tamaño máximo permitido de 0.5 MB.`, "warning");
                    return;
                  }
                  if (!canvas) {
                    canvas = document.getElementById("canvasBoleto");
                  }
                  if (ctx) {
                    ctx = canvas.getContext("2d");
                  }
                  resizeImage(inputFile?.files[0], {});
                  setImagenRifa(inputFile?.files[0]?.name);
                } else {
                  setImagenRifa("");
                }
              }}></input>

              <Flex vertical gap="small" style={{ width: '100%' }}>
                <Button type="dashed" onClick={() => {
                  document.getElementById("imagenRifa")?.click();
                }}>Seleccione Imagen</Button>
              </Flex>


            </Col>

            <Col span={12}>
              {Boolean(imagenRifa) && <Tag closeIcon color="green"
                onClose={() => {
                  (document.getElementById("imagenRifa") as HTMLInputElement).value = "";
                  setImagenRifa("");
                }}
                style={{
                  width: "100%",
                  height: "31px",
                  lineHeight: "27.5px",
                  textAlign: "center",
                }}>
                {imagenRifa}
              </Tag>}
            </Col>


          </Row>


          <Row gutter={16} style={{ marginTop: "1rem" }}>
            <Col span={24}>
              <Flex vertical gap="small" style={{ width: '50%', margin: "auto" }}>
                <Button loading={isLoading} type="primary" block htmlType="submit">
                  {existeIdRifa ? 'Actualizar' : 'Registar'}
                </Button>
              </Flex>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};

export default FormRifa;