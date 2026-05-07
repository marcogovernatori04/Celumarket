using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Celumarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ColoresCatalogoYVariacionColorId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Colores",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Hex = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Colores", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Colores_Nombre",
                table: "Colores",
                column: "Nombre",
                unique: true);

            migrationBuilder.AddColumn<int?>(
                name: "ColorId",
                table: "Variaciones",
                type: "int",
                nullable: true);

            migrationBuilder.Sql(@"
                INSERT INTO Colores (Nombre, Hex, Activo)
                VALUES
                    ('Negro', '#1c1c1e', 1),
                    ('Blanco', '#f5f5f5', 1),
                    ('Grafito', '#1c1c1e', 1),
                    ('Lavanda', '#9966CC', 1),
                    ('Oliva', '#808000', 1),
                    ('Rosa', '#FFA6C9', 1),
                    ('Azul hielo', '#8AB9F1', 1),
                    ('Azul marino', '#011F5B', 1);
            ");

            migrationBuilder.Sql(@"
                INSERT INTO Colores (Nombre, Hex, Activo)
                SELECT DISTINCT v.Color, '#6b7280', 1
                FROM Variaciones v
                LEFT JOIN Colores c ON LOWER(c.Nombre) = LOWER(v.Color)
                WHERE c.Id IS NULL AND v.Color IS NOT NULL AND LTRIM(RTRIM(v.Color)) <> '';
            ");

            migrationBuilder.Sql(@"
                UPDATE v
                SET v.ColorId = c.Id
                FROM Variaciones v
                INNER JOIN Colores c ON LOWER(c.Nombre) = LOWER(v.Color)
                WHERE v.ColorId IS NULL;
            ");

            migrationBuilder.Sql(@"
                UPDATE v
                SET v.ColorId = c.Id
                FROM Variaciones v
                CROSS JOIN (SELECT TOP 1 Id FROM Colores WHERE LOWER(Nombre) = 'negro') c
                WHERE v.ColorId IS NULL;
            ");

            migrationBuilder.AlterColumn<int>(
                name: "ColorId",
                table: "Variaciones",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Variaciones_ColorId",
                table: "Variaciones",
                column: "ColorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Variaciones_Colores_ColorId",
                table: "Variaciones",
                column: "ColorId",
                principalTable: "Colores",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.DropColumn(
                name: "Color",
                table: "Variaciones");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Variaciones_Colores_ColorId",
                table: "Variaciones");

            migrationBuilder.DropIndex(
                name: "IX_Variaciones_ColorId",
                table: "Variaciones");

            migrationBuilder.AddColumn<string>(
                name: "Color",
                table: "Variaciones",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.DropColumn(
                name: "ColorId",
                table: "Variaciones");

            migrationBuilder.DropTable(
                name: "Colores");
        }
    }
}
