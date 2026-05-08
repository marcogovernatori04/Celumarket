using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Celumarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class TarifaZonalSucursalCorreo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SucursalCorreoCalle",
                table: "TarifasZonales",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "SucursalCorreoCodigoPostal",
                table: "TarifasZonales",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "SucursalCorreoLocalidad",
                table: "TarifasZonales",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SucursalCorreoNumero",
                table: "TarifasZonales",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SucursalCorreoPisoDepto",
                table: "TarifasZonales",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SucursalCorreoProvincia",
                table: "TarifasZonales",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SucursalCorreoCalle",
                table: "TarifasZonales");

            migrationBuilder.DropColumn(
                name: "SucursalCorreoCodigoPostal",
                table: "TarifasZonales");

            migrationBuilder.DropColumn(
                name: "SucursalCorreoLocalidad",
                table: "TarifasZonales");

            migrationBuilder.DropColumn(
                name: "SucursalCorreoNumero",
                table: "TarifasZonales");

            migrationBuilder.DropColumn(
                name: "SucursalCorreoPisoDepto",
                table: "TarifasZonales");

            migrationBuilder.DropColumn(
                name: "SucursalCorreoProvincia",
                table: "TarifasZonales");
        }
    }
}
