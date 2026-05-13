using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Celumarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ConfigTransferenciaEnConfiguracionSistema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AliasTransferencia",
                table: "ConfiguracionesSistema",
                type: "nvarchar(80)",
                maxLength: 80,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BancoTransferencia",
                table: "ConfiguracionesSistema",
                type: "nvarchar(120)",
                maxLength: 120,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CbuTransferencia",
                table: "ConfiguracionesSistema",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TitularTransferencia",
                table: "ConfiguracionesSistema",
                type: "nvarchar(120)",
                maxLength: 120,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AliasTransferencia",
                table: "ConfiguracionesSistema");

            migrationBuilder.DropColumn(
                name: "BancoTransferencia",
                table: "ConfiguracionesSistema");

            migrationBuilder.DropColumn(
                name: "CbuTransferencia",
                table: "ConfiguracionesSistema");

            migrationBuilder.DropColumn(
                name: "TitularTransferencia",
                table: "ConfiguracionesSistema");
        }
    }
}
