using System.Net;
using System.Text.Json;

namespace Celumarket.API.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                // Dejamos que la petición siga su curso normal
                await _next(context);
            }
            catch (Exception ex)
            {
                // ¡Si algo se rompe, lo atrapamos acá!
                _logger.LogError(ex, ex.Message);
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            // Por defecto, cualquier error no controlado es un 500
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            // Si es un error de negocio (por ej: "Stock insuficiente"), le mandamos un 400
            if (exception is InvalidOperationException || exception is ArgumentException)
            {
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            }

            var response = new
            {
                context.Response.StatusCode,
                exception.Message,
                Details = exception.InnerException?.Message
            };

            var jsonResponse = JsonSerializer.Serialize(response);
            return context.Response.WriteAsync(jsonResponse);
        }
    }
}