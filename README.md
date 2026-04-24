# 🌉 OpenSEPA-Bridge

**OpenSEPA-Bridge** es una herramienta de automatización financiera diseñada para convertir archivos Excel heterogéneos en datos estandarizados listos para la normativa bancaria SEPA.

El proyecto utiliza una arquitectura moderna que combina la potencia de FastAPI, la velocidad de Pandas para el procesamiento de datos y la inteligencia de Llama3 (vía Ollama) para el mapeo inteligente de columnas.

---

## 🚀 Características

* **Mapeo Inteligente con IA**
  Utiliza modelos de lenguaje locales (Llama3) para identificar y clasificar columnas bancarias incluso si el Excel no tiene cabeceras.

* **Procesamiento de Alta Velocidad**
  Una vez que la IA define el mapa de datos, Pandas procesa miles de filas en milisegundos.

* **Entorno Local y Seguro**
  La IA se ejecuta localmente mediante Ollama, garantizando que los datos bancarios sensibles nunca salgan de tu infraestructura.

* **API Documentada**
  Documentación automática disponible con Swagger UI.

---

## 🛠️ Stack Tecnológico

* **Backend:** Python 3.11+
* **Framework Web:** FastAPI
* **Procesamiento de Datos:** Pandas, Openpyxl, Xlrd
* **IA Local:** Ollama (Llama3)
* **Servidor ASGI:** Uvicorn

---

## 📋 Requisitos Previos

* Python 3.11 o superior instalado
* Ollama instalado y ejecutándose en segundo plano

Descargar el modelo Llama3:

```bash
ollama pull llama3
```

---

## 🔧 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/JiaChengZhang14/OpenSEPA-Bridge
cd OpenSEPA-Bridge/backend
```

### 2. Crear y activar el entorno virtual

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

---

## 🚀 Ejecución

Para iniciar el servidor de desarrollo:

```bash
uvicorn main:app --reload
```

El servidor estará disponible en:

* API: http://127.0.0.1:8000
* Documentación interactiva: http://127.0.0.1:8000/docs

---

## 📁 Estructura del Proyecto

```plaintext
backend/
├── main.py              # Punto de entrada de la API y lógica de Pandas
├── requirements.txt     # Dependencias del proyecto
├── services/
│   ├── __init__.py
│   └── ai_service.py    # Integración con Ollama y lógica de prompts
└── venv/                # Entorno virtual
```

---

## 🤖 Funcionamiento del Mapeo

El sistema sigue un proceso de tres pasos:

1. **Lectura**
   Se carga el Excel y se extraen las dos primeras filas como muestra.

2. **Inferencia**
   Se envía la muestra a Llama3 con un prompt especializado para identificar qué columna corresponde a campos como IBAN, NIF, Importe, etc.

3. **Transformación**
   Con el mapa obtenido, Pandas reestructura el DataFrame completo, normaliza los datos y devuelve un JSON estandarizado.

---

