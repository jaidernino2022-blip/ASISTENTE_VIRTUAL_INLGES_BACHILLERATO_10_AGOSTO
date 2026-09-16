# Documentación del Método "Tools" en la Integración con Gemini Live

Este documento explica cómo está implementado el uso de "Tools" (herramientas o function calling) dentro del proyecto, específicamente en la conexión con la API de Gemini Live.

## 1. Declaración de la Herramienta en la Configuración

En el archivo `hooks/useGeminiLive.ts`, cuando se inicializa la conexión con Gemini (`ai.live.connect`), se le pasa un objeto de configuración que incluye la propiedad `tools`.

```typescript
const geminiConfig: any = {
  model: "gemini-3.1-flash-live-preview",
  tools: [
    { searchWeb: {} }, // Herramienta predeterminada para búsqueda en la web
    {
      functionDeclarations: [
        {
          name: "consultar_planificacion",
          description: "Busca y devuelve el texto de una planificación curricular de inglés. Úsalo siempre que el estudiante te pregunte sobre temas de clase o planificaciones.",
          parameters: {
            type: "OBJECT",
            properties: {
              curso: { type: "STRING", description: "Ej: '8vo', '9no', '2do_bach', '3ro_bach'" },
              tipo: { type: "STRING", description: "Ej: 'semanas', 'semestre'" }
            },
            required: ["curso"]
          }
        }
      ]
    }
  ],
  // ... resto de la configuración
};
```

Aquí le estamos indicando al modelo que tiene a su disposición una función llamada `consultar_planificacion`. Le proporcionamos una descripción clara de para qué sirve y qué parámetros (argumentos) necesita para funcionar (`curso` y `tipo`).

## 2. Recepción e Intercepción del "Function Call"

Durante la sesión en vivo, Gemini evalúa la conversación. Si determina que necesita buscar una planificación curricular para responder al usuario, no responde con texto, sino que envía un mensaje especial (un "Function Call") solicitando que nosotros ejecutemos la herramienta por él.

Esto se maneja en el callback `onmessage` de la conexión WebSocket:

```typescript
onmessage: async (message: LiveServerMessage) => {
  // Verificamos si el mensaje contiene una solicitud de ejecución de herramienta
  const toolCallPart = message.serverContent?.modelTurn?.parts?.find((p: any) => p.functionCall);
  
  if (toolCallPart?.functionCall) {
    const { name, args, id } = toolCallPart.functionCall;
    
    // Comprobamos si la función solicitada es la que nosotros declaramos
    if (name === "consultar_planificacion") {
      // Importamos dinámicamente el módulo que contiene la lógica real
      import('../utils/knowledgeManager').then(({ consultarPlanificacion }) => {
        // Ejecutamos la función local con los argumentos que nos envió Gemini
        const result = consultarPlanificacion(args.curso, args.tipo || '');
        
        // ... (Ver siguiente paso)
      }).catch(console.error);
    }
  }
  // ...
}
```

## 3. Lógica de Negocio (El "Backend" de la Herramienta)

La función real `consultarPlanificacion` se encuentra en `utils/knowledgeManager.ts`. Su trabajo es recibir los argumentos (ej. curso="8vo"), buscar el contenido Markdown correspondiente y devolverlo en formato de texto.

```typescript
// utils/knowledgeManager.ts
export const consultarPlanificacion = (curso: string, tipo: string): string => {
  const query = `${curso?.toLowerCase() || ''}_${tipo?.toLowerCase() || ''}`;
  
  if (query.includes('8')) {
    return `Planificación de 8vo:\n${plan_8vo}`;
  }
  // ... lógica similar para otros cursos ...
  
  return "No se encontró una planificación específica...";
};
```

Esta separación permite mantener el hook limpio y cargar los archivos Markdown en memoria solo si realmente se necesitan (gracias al `import()` dinámico).

## 4. Retorno de la Respuesta a Gemini

Una vez que la función local (`consultarPlanificacion`) devuelve el texto de la planificación, el último paso es enviar ese resultado de vuelta a la sesión de Gemini para que el modelo pueda leerlo y generar una respuesta final para el usuario.

```typescript
// Dentro de la resolución de la importación dinámica en useGeminiLive.ts:
if (sessionRef.current) {
  sessionRef.current.send({
    toolResponses: [
      {
        functionResponses: [
          {
            name,                // Nombre de la función (consultar_planificacion)
            id,                  // ID único de la llamada que nos generó Gemini
            response: { result } // El contenido real (el texto del Markdown)
          }
        ]
      }
    ]
  });
}
```

**Flujo Completo:**
1. Usuario pregunta: *"¿Qué vamos a ver esta semana en 8vo?"*
2. Gemini deduce que necesita usar `consultar_planificacion(curso="8vo")`.
3. Gemini manda un mensaje de tipo `functionCall`.
4. El Frontend intercepta el mensaje, ejecuta la función en `knowledgeManager.ts` y obtiene el texto de la planificación.
5. El Frontend envía la planificación devuelta usando `toolResponses`.
6. Gemini lee la planificación y ahora sí responde con voz/texto: *"Esta semana en 8vo aprenderemos sobre..."*.
