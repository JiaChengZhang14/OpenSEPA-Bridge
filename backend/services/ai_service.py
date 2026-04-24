import time

import ollama
import json
import re

def map_columns_ai(muestra_datos):
    """
    Analiza una muestra de datos y devuelve un diccionario de mapeo.
    """
    prompt = f"""
    Eres un experto en normativa bancaria SEPA. 
    Analiza estos datos de ejemplo de un Excel (primeras filas):
    {muestra_datos}

    Tu tarea es identificar qué columna del Excel corresponde a cada uno de estos 7 campos:
    1. Recibo Nº (Es el número del recibo/factura)
    2. Beneficiario (Codigo del beneficiario, no se refiere al nombre)
    3. Nombre Beneficiario (Nombre de la persona o entidad beneficiaria)
    4. Nif (Número de Identificación Fiscal de la entidad beneficiaria)
    5. IBAN Beneficiario (Numero de IBAN de la entidad beneficiaria)
    6. Vencimiento (Fecha de vencimiento de pago)
    7. Importe (Importe del pago)

    TEN EN CUENTA: 
    - Una columna del excel, no puede pertenecer a dos campos de los anteriormente mencionados. Debe ser EXCLUSIVAMENTE una columna por campo. Si ya se ha asignado una columna a un campo, esta no puede repetirse en otro campo. 
    - Puede haber columnas que no pertenezcan a ninguno de los campos que requiero, puedes ignorar esas columnas. 

    Responde EXCLUSIVAMENTE con un JSON donde la clave es mi campo y el valor es el nombre de la columna original del Excel. Si no existe, usa null.
    Ejemplo: {{"Recibo Nº": "Factura_ID", "Importe": "Total", ...}}
    """

    try:
        
        print("Procesando datos...")
        
        #INICIO UN TIMER 
        init = time.perf_counter()
        
        response = ollama.chat(model='llama3', messages=[
            {'role': 'user', 'content': prompt},
        ])
        
        end = time.perf_counter()
        print(f"⏱️ Llama3 ha tardado {end-init:.2f} segundos en responder.")
        
        texto_ia = response['message']['content']
        # Limpieza para extraer solo el JSON
        match = re.search(r'\{.*\}', texto_ia, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        return None
    except Exception as e:
        print(f"Error en IA: {e}")
        return None