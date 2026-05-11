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
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            bool esErrorNegocio = exception is InvalidOperationException || exception is ArgumentException;
            context.Response.StatusCode = esErrorNegocio
                ? (int)HttpStatusCode.BadRequest
                : (int)HttpStatusCode.InternalServerError;

            // no mostrar errores internos.
            var response = new
            {
                context.Response.StatusCode,
                Message = esErrorNegocio ? exception.Message : "Ocurrió un error interno. Intenta nuevamente.",
                TraceId = context.TraceIdentifier
            };

            var jsonResponse = JsonSerializer.Serialize(response);
            return context.Response.WriteAsync(jsonResponse);
        }
    }
}
