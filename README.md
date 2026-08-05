# Growtella

Página principal del ecosistema Growtella. Reúne las aplicaciones, la cuenta central y Growtella Pro con una identidad visual blanca y verde.

## Desarrollo

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Variables de entorno

Copiar `.env.example` a `.env.local` y completar las variables necesarias. Para compartir usuarios, plan Pro, usos de IA e historial, `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` deben apuntar al mismo proyecto de Supabase que utiliza Calculadora Emprendedora.

La migración `supabase/migrations/202608050001_growtella_business_diagnostics.sql` agrega el historial de diagnósticos con políticas RLS. El informe permanece local hasta que el usuario decide guardarlo; después puede volver a abrirlo desde **Mi cuenta**.

Growtella no necesita una clave privada de OpenAI porque esta página no realiza consultas de IA. La calculadora conserva `OPENAI_API_KEY` únicamente en su servidor; las herramientas futuras deberán seguir el mismo patrón.

## Publicación

El proyecto está preparado para publicarse como un proyecto independiente de Vercel y conectarse al dominio principal de Growtella. Después de publicar, hay que autorizar `https://TU-DOMINIO/cuenta` como URL de redirección en Supabase Auth.

## Documentación

- [Arquitectura compartida](docs/ARQUITECTURA.md)
- [Lista de lanzamiento](docs/LANZAMIENTO.md)
