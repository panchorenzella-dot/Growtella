# Arquitectura de Growtella

## Objetivo

Growtella funciona como la página principal y el punto de entrada a todas las herramientas. Cada aplicación puede conservar su propio proyecto de GitHub y Vercel, pero comparte identidad, usuarios, créditos y plan Pro.

## Estructura recomendada

- `growtella.com`: página principal, catálogo, cuenta y Growtella Pro.
- `calculadora.growtella.com` o el dominio actual: Calculadora Emprendedora.
- Cada herramienta futura: un subdominio y un proyecto independiente.
- Un solo proyecto de Supabase para autenticación, perfiles, suscripciones y créditos.
- Las llamadas a OpenAI se realizan siempre desde el servidor. La clave privada nunca se expone al navegador.

## Datos centrales

La cuenta compartida debería tener, como mínimo:

- `profiles`: nombre, correo y preferencias del usuario.
- `subscriptions`: plan, estado, fecha de renovación y proveedor de pago.
- `credit_wallets`: saldo compartido de créditos de IA.
- `credit_movements`: historial inmutable de cargas y consumos.
- `app_access`: permisos o beneficios específicos por herramienta.

Las tablas deben utilizar el identificador de usuario de Supabase Auth y políticas de seguridad para que cada persona solo pueda acceder a sus propios datos.

## Regla para los créditos

El navegador nunca descuenta créditos directamente. Cada herramienta llama a una función segura del servidor que valida la sesión, comprueba el saldo, registra el consumo y recién después consulta a OpenAI. Esto evita créditos negativos, fraude y exposición de la API.

## Orden de integración

1. Conectar el dominio principal.
2. Elegir los subdominios de cada herramienta.
3. Configurar las URL permitidas en Supabase Auth.
4. Migrar la cuenta actual de la calculadora al perfil central.
5. Crear la billetera y los movimientos de créditos.
6. Conectar Growtella Pro al proveedor de pagos.
7. Reutilizar esa base en la segunda herramienta.

No se debe duplicar una base de usuarios ni una clave de OpenAI por aplicación salvo que exista una razón técnica o legal concreta.
