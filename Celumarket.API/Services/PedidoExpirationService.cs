using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Application.Interfaces.Services;

namespace Celumarket.API.Services
{
    public class PedidoExpirationService : BackgroundService
    {
        private static readonly TimeSpan CheckInterval = TimeSpan.FromMinutes(1);
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<PedidoExpirationService> _logger;

        public PedidoExpirationService(IServiceProvider serviceProvider, ILogger<PedidoExpirationService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            using var timer = new PeriodicTimer(CheckInterval);

            while (!stoppingToken.IsCancellationRequested
                && await timer.WaitForNextTickAsync(stoppingToken))
            {
                try
                {
                    await ExpirarPedidosPendientesAsync(stoppingToken);
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error al expirar pedidos pendientes.");
                }
            }
        }

        private async Task ExpirarPedidosPendientesAsync(CancellationToken cancellationToken)
        {
            using var scope = _serviceProvider.CreateScope();

            var pedidoRepo = scope.ServiceProvider.GetRequiredService<IPedidoRepository>();
            var pagoRepo = scope.ServiceProvider.GetRequiredService<IPagoRepository>();
            var gestorPedido = scope.ServiceProvider.GetRequiredService<IGestorPedido>();

            var vencidos = await pedidoRepo.ObtenerPendientesVencidosAsync(DateTime.UtcNow);
            foreach (var pedido in vencidos)
            {
                cancellationToken.ThrowIfCancellationRequested();

                var pagoPendiente = await pagoRepo.ObtenerPorPedidoIdAsync(pedido.Id);
                if (pagoPendiente != null)
                {
                    pagoPendiente.Rechazar();
                }

                await gestorPedido.CancelarPedidoAsync(pedido.Id);
                _logger.LogInformation("Pedido {PedidoId} cancelado por vencimiento.", pedido.Id);
            }
        }
    }
}
