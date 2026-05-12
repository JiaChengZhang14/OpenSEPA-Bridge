# OpenSEPA-Bridge — Setup del Frontend

## Estructura final del proyecto

```
OpenSEPA-Bridge/
├── backend/
│   ├── main.py                  ← Actualizar con CORS (ver abajo)
│   ├── requirements.txt
│   └── services/
│       └── ai_service.py
└── frontend/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx             ← Página principal
    │   └── globals.css
    ├── components/
    │   ├── DropZone.tsx         ← Input drag & drop
    │   ├── StatusLog.tsx        ← Log de proceso en tiempo real
    │   └── MappingTable.tsx     ← Tabla de mapeo de Llama3
    ├── lib/
    │   └── api.ts               ← Cliente del backend
    ├── next.config.js           ← Proxy a localhost:8000
    ├── tailwind.config.ts
    ├── tsconfig.json
    └── package.json
```

---

## 1. Actualizar el backend con CORS

Sustituye el contenido de `backend/main.py` por el de `backend_main_updated.py`
que está en esta carpeta. El único cambio real es añadir:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 2. Instalar y arrancar el backend

```bash
cd backend
# Activar entorno virtual (Windows)
.\venv\Scripts\Activate.ps1
# o en Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
# → disponible en http://localhost:8000
```

---

## 3. Instalar y arrancar el frontend

```bash
cd frontend
npm install
npm run dev
# → disponible en http://localhost:3000
```

---

## 4. Cómo funciona la conexión

El `next.config.js` incluye un rewrite que hace de proxy:

```
Frontend (localhost:3000)
  → llama a /api/backend/debug-excel
  → Next.js lo redirige a http://localhost:8000/debug-excel
```

Esto evita problemas de CORS en el navegador y no expone
directamente la URL del backend.

---

## 5. Flujo actual de la app

```
Usuario sube Excel
  → POST /api/backend/debug-excel
  → Llama3 mapea columnas
  → Se muestra la tabla de mapeo
  → [Botón "Convertir a XML"] ← pendiente del endpoint /convert
```

El botón de conversión final llamará a `POST /api/backend/convert`
cuando implementes el `xml_builder.py` en el backend.

---

## 6. Próximo paso — endpoint /convert

Cuando tengas el formato del Excel de finanzas, el flujo a implementar es:

```python
# backend/services/xml_builder.py
def build_pain001(datos: list[dict], ordenante: dict) -> str:
    """
    Construye un XML pain.001.001.03 a partir de los datos mapeados.
    Retorna el XML como string.
    """
    ...

# backend/main.py
from fastapi.responses import Response

@app.post("/convert")
async def convert(file: UploadFile = File(...)):
    # 1. Leer Excel
    # 2. Mapear con Ollama (ya tienes esto)
    # 3. Construir XML con xml_builder
    # 4. Validar contra XSD de ISO 20022
    # 5. Devolver como descarga
    return Response(
        content=xml_string,
        media_type="application/xml",
        headers={"Content-Disposition": f"attachment; filename=remesa.xml"}
    )
```
