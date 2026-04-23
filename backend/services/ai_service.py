import ollama
import json
import re

def map_columns_ai(datos_excel_completos):
    prompt = f"""
    Eres un procesador de datos bancarios SEPA ultra preciso.
    Tu objetivo es transformar una lista de registros desordenados en una lista estandarizada.

    DATOS DE ENTRADA (JSON):
    {datos_excel_completos}

    CAMPOS DE DESTINO OBLIGATORIOS:
    1. "Recibo Nº"
    2. "Beneficiario" (Usa el nombre o código interno si existe)
    3. "Nombre Beneficiario" (Nombre completo/Razón social)
    4. "Nif" (Busca identificadores fiscales)
    5. "IBAN Beneficiario" (Busca cuentas bancarias)
    6. "Vencimiento" (Usa fechas de pago o requerimiento)
    7. "Importe" (Usa cantidades numéricas)

    TAREA:
    - Recorre cada registro de los datos de entrada.
    - Mapea el contenido a los 7 campos de destino.
    - Si un dato no existe para un campo, usa null.
    - Limpia los nombres: quita símbolos raros en "Nombre Beneficiario".
    - Asegúrate de que el "Importe" sea solo el número.

    RESPUESTA:
    Devuelve exclusivamente una lista de objetos JSON [{{...}}, {{...}}] con los 7 campos mencionados. No expliques nada.
    """

    try:
        response = ollama.chat(model='llama3', messages=[
            {'role': 'user', 'content': prompt},
        ])
        
        texto_ia = response['message']['content']
        # Extraemos la lista JSON del texto de la IA
        match = re.search(r'\[.*\]', texto_ia, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        return {"error": "Formato de lista no detectado"}
    except Exception as e:
        return {"error": str(e)}