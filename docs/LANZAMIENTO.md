# Lista de lanzamiento de Growtella

## Antes de publicar

- Comprar el dominio definitivo.
- Correo profesional configurado: `contacto@growtella.com`.
- Confirmar que el repositorio independiente de Growtella esté actualizado en GitHub.
- Importar ese repositorio como un proyecto nuevo de Vercel.
- Agregar en Vercel las variables públicas de `.env.example` con los valores reales.
- Usar exactamente el mismo proyecto de Supabase que la calculadora.
- Agregar la URL publicada y `/cuenta` a las redirecciones permitidas de Supabase Auth.
- Conectar el dominio principal en Vercel.
- Decidir si la calculadora seguirá con su dominio actual o usará un subdominio.

## Medición

- Crear una propiedad web de Google Analytics para el dominio principal.
- Copiar el identificador `G-...` en `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`.
- Registrar el dominio en Google Search Console.
- Enviar `https://tudominio.com/sitemap.xml` a Search Console.
- Instalar los píxeles de Meta y TikTok recién antes de comenzar campañas pagas.

## Cuenta y producto

- Probar registro, ingreso, recuperación de contraseña y cierre de sesión.
- Guardar un diagnóstico, abrirlo desde Mi cuenta y actualizarlo.
- Confirmar que el usuario vea el mismo plan y los mismos datos al abrir otra herramienta.
- Probar límites, consumos e historial de IA con usuarios de prueba.
- Probar compra, renovación y cancelación de Growtella Pro.
- Definir límites de gasto de OpenAI para evitar sorpresas.
- Mantener `OPENAI_API_KEY` solo en el servidor de las aplicaciones que utilicen IA.

## Control final

- Revisar inicio, herramientas, Pro, cuenta, contacto y páginas legales.
- Probar en celular y computadora.
- Verificar enlaces, favicon, imagen para compartir y correo de contacto.
- Confirmar que Analytics reciba una visita en tiempo real.
- Publicar contenido orgánico antes de invertir en anuncios.
