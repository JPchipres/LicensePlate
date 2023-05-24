import torch
import cv2

import numpy as np
import easyocr
import datetime
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
cred = credentials.Certificate("kyfirdb.json")
firebase_admin.initialize_app(cred)

db= firestore.client()

#from firebase import firebase

EASY_OCR = easyocr.Reader(['es'])  #inicializar el ocr en formato Español
OCR_TH = 0.2


def detectx(frame, model):
    frame = [frame]
    print(f"Detectando... ")
    results = model(frame)
    # results.show()
    # print( results.xyxyn[0])
    # print(results.xyxyn[0][:, -1])
    # print(results.xyxyn[0][:, :-1])
    labels, cordinates = results.xyxyn[0][:, -1], results.xyxyn[0][:, :-1]
    return labels, cordinates


def plot_boxes(results, frame, classes):
    """
        --> Esta function toma los resultados, frame y clases
    --> Los resultados contienen labels y coordenadas de la prediccion de el modelo obtenidos de cada frame
    --> Las clases contienen los labels de la cadena
    """
    labels, cord = results
    n = len(labels)
    x_shape, y_shape = frame.shape[1], frame.shape[0] #The shape property is usually used to get the current shape of an array

    print(f"Total {n} detecciones. . . ")
    print(f"Loop de las detecciones. . . ")

    ### looping
    for i in range(n):
        row = cord[i]
        if row[4] >= 0.55:  # valor umbral para la detección. Estamos descartando todo por debajo de este valor
            print(f"Extrayendo las coordenadas de los cuadros. . . ")
            x1, y1, x2, y2 = int(row[0] * x_shape), int(row[1] * y_shape), int(row[2] * x_shape), int(
                row[3] * y_shape)  #Coordenadas
            text_d = classes[int(labels[i])]
            # cv2.imwrite("./output/dp.jpg",frame[int(y1):int(y2), int(x1):int(x2)])

            coords = [x1, y1, x2, y2]

            plate_num = recognize_plate_easyocr(img=frame, coords=coords, reader=EASY_OCR, region_threshold=OCR_TH)
            temp = ''
            estado_in = 'Ingreso'
            estado_old = 'Salio'
            searchs = db.collection('placas').where("placa", "==", plate_num).get()
            for search in searchs:
                temp = search.to_dict()

            if temp != '':
                print("PLACA EXISTE")
                estado = temp["estado"]
                estado_check = str(estado)
                # INGRESO
                if estado_check.lower() == estado_in.lower():
                    estado = temp["estado"]
                    clase = temp["clase"]
                    hora_salida = temp["hora_salida"]
                    dess = temp["descripcion"]
                    plac = temp["placa"]
                    # ACTUALIZAR FECHA DE SALIDA Y ESTATUS
                    update = db.collection(u'placas').document(u'{}'.format(plac))
                    update.update(
                        {u'estado': u'Salio', u'hora_salida': datetime.datetime.now(tz=datetime.timezone.utc)})
                    data = {
                        u'fecha_hora': datetime.datetime.now(tz=datetime.timezone.utc),
                        u'clase': u'{}'.format(clase),
                        u'descripcion': u'{}'.format(dess),
                        u'estado': u'Salio',
                        u'placa': u'{}'.format(plac)
                    }
                    print(data)
                    db.collection(u'registro').add(data)
                # SALIO
                if estado_check.lower() == estado_old.lower():
                    estado = temp["estado"]
                    clase = temp["clase"]
                    hora_salida = temp["hora_salida"]
                    dess = temp["descripcion"]
                    plac = temp["placa"]
                    # ACTUALIZAR ADMISSION Y ESTATUS
                    update = db.collection(u'placas').document(u'{}'.format(plac))
                    update.update(
                        {u'estado': u'Ingreso', u'admission': datetime.datetime.now(tz=datetime.timezone.utc)})
                    data = {
                        u'fecha_hora': datetime.datetime.now(tz=datetime.timezone.utc),
                        u'clase': u'{}'.format(clase),
                        u'descripcion': u'{}'.format(dess),
                        u'estado': u'Ingreso',
                        u'placa': u'{}'.format(plac)
                    }
                    print(data)
                    db.collection(u'registro').add(data)
            else:
                estado = "PLACA NO EXISTE"
                print("PLACA NO EXISTE")

            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)  ## box
            cv2.rectangle(frame, (x1, y1 - 20), (x2, y1), (0, 255, 0), -1)  ## Fondo para el texto
            cv2.putText(frame, f"{plate_num} | {estado}", (x1, y1), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2) #texto placa

            # cv2.imwrite("data/images/train/Cars24",frame[int(y1)-25:int(y2)+25, int(x1)-25:int(x2)+25])

    return frame



#FUNCION PARA OBTENER LOS DIGITOS DE LA PLACA
def recognize_plate_easyocr(img, coords, reader, region_threshold):
    # Separamos las cordenadas de la box
    xmin, ymin, xmax, ymax = coords
    # Obtenemos la subimagen que compone la región limitada y tomamos 5 pixeles mas en cada lado
    # nplate = img[int(ymin)-5:int(ymax)+5, int(xmin)-5:int(xmax)+5]
    nplate = img[int(ymin):int(ymax), int(xmin):int(xmax)]  ### Recortamos solo la placa de toda la imagen
    ocr_result = reader.readtext(nplate) #Funcion para obtener el texto de la imagen

    text = filter_text(region=nplate, ocr_result=ocr_result, region_threshold=region_threshold) #filtrar texto

    if len(text) == 1:
        text = text[0].upper()
    return text


### FUNCION PARA FILTRAR ERRORES EN EL TEXTO

def filter_text(region, ocr_result, region_threshold):
    rectangle_size = region.shape[0] * region.shape[1]

    plate = []
    print(ocr_result)
    for result in ocr_result:
        length = np.sum(np.subtract(result[0][1], result[0][0]))
        height = np.sum(np.subtract(result[0][2], result[0][1]))

        if length * height / rectangle_size > region_threshold:
            plate.append(result[1])
    return plate


def main(img_path=None, vid_path=None, vid_out=None):
    print(f"Cargando modelo... ")
    ## Cargando el modelo entrenado
    # model =  torch.hub.load('ultralytics/yolov5', 'custom', path='last.pt',force_reload=True) ## if you want to download the git repo and then run the detection
    model = torch.hub.load('yolov5', 'custom', source='local', path='yolov5/runs/train/exp/weights/best.pt',
                           force_reload=True)

    classes = model.names  ### Nombre de las clases en string

    ### --------------- IMAGENES --------------------
    if img_path != None:
        print(f"[INFO] Working with image: {img_path}")
        img_out_name = f"./output/result_{img_path.split('/')[-1]}"

        frame = cv2.imread(img_path)  #Cargar imagen
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results = detectx(frame, model=model)  ### Deteccion

        frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)

        frame = plot_boxes(results, frame, classes=classes)

        cv2.namedWindow("img_only", cv2.WINDOW_NORMAL)  ## Mostrar resultado en ventana de windows

        while True:
            # frame = cv2.cvtColor(frame,cv2.COLOR_RGB2BGR)

            cv2.imshow("img_only", frame)

            if cv2.waitKey(5) & 0xFF == ord('q'):
                print(f"Saliendo. . . ")

                cv2.imwrite(f"{img_out_name}", frame)  ## Si queremos guardar el resultado.

                break

    ### --------------- VIDEO --------------------
    elif vid_path != None:
        print(f"[INFO] Video: {vid_path}")

        ## cargar video
        cap = cv2.VideoCapture(vid_path)

        if vid_out:

            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            fps = int(cap.get(cv2.CAP_PROP_FPS))
            codec = cv2.VideoWriter_fourcc(*'mp4v')  ##(*'XVID')
            out = cv2.VideoWriter(vid_out, codec, fps, (width, height))

        # assert cap.isOpened()
        frame_no = 1

        cv2.namedWindow("vid_out", cv2.WINDOW_NORMAL)
        while True:
            ret, frame = cap.read()
            if ret and frame_no % 1 == 0:
                print(f"[INFO] Frame numero: {frame_no} ")

                frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                results = detectx(frame, model=model)
                frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)

                frame = plot_boxes(results, frame, classes=classes)

                cv2.imshow("vid_out", frame)
                if vid_out:
                    print(f"Creando video. . . ")
                    out.write(frame)

                if cv2.waitKey(5) & 0xFF == ord('q'):
                    break
                frame_no += 1

        print(f"....")
        out.release()

        cv2.destroyAllWindows()



#main(vid_path="prueba.mp4",vid_out="vid_1.mp4") ### VIDEOS
main(vid_path=0) #### CAMARA
#main(img_path="data/images/train/Cars25.png")  ## IMAGEN