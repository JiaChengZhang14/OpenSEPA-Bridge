from fastapi import FastAPI, UploadFile, File, HTTPException
import pandas as pd
import io
from services.ai_service import map_columns_ai


app = FastAPI(
    title="OpenSEPA Bridge API",
    description="Middleware para conversión de remesas bancarias",
    version="0.1.0"
)


#root
@app.get("/")
async def root():
    return {
        "message":"Bienvenido a OpenSEPA Bridge API",
        "version":"0.1.0"
    }
    
    
    
#ruta para debuguear el excel

@app.post("/debug-excel")
async def debug_excel(file: UploadFile = File(...)):
    # ... (tu código anterior de lectura de excel y fillna) ...
    
    try:
        contents = await file.read()
        dataframe = pd.read_excel(io.BytesIO(contents))
        dataframe = dataframe.fillna("")
        columnas = dataframe.columns.tolist()
        
        # Tomamos una muestra de las primeras 3 filas para que la IA tenga contexto
        maped_data = dataframe.head(3).to_dict(orient="records")

        print("🤖 Consultando a Llama3 con muestras de datos...")
        # Le pasamos tanto las columnas como los datos reales
        mapeo_final = map_columns_ai(maped_data[:10]) 

        return {
            "datos_procesados_por_ia": mapeo_final
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    