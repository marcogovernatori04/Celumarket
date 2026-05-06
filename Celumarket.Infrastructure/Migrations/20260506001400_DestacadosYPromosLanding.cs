using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Celumarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DestacadosYPromosLanding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "PrecioAnterior",
                table: "Variaciones",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "EsDestacado",
                table: "Celulares",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "TextoPromocion",
                table: "Celulares",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PrecioAnterior",
                table: "Variaciones");

            migrationBuilder.DropColumn(
                name: "EsDestacado",
                table: "Celulares");

            migrationBuilder.DropColumn(
                name: "TextoPromocion",
                table: "Celulares");
        }
    }
}
