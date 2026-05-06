# Celumarket

Backend ASP.NET Core para un e-commerce de celulares.

## Secretos locales

El repo no guarda credenciales reales. Para correrlo en desarrollo, cargá los valores locales con `dotnet user-secrets`.

```powershell
cd C:\Users\Usuario\source\repos\Celumarket\Celumarket.API
dotnet user-secrets set "Jwt:SecretKey" "tu-clave-jwt-larga-y-local"
dotnet user-secrets set "MercadoPago:AccessToken" "tu-access-token-de-mercado-pago"
dotnet user-secrets set "MercadoPago:WebhookSecret" "tu-webhook-secret-de-mercado-pago"
```

Opcionalmente, también podés usar variables de entorno:

```powershell
$env:Jwt__SecretKey="tu-clave-jwt-larga-y-local"
$env:MercadoPago__AccessToken="tu-access-token-de-mercado-pago"
$env:MercadoPago__WebhookSecret="tu-webhook-secret-de-mercado-pago"
```

## Nota para la entrega

Para un proyecto final de carrera, esta estrategia es suficiente:

- el repositorio no expone secretos reales;
- cada integrante puede cargar sus credenciales locales;
- el código sigue siendo simple de ejecutar y mostrar.
