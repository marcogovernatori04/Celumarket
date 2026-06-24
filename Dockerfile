# ---------- Etapa 1: build ----------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiamos los .csproj primero para aprovechar el cache de capas de Docker
COPY Celumarket.API/Celumarket.API.csproj Celumarket.API/
COPY Celumarket.Application/Celumarket.Application.csproj Celumarket.Application/
COPY Celumarket.Infrastructure/Celumarket.Infrastructure.csproj Celumarket.Infrastructure/
COPY Celumarket.Domain/Celumarket.Domain.csproj Celumarket.Domain/

RUN dotnet restore Celumarket.API/Celumarket.API.csproj

# Copiamos el resto del código
COPY . .

WORKDIR /src/Celumarket.API
RUN dotnet publish -c Release -o /app/publish --no-restore

# ---------- Etapa 2: runtime ----------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Render inyecta la variable de entorno PORT en runtime (normalmente 10000).
# Usamos shell form en el ENTRYPOINT para resolverla recién al arrancar el contenedor.
EXPOSE 8080

ENTRYPOINT ASPNETCORE_URLS=http://+:${PORT:-8080} dotnet Celumarket.API.dll
