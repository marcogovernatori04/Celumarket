using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Celumarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class PagoDatosMercadoPagoCuotasYTotal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MpCuotas",
                table: "Pagos",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "MpFechaAprobacionUtc",
                table: "Pagos",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MpMetodoPagoId",
                table: "Pagos",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MpMontoNetoRecibido",
                table: "Pagos",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MpMontoPagado",
                table: "Pagos",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MpMontoTotalFinal",
                table: "Pagos",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MpPaymentIdExterno",
                table: "Pagos",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MpTipoPagoId",
                table: "Pagos",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MpValorCuota",
                table: "Pagos",
                type: "decimal(18,2)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MpCuotas",
                table: "Pagos");

            migrationBuilder.DropColumn(
                name: "MpFechaAprobacionUtc",
                table: "Pagos");

            migrationBuilder.DropColumn(
                name: "MpMetodoPagoId",
                table: "Pagos");

            migrationBuilder.DropColumn(
                name: "MpMontoNetoRecibido",
                table: "Pagos");

            migrationBuilder.DropColumn(
                name: "MpMontoPagado",
                table: "Pagos");

            migrationBuilder.DropColumn(
                name: "MpMontoTotalFinal",
                table: "Pagos");

            migrationBuilder.DropColumn(
                name: "MpPaymentIdExterno",
                table: "Pagos");

            migrationBuilder.DropColumn(
                name: "MpTipoPagoId",
                table: "Pagos");

            migrationBuilder.DropColumn(
                name: "MpValorCuota",
                table: "Pagos");
        }
    }
}
