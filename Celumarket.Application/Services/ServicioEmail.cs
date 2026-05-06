using Celumarket.Application.DTOs;
using Celumarket.Application.Interfaces.Services;
using Celumarket.Domain;
using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Options;
using Celumarket.Application.Interfaces.Repositories;

namespace Celumarket.Application.Services
{
    public class ServicioEmail : IServicioEmail
    {
        private readonly SmtpSettings _settings;

        public ServicioEmail(IOptions<SmtpSettings> settings, IVariacionRepository variacionRepo)
        {
            _settings = settings.Value;
        }

        public async Task EnviarEmailPedidoAsync(Pedido pedido, Cliente cliente, string metodoPago, string nroFactura = null)
        { 
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(_settings.SenderName, _settings.SenderEmail));
            email.To.Add(new MailboxAddress($"{cliente.Nombre} {cliente.Apellido}", cliente.Usuario.Email));

            bool esTransferencia = metodoPago.ToLower().Contains("transferencia");
            email.Subject = esTransferencia ? $"Instrucciones de pago - Pedido #{pedido.Id} en Celumarket"
                                            : $"¡Pago confirmado! - Pedido #{pedido.Id} en Celumarket";

            decimal subtotal = pedido.Lineas.Sum(l => l.PrecioUnitario * l.Cantidad);
            decimal descuento = (subtotal + pedido.CostoEnvio) - pedido.MontoTotal;
            DateTime fechaVencimientoARG = pedido.FechaVencimiento.AddHours(-3);

            string htmlDescuento = descuento > 0
                ? $"<p style='margin: 5px 0; color: #27ae60;'><strong>Descuento aplicado:</strong> -${descuento:N2}</p>"
                : "";


            var bodyBuilder = new BodyBuilder();
            string htmlTableLines = "";

            foreach (var linea in pedido.Lineas)
            {
                var variacion = linea.VariacionCelular;

                string nombreProducto = variacion.Celular != null
                    ? $"{variacion.Celular.Marca} {variacion.Celular.Modelo} ({variacion.Color})"
                    : $"Producto ID {linea.VariacionId}";

                htmlTableLines += $@"
                    <tr>
                        <td style='padding: 8px; border-bottom: 1px solid #ddd;'>{nombreProducto}</td>
                        <td style='padding: 8px; border-bottom: 1px solid #ddd; text-align: center;'>{linea.Cantidad}</td>
                        <td style='padding: 8px; border-bottom: 1px solid #ddd; text-align: right;'>${linea.PrecioUnitario:N2}</td>
                    </tr>";
            }

            bodyBuilder.HtmlBody = $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;'>
                    <h2 style='color: #001830;'>Resumen de tu Pedido #{pedido.Id}</h2>
                    <p>Hola <strong>{cliente.Nombre} {cliente.Apellido}</strong> (DNI: {cliente.Dni}),</p>
                    <p>A continuación detallamos la información de tu compra en Celumarket:</p>
                    
                    <table style='width: 100%; border-collapse: collapse;'>
                        <thead>
                            <tr style='background-color: #f8f9fa;'>
                                <th style='padding: 8px; text-align: left;'>Producto</th>
                                <th style='padding: 8px;'>Cant.</th>
                                <th style='padding: 8px; text-align: right;'>Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {htmlTableLines}
                        </tbody>
                    </table>

                    <div style='text-align: right; margin-top: 20px;'>
                        <p style='margin: 5px 0; color: #7f8c8d;'><strong>Subtotal:</strong> ${subtotal:N2}</p>
                        {htmlDescuento}
                        <p style='margin: 5px 0;'><strong>Costo de Envío:</strong> ${(pedido.CostoEnvio == 0 ? "0,00 (Gratis)" : pedido.CostoEnvio.ToString("N2"))}</p>
    
                        <div style='display: flex; justify-content: flex-end; margin-top: 10px;'>
                            <h3 style='color: #005CB8; font-size: 22px; border-top: 2px solid #ddd; padding-top: 10px; margin: 0; min-width: 200px;'>
                                Total: ${pedido.MontoTotal:N2}
                            </h3>
                        </div>
                    </div>

                    <div style='background-color: #f4f7f6; padding: 15px; border-radius: 5px; margin-top: 20px;'>
                        <p><strong>Método de Pago:</strong> {metodoPago}</p>
                        <p><strong>Dirección de Entrega:</strong> {pedido.DireccionEntrega.Calle} {pedido.DireccionEntrega.Numero}{(!string.IsNullOrEmpty(pedido.DireccionEntrega.PisoDepto) ? $" - {pedido.DireccionEntrega.PisoDepto}" : "")}, {pedido.DireccionEntrega.Localidad}, {pedido.DireccionEntrega.Provincia} (CP: {pedido.DireccionEntrega.CodigoPostal})</p>
                        
                        {(!string.IsNullOrEmpty(nroFactura) ? $"<p><strong>Factura Nro:</strong> {nroFactura}</p>" : "")}

                        {(esTransferencia && pedido.EstadoPedido != EstadoPedido.Pagado ? $@"
                            <div style='border-top: 2px solid #fff; margin-top: 10px; padding-top: 10px;'>
                                <p style='color: #005CB8;'><strong>⚠️ DATOS BANCARIOS PARA TRANSFERENCIA:</strong></p>
                                <p>BANCO: Santander<br>CBU: 0720123456789012345678<br>ALIAS: celumarket.tienda<br>TITULAR: Celumarket S.A.</p>
                                <p style='color: #6B0F1A;'><strong>Tenés tiempo de pagar hasta:</strong> {fechaVencimientoARG:dd/MM/yyyy HH:mm} hs</p>
                            </div>" : "")}
                    </div>

                    <p style='font-size: 12px; color: #7f8c8d; margin-top: 30px;'>Gracias por confiar en Celumarket.</p>
        
                    <hr style='border: 0; border-top: 1px solid #eee; margin: 20px 0;'>
        
                    <p style='font-size: 13px; color: #2c3e50; text-align: center;'>
                        Si tenés alguna duda, contactate con nosotros a: 
                        <a href='mailto:{_settings.SenderEmail}' style='color: #2980b9; text-decoration: none; font-weight: bold;'>
                            {_settings.SenderEmail}
                        </a>
                    </p>
                </div>";


            email.Body = bodyBuilder.ToMessageBody();

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(_settings.Server, _settings.Port, MailKit.Security.SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(_settings.Username, _settings.Password);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);

        }
    }
}
