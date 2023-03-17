
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
cred = credentials.Certificate("kyfirdb.json")
firebase_admin.initialize_app(cred)

db= firestore.client()

#.where("campo", "condicional", "objetivo")
temp = ''
searchs = db.collection('placas').where("num_plate", "==", "NJC-37-0").get()
for search in searchs:
    temp = search.to_dict()

if temp != '':
    print(temp["num_plate"])
else:
    print("no existe")








