namespace Celumarket.Domain
{
    public class DatosMercadoPago
    {
        public string? PaymentIdExterno { get; private set; }
        public string? MetodoPagoId { get; private set; }
        public string? TipoPagoId { get; private set; }
        public int Cuotas { get; private set; }
        public decimal? ValorCuota { get; private set; }
        public decimal? MontoTotalFinal { get; private set; }
        public decimal? MontoPagado { get; private set; }
        public decimal? MontoNetoRecibido { get; private set; }
        public DateTime? FechaAprobacionUtc { get; private set; }

        protected DatosMercadoPago() { }

        public DatosMercadoPago(
            string? paymentIdExterno,
            string? metodoPagoId,
            string? tipoPagoId,
            int cuotas,
            decimal? valorCuota,
            decimal? montoTotalFinal,
            decimal? montoPagado,
            decimal? montoNetoRecibido,
            DateTime? fechaAprobacionUtc)
        {
            PaymentIdExterno = string.IsNullOrWhiteSpace(paymentIdExterno) ? null : paymentIdExterno.Trim();
            MetodoPagoId = string.IsNullOrWhiteSpace(metodoPagoId) ? null : metodoPagoId.Trim();
            TipoPagoId = string.IsNullOrWhiteSpace(tipoPagoId) ? null : tipoPagoId.Trim();
            Cuotas = cuotas < 0 ? 0 : cuotas;
            ValorCuota = valorCuota;
            MontoTotalFinal = montoTotalFinal;
            MontoPagado = montoPagado;
            MontoNetoRecibido = montoNetoRecibido;
            FechaAprobacionUtc = fechaAprobacionUtc;
        }
    }
}
