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
    try:
        # 1. Leer el Excel completo
        contents = await file.read()
        df_original = pd.read_excel(io.BytesIO(contents))
        df_original = df_original.fillna("")

        # 2. Preparar muestra para la IA (Solo las primeras 2 filas)
        muestra = df_original.head(2).to_dict(orient="records")

        # 3. Obtener el mapa de columnas desde Llama3
        print("🤖 Consultando a Llama3 para obtener el mapeo...")
        mapeo = map_columns_ai(muestra)

        if not mapeo:
            raise HTTPException(status_code=500, detail="La IA no pudo generar un mapeo válido.")

        # 4. Reestructurar datos con Pandas (Instantáneo)
        campos_sepa = [
            "Recibo Nº", "Beneficiario", "Nombre Beneficiario", 
            "Nif", "IBAN Beneficiario", "Vencimiento", "Importe"
        ]
        
        df_final = pd.DataFrame()

        for campo in campos_sepa:
            columna_excel = mapeo.get(campo)
            if columna_excel and columna_excel in df_original.columns:
                df_final[campo] = df_original[columna_excel]
            else:
                # Si no existe, creamos la columna vacía
                df_final[campo] = ""

        # 5. Convertir a lista de diccionarios para la respuesta
        datos_estandarizados = df_final.to_dict(orient="records")

        return {
            "archivo": file.filename,
            "mapeo_utilizado": mapeo,
            "total_filas": len(datos_estandarizados),
            "datos": datos_estandarizados # Devuelve el Excel ya "traducido"
        }

    except Exception as e:
        print(f"Error crítico: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    