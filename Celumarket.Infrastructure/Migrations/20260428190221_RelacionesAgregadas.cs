using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Celumarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RelacionesAgregadas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TipoComprobante",
                table: "Facturas",
                newName: "NumeroFactura");

            migrationBuilder.RenameColumn(
                name: "NumeroComprobante",
                table: "Facturas",
                newName: "NombreReceptor");

            migrationBuilder.RenameColumn(
                name: "DireccionEntrega",
                table: "Envios",
                newName: "Provincia");

            migrationBuilder.AddColumn<decimal>(
                name: "CostoEnvio",
                table: "Pedidos",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "CAE",
                table: "Facturas",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DniReceptor",
                table: "Facturas",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "MontoTotal",
                table: "Facturas",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "Tipo",
                table: "Facturas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "VencimientoCAE",
                table: "Facturas",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Estado",
                table: "Envios",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "CodigoPostal",
                table: "Envios",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "Calle",
                table: "Envios",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CodigoSeguimiento",
                table: "Envios",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaDespacho",
                table: "Envios",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Localidad",
                table: "Envios",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Numero",
                table: "Envios",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PisoDepto",
                table: "Envios",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CostoEnvio",
                table: "Pedidos");

            migrationBuilder.DropColumn(
                name: "CAE",
                table: "Facturas");

            migrationBuilder.DropColumn(
                name: "DniReceptor",
                table: "Facturas");

            migrationBuilder.DropColumn(
                name: "MontoTotal",
                table: "Facturas");

            migrationBuilder.DropColumn(
                name: "Tipo",
                table: "Facturas");

            migrationBuilder.DropColumn(
                name: "VencimientoCAE",
                table: "Facturas");

            migrationBuilder.DropColumn(
                name: "Calle",
                table: "Envios");

            migrationBuilder.DropColumn(
                name: "CodigoSeguimiento",
                table: "Envios");

            migrationBuilder.DropColumn(
                name: "FechaDespacho",
                table: "Envios");

            migrationBuilder.DropColumn(
                name: "Localidad",
                table: "Envios");

            migrationBuilder.DropColumn(
                name: "Numero",
                table: "Envios");

            migrationBuilder.DropColumn(
                name: "PisoDepto",
                table: "Envios");

            migrationBuilder.RenameColumn(
                name: "NumeroFactura",
                table: "Facturas",
                newName: "TipoComprobante");

            migrationBuilder.RenameColumn(
                name: "NombreReceptor",
                table: "Facturas",
                newName: "NumeroComprobante");

            migrationBuilder.RenameColumn(
                name: "Provincia",
                table: "Envios",
                newName: "DireccionEntrega");

            migrationBuilder.AlterColumn<string>(
                name: "Estado",
                table: "Envios",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "CodigoPostal",
                table: "Envios",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }
    }
}
