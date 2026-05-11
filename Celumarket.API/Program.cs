using Celumarket.Application.Interfaces;
using Celumarket.Application.Services;
using Celumarket.Infrastructure;
using Celumarket.Infrastructure.Repositories;
using Celumarket.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models;
using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Application.Interfaces.Services;
using Celumarket.API.Services;
using Celumarket.Infrastructure.Services;
using Celumarket.Application.DTOs;
using Celumarket.API.Middlewares;
using Celumarket.Application.Services.Pedidos;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Autorización JWT usando el esquema Bearer. \r\n\r\n Escribe la palabra 'Bearer' seguida de un espacio y luego el token.",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        { 
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });
});

builder.Services.AddDbContext<CelumarketContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

string[] allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? new[] { "http://localhost:5173" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod();
    });
});

builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));

builder.Services.AddScoped<ICarritoRepository, CarritoRepository>();
builder.Services.AddScoped<ICelularRepository, CelularRepository>();
builder.Services.AddScoped<IColorRepository, ColorRepository>();
builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<IConfiguracionRepository, ConfiguracionRepository>();
builder.Services.AddScoped<IEnvioRepository, EnvioRepository>();
builder.Services.AddScoped<IEspecificacionRepository,  EspecificacionRepository>();
builder.Services.AddScoped<IFacturaRepository, FacturaRepository>();
builder.Services.AddScoped<IImagenRepository, ImagenRepository>();
builder.Services.AddScoped<IMetodoPagoRepository, MetodoPagoRepository>();
builder.Services.AddScoped<IPagoRepository, PagoRepository>();
builder.Services.AddScoped<IPedidoRepository, PedidoRepository>();
builder.Services.AddScoped<IReservaCheckoutRepository, ReservaCheckoutRepository>();
builder.Services.AddScoped<IRolRepository, RolRepository>();
builder.Services.AddScoped<ITarifaZonalRepository, TarifaZonalRepository>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IVariacionRepository, VariacionRepository>();



builder.Services.AddScoped<IGestorCarrito, GestorCarrito>();
builder.Services.AddScoped<IGestorCatalogo, GestorCatalogo>();
builder.Services.AddScoped<IGestorCliente, GestorCliente>();
builder.Services.AddScoped<IGestorConsultaPedido, GestorConsultaPedido>();
builder.Services.AddScoped<IGestorDocumentoFactura, GestorDocumentoFactura>();
builder.Services.AddScoped<IGestorPedidoCliente, GestorPedidoCliente>();
builder.Services.AddScoped<IGestorEnvio, GestorEnvio>();
builder.Services.AddScoped<IGestorFacturacion, GestorFacturacion>();
builder.Services.AddScoped<IGestorPago, GestorPago>();
builder.Services.AddScoped<IGestorPedido, GestorPedido>();
builder.Services.AddScoped<IGestorCreacionPedido, GestorCreacionPedido>();
builder.Services.AddScoped<IGestorPagoPedido, GestorPagoPedido>();
builder.Services.AddScoped<IGestorCancelacionPedido, GestorCancelacionPedido>();
builder.Services.AddScoped<IGestorReservaCheckout, GestorReservaCheckout>();
builder.Services.AddScoped<IGestorPromociones, GestorPromociones>();
builder.Services.AddScoped<IGestorStock, GestorStock>();
builder.Services.AddScoped<IServicioSeguridad, ServicioSeguridad>();
builder.Services.AddScoped<IServicioMercadoPago, ServicioMercadoPago>();
builder.Services.AddScoped<IServicioImagen, ServicioImagen>();
builder.Services.AddScoped<IServicioFacturacion, ServicioFacturacionMock>();
builder.Services.AddScoped<IServicioEmail, ServicioEmail>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddHostedService<PedidoExpirationService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "CelumarketAPI",
            ValidAudience = "CelumarketApp",
            IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]))
        };
    });

var app = builder.Build();


app.UseCors("PermitirFrontend");
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<CelumarketContext>();
    var servicioSeguridad = services.GetRequiredService<IServicioSeguridad>();
    await DbInitializer.SeedAsync(context, servicioSeguridad);
}

app.Run();
