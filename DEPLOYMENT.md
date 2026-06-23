# Celumarket - Checklist de deploy

## Arquitectura recomendada

- Frontend: Vercel, proyecto `celumarket-frontend`.
- Backend: Azure App Service, runtime .NET 8.
- Base de datos: Azure SQL Database.
- Imágenes: Cloudinary.
- Pagos: Mercado Pago sandbox/pruebas.

## 1. Backend - Azure App Service

Crear un App Service para la API con runtime .NET 8.

Variables de entorno necesarias:

```text
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=<connection-string-de-azure-sql>
Jwt__SecretKey=<clave-larga-secreta>
Cors__AllowedOrigins__0=https://<frontend-vercel>.vercel.app

MercadoPago__AccessToken=<mp-access-token>
MercadoPago__WebhookSecret=<mp-webhook-secret>
MercadoPago__FrontendBaseUrl=https://<frontend-vercel>.vercel.app
MercadoPago__NotificationUrl=https://<api-azure>.azurewebsites.net/api/webhooks/mercadopago
MercadoPago__SuccessUrl=https://<frontend-vercel>.vercel.app/resultado-pago
MercadoPago__FailureUrl=https://<frontend-vercel>.vercel.app/resultado-pago
MercadoPago__PendingUrl=https://<frontend-vercel>.vercel.app/resultado-pago

CloudinarySettings__CloudName=<cloud-name>
CloudinarySettings__ApiKey=<api-key>
CloudinarySettings__ApiSecret=<api-secret>

SmtpSettings__Server=<smtp-server>
SmtpSettings__Port=<smtp-port>
SmtpSettings__SenderName=Ventas Celumarket
SmtpSettings__SenderEmail=ventas@celumarket.com
SmtpSettings__Username=<smtp-username>
SmtpSettings__Password=<smtp-password>
```

Probar API:

```text
https://<api-azure>.azurewebsites.net/api/health
```

Debe responder con `status: ok`.

## 2. Base de datos - Azure SQL

Ejecutar migraciones contra la base remota:

```powershell
dotnet ef database update --project .\Celumarket.Infrastructure\Celumarket.Infrastructure.csproj --startup-project .\Celumarket.API\Celumarket.API.csproj
```

Si se ejecuta desde local, la connection string usada debe apuntar a Azure SQL.

Al iniciar la API, el sistema ejecuta el seed inicial de roles y usuarios demo.

## 3. Frontend - Vercel

Crear proyecto en Vercel apuntando a:

```text
Root Directory: celumarket-frontend
Build Command: npm run build
Output Directory: dist
```

Variable de entorno:

```text
VITE_API_BASE_URL=https://<api-azure>.azurewebsites.net/api
```

El archivo `vercel.json` redirige todas las rutas a `index.html` para que React Router funcione al refrescar páginas internas.

## 4. Orden recomendado

1. Crear Azure SQL.
2. Crear Azure App Service.
3. Configurar variables del backend.
4. Ejecutar migraciones.
5. Deployar API.
6. Probar `/api/health`.
7. Deployar frontend en Vercel.
8. Agregar URL de Vercel al CORS del backend.
9. Actualizar URLs de Mercado Pago con los dominios reales.
10. Hacer smoke test completo.

## 5. Smoke test para presentación

- Abrir landing.
- Entrar al catálogo.
- Ver detalle de celular.
- Agregar producto al carrito.
- Iniciar checkout.
- Completar envío.
- Completar facturación.
- Elegir transferencia y confirmar pedido.
- Entrar al panel admin.
- Revisar pedidos.
- Confirmar pago manual.
- Revisar envío.
- Revisar reportes.
- Editar destacado/configuración.
- Crear o editar usuario interno.

## 6. Plan B

Si el backend cloud falla antes de la presentación, usar frontend en Vercel y exponer la API local con Dev Tunnel o ngrok. En ese caso:

- Cambiar `VITE_API_BASE_URL` en Vercel al túnel público.
- Agregar el dominio de Vercel en CORS.
- Mantener la base local SQL Server si Azure SQL no queda lista.
