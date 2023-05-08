import firebase_admin
import datetime
from firebase_admin import credentials
from firebase_admin import firestore
cred = credentials.Certificate("kyfirdb.json")
firebase_admin.initialize_app(cred)

db= firestore.client()

plate_num = str(input('numero de placa:'))
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
    #INGRESO
    if estado_check.lower() == estado_in.lower():
        estado = temp["estado"]
        clase = temp["clase"]
        hora_salida = temp["hora_salida"]
        dess = temp["descripcion"]
        plac = temp["placa"]
        #ACTUALIZAR FECHA DE SALIDA Y ESTATUS
        update = db.collection(u'placas').document(u'{}'.format(plac))
        update.update({u'estado': u'Salio', u'hora_salida': datetime.datetime.now(tz=datetime.timezone.utc)})
        data = {
            u'fecha_hora': datetime.datetime.now(tz=datetime.timezone.utc),
            u'clase': u'{}'.format(clase),
            u'descripcion': u'{}'.format(dess),
            u'estado': u'Salio',
            u'placa': u'{}'.format(plac)
        }
        print(data)
        db.collection(u'registro').add(data)
    #SALIO
    if estado_check.lower() == estado_old.lower():
        estado = temp["estado"]
        clase = temp["clase"]
        hora_salida = temp["hora_salida"]
        dess = temp["descripcion"]
        plac = temp["placa"]
        #ACTUALIZAR ADMISSION Y ESTATUS
        update = db.collection(u'placas').document(u'{}'.format(plac))
        update.update({u'estado': u'Ingreso', u'admission': datetime.datetime.now(tz=datetime.timezone.utc)})
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