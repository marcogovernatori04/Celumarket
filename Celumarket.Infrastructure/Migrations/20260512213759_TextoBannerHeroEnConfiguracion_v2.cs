using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Celumarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class TextoBannerHeroEnConfiguracion_v2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TextoBannerHero",
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
                name: "TextoBannerHero",
                table: "ConfiguracionesSistema");
        }
    }
}
