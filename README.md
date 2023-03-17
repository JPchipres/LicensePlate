# LicensePlate
You need:
```
-Descargar anaconda
https://www.anaconda.com/
--Configurar en el IDE el entorno virtual de anaconda, por default se tiene el de python.
-Install anaconda
conda install anaconda
-Crear el entorno(conda)
conda create -n LicensePlate python==3.8
-Activar entorno
conda activate LicensePlate
-Clonar este repositorio
git clone https://github.com/JPchipres/LicensePlate.git
-Instalar requerimientos/paquetes
pip install -r requirements.txt #Indica la ruta donde se encuentra el txt
-Instalar numpy 1.21
pip install numpy==1.21
-Iniciar deteccion y webcam, asi como ventana para visualizar la deteccion de placas
python yolov5/detect.py --weights yolov5/runs/train/exp/weights/best.pt --source 0
```
