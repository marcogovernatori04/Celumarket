using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Celumarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UrlImagenHeroConfiguracion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UrlImagenHero",
                table: "ConfiguracionesSistema",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UrlImagenHero",
                table: "ConfiguracionesSistema");
        }
    }
}
