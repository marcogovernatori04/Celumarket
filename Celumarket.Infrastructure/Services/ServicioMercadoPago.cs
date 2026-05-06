using Celumarket.Application.Interfaces.Services;
using Celumarket.Domain;
using MercadoPago.Client.Preference;
using MercadoPago.Config;
using MercadoPago.Resource.Preference;
using Microsoft.EntityFrameworkCore.Storage.Json;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Infrastructure.Services
{
    public class ServicioMercadoPago : IServicioMercadoPago
    {
        public ServicioMercadoPago(IConfiguration config)
        {
            MercadoPagoConfig.AccessToken = config["MercadoPago:AccessToken"];
        }

        public async Task<string> GenerarLinkDePagoAsync(Pedido pedido)
        {
            var request = new PreferenceRequest
            {
                Items = new List<PreferenceItemRequest>
                {
                    new PreferenceItemRequest
                    {
                        Title = $"Compra en Celumarket - Pedido #{pedido.Id}",
                        Quantity = 1,
                        CurrencyId = "ARS",
                        UnitPrice = pedido.MontoTotal
                    }
                },
                ExternalReference = pedido.Id.ToString(),
                BackUrls = new PreferenceBackUrlsRequest
                {
                    Success = "https://tuapp.com/pago-exitoso",
                    Failure = "https://tuapp.com/pago-fallido",
                    Pending = "https://tuapp.com/pago-pendiente"
                },
                AutoReturn = "approved"
            };

            var client = new PreferenceClient();
            Preference preference = await client.CreateAsync(request);

            return preference.InitPoint; // devuelve el link de pago
        }
    }
}
