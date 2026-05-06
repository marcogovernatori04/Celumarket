using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Celumarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class PreciosDivididos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Precio",
                table: "TarifasZonales",
                newName: "PrecioSucursal");

            migrationBuilder.AddColumn<decimal>(
                name: "PrecioDomicilio",
                table: "TarifasZonales",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "TipoEnvio",
                table: "Pedidos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Tipo",
                table: "Envios",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PrecioDomicilio",
                table: "TarifasZonales");

            migrationBuilder.DropColumn(
                name: "TipoEnvio",
                table: "Pedidos");

            migrationBuilder.DropColumn(
                name: "Tipo",
                table: "Envios");

            migrationBuilder.RenameColumn(
                name: "PrecioSucursal",
                table: "TarifasZonales",
                newName: "Precio");
        }
    }
}
