
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
cred = credentials.Certificate("kyfirdb.json")
firebase_admin.initialize_app(cred)

db= firestore.client()

#.where("campo", "condicional", "objetivo")
temp = ''
searchs = db.collection('placas').where("placa", "==", "AAA-00-00").get()
for search in searchs:
    temp = search.to_dict()
    print(temp)


if temp != '':
    print(temp["placa"])
else:
    print("no existe")








