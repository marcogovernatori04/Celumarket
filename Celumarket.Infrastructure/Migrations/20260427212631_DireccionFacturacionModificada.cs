using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Celumarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DireccionFacturacionModificada : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DireccionFacturacion",
                table: "Clientes");

            migrationBuilder.AddColumn<string>(
                name: "Direccion_Calle",
                table: "Clientes",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Direccion_CodigoPostal",
                table: "Clientes",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Direccion_Localidad",
                table: "Clientes",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Direccion_Numero",
                table: "Clientes",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Direccion_PisoDepto",
                table: "Clientes",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Direccion_Provincia",
                table: "Clientes",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Direccion_Calle",
                table: "Clientes");

            migrationBuilder.DropColumn(
                name: "Direccion_CodigoPostal",
                table: "Clientes");

            migrationBuilder.DropColumn(
                name: "Direccion_Localidad",
                table: "Clientes");

            migrationBuilder.DropColumn(
                name: "Direccion_Numero",
                table: "Clientes");

            migrationBuilder.DropColumn(
                name: "Direccion_PisoDepto",
                table: "Clientes");

            migrationBuilder.DropColumn(
                name: "Direccion_Provincia",
                table: "Clientes");

            migrationBuilder.AddColumn<string>(
                name: "DireccionFacturacion",
                table: "Clientes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
