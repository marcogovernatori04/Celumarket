using Celumarket.Infrastructure;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Celumarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    [DbContext(typeof(CelumarketContext))]
    [Migration("20260428232000_CodigoSeguimientoNullable")]
    public partial class CodigoSeguimientoNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "CodigoSeguimiento",
                table: "Envios",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                UPDATE Envios
                SET CodigoSeguimiento = ''
                WHERE CodigoSeguimiento IS NULL;
                """);

            migrationBuilder.AlterColumn<string>(
                name: "CodigoSeguimiento",
                table: "Envios",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
