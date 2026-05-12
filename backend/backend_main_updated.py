from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
from services.ai_service import map_columns_ai


app = FastAPI(
    title="OpenSEPA Bridge API",
    description="Middleware para conversión de remesas bancarias",
    version="0.1.0"
)

# ─── CORS ────────────────────────────────────────────────────────────────────
# Permite peticiones desde el frontend Next.js en desarrollo (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Root ────────────────────────────────────────────────────────────────────
@app.get("/")
async def root():
    return {
        "message": "Bienvenido a OpenSEPA Bridge API",
        "version": "0.1.0"
    }


# ─── Debug Excel ─────────────────────────────────────────────────────────────
@app.post("/debug-excel")
async def debug_excel(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        df_original = pd.read_excel(io.BytesIO(contents))
        df_original = df_original.fillna("")

        muestra = df_original.head(2).to_dict(orient="records")

        print("🤖 Consultando a Llama3 para obtener el mapeo...")
        mapeo = map_columns_ai(muestra)

        if not mapeo:
            raise HTTPException(status_code=500, detail="La IA no pudo generar un mapeo válido.")

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
                df_final[campo] = ""

        datos_estandarizados = df_final.to_dict(orient="records")

        return {
            "mapeo_utilizado": mapeo,
            "total_filas": len(datos_estandarizados),
            "datos": datos_estandarizados
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error crítico: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ─── Convert (TODO: implementar XML builder) ──────────────────────────────────
# @app.post("/convert")
# async def convert(file: UploadFile = File(...)):
#     """
#     Endpoint final que devolverá el XML pain.001.001.03 listo para Bankinter.
#     Pendiente de implementar xml_builder.py con la lógica de construcción del XML.
#     """
#     pass
