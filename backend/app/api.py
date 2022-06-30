import csv
import glob
import os
import io
from typing import List
import torch
import torch.nn.functional as F
import PIL.Image as Image
import pandas as pd
from model import Model
from torchvision import transforms

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse

app = FastAPI()

# origins = [
#     "http://localhost:3000",
#     "localhost:3000"
# ]
#
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"]
# )

dir = './app'


# @app.post("/upload")
# async def upload(files: List[UploadFile] = File(...)):
#     dir = './app/data/'
#     filelist = glob.glob(os.path.join(dir, "*"))
#     for f in filelist:
#         os.remove(f)
#     i = 0
#     for file in files:
#         try:
#             contents = await file.read()
#             with open(os.path.join(dir, str(i)+'.' + file.filename.split('.')[-1]), 'wb') as f:
#                 f.write(contents)
#                 i += 1
#         except Exception:
#             return {"message": "There was an error uploading the file(s)"}
#         finally:
#             await file.close()
#
#     return {"message": f"Successfuly uploaded {[file.filename for file in files]}"}

@app.get("/result")
async def result():
    model = Model()
    print(os.getcwd())
    model.load_state_dict(torch.load(os.path.join(dir,'./mnist_net.pth')))
    filelist = glob.glob(os.path.join(dir,'./data/*'))
    trans = transforms.Compose([transforms.ToTensor()])
    ret = []
    i = 0
    for file in filelist:
        _, name = os.path.split(file)
        file = trans(Image.open(file))
        file = file.unsqueeze(0)
        print(file.shape)
        outputs = model(file)
        outputs = F.softmax(outputs, dim=1)
        top_p, top_class = outputs.topk(5, dim=1)
        top_class = top_class[0]
        top_p = top_p[0]
        print(top_class)
        print(top_p)
        dict = {}
        dict['key'] = str(i)
        dict['dir'] = 'api/getImage/'+name
        dict['name'] = name
        dict['pred1'] = str(top_class[0].item())
        dict['pred2'] = str(top_class[1].item())
        dict['pred3'] = str(top_class[2].item())
        dict['confi1'] = str(round(top_p[0].item(), 4))
        dict['confi2'] = str(round(top_p[1].item(), 4))
        dict['confi3'] = str(round(top_p[2].item(), 4))
        ret.append(dict)
        i += 1
#     csv_columns = ['key', 'name', 'pred1', 'confi1', 'pred2', 'confi2', 'pred3', 'confi3']
#     try:
#         print(os.getcwd())
#         with open('./app/out/result.csv', 'w+') as f:
#             writer = csv.DictWriter(f, fieldnames=csv_columns)
#             writer.writeheader()
#             for data in ret:
#                 temp = data
#                 del temp['dir']
#                 writer.writerow(temp)
#     except IOError:
#         print("I/O error")
    return ret


# @app.get("/download_result")
# async def download_result():
#     # df = pd.read_csv('D:/mib_lab/backend/app/out/result.csv')
#     # out = io.BytesIO()
#     # with pd.CSVWriter(out) as writer:
#     #     df.to_csv(writer)
#     #
#     # response = StreamingResponse(iter([out.getvalue()]),
#     #                              media_type="text/csv"
#     #                              )
#     # response.headers["Content-Disposition"] = "attachment; filename=result.csv"
#     # return response
#     file_path = os.path.join(dir, 'out/result.csv')
#     if os.path.exists(file_path):
#         return FileResponse(path='./app/out/result.csv', filename='result.csv', media_type="text/csv")
#     return {'error': "File not found!"}

@app.get("/clear")
async def clear():
    filelist = glob.glob(os.path.join(dir, "data/*"))
    for f in filelist:
        os.remove(f)
    return 'success'

@app.get('/getImage/{name}')
async def getImage(name: str):
    return FileResponse(path=os.path.join(dir, 'data/'+name))

@app.post("/upload")
async def upload(file: UploadFile = File()):
    # filelist = glob.glob(os.path.join(dir, "*"))
    # for f in filelist:
    #     os.remove(f)
    try:
        contents = await file.read()
        with open(os.path.join(dir, 'data/'+file.filename), 'wb') as f:
            f.write(contents)
    except Exception:
        return {"message": "There was an error uploading the file(s)"}
    finally:
        await file.close()

    return {"message": f"Successfuly uploaded {file.filename}", "status":"success"}
