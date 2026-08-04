# Arquitectura de Growtella

## Objetivo

Growtella funciona como la página principal y el punto de entrada a todas las herramientas. Cada aplicación conserva su propio proyecto de GitHub y Vercel, pero comparte identidad, usuarios, límites de IA, historial y plan Pro.

## Estructura recomendada

- `growtella.com`: página principal, catálogo, cuenta y Growtella Pro.
- `calculadora.growtella.com` o el dominio actual: Calculadora Emprendedora.
- Cada herramienta futura: un subdominio y un proyecto independiente.
- Un solo proyecto de Supabase para autenticación, perfiles, suscripciones, usos de IA y datos del usuario.
- Las llamadas a OpenAI se realizan siempre desde el servidor. La clave privada nunca se expone al navegador.

Una cuenta creada en cualquiera de las aplicaciones es la misma cuenta en las demás. Como cada dominio guarda su propia sesión del navegador, el usuario puede tener que ingresar nuevamente al pasar por primera vez a otro dominio; sus credenciales, plan y datos sí son compartidos.

## Datos centrales

La cuenta central reutiliza las tablas y funciones que ya existen en Calculadora Emprendedora:

- Supabase Auth y `user_metadata`: identidad y perfil.
- `user_plans`: plan gratuito o Pro, estado, renovación y proveedor de pago.
- `ai_usage_events`: consumos reservados y confirmados de análisis, chat y escenarios.
- `get_my_usage_summary()`: límites, consumos y fecha de renovación del usuario.
- `saved_scenarios`: escenarios guardados.
- `ai_conversations` y `ai_messages`: historial de análisis y conversaciones.

Las tablas deben utilizar el identificador de usuario de Supabase Auth y políticas de seguridad para que cada persona solo pueda acceder a sus propios datos.

## Regla para los créditos

El navegador nunca registra consumos ni consulta OpenAI directamente. La API de la calculadora valida la sesión, reserva el uso mediante `consume_ai_quota`, consulta OpenAI desde el servidor y libera la reserva si el proveedor falla. La clave `OPENAI_API_KEY` permanece únicamente en las variables privadas del proyecto que ejecuta esa API.

## Orden de integración

1. Publicar Growtella como proyecto independiente.
2. Configurar en Vercel el mismo URL y la misma clave pública de Supabase.
3. Autorizar las URL de Growtella en Supabase Auth.
4. Probar registro, ingreso, recuperación, plan, usos e historial.
5. Conectar el dominio principal y, después, el subdominio de la calculadora.
6. Reutilizar esta misma base y el control de cuotas en la segunda herramienta.

No se duplica la base de usuarios. Cada proyecto de Vercel que tenga una función de IA necesita su propia variable privada `OPENAI_API_KEY`, aunque el valor pueda corresponder a la misma cuenta de OpenAI. Nunca debe agregarse como variable `NEXT_PUBLIC_*` ni guardarse en GitHub.
