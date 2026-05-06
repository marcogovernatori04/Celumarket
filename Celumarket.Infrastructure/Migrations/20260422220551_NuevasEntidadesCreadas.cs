using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Celumarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class NuevasEntidadesCreadas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LineasPedido_Variaciones_VariacionCelularId",
                table: "LineasPedido");

            migrationBuilder.RenameColumn(
                name: "VariacionCelularId",
                table: "LineasPedido",
                newName: "VariacionId");

            migrationBuilder.RenameIndex(
                name: "IX_LineasPedido_VariacionCelularId",
                table: "LineasPedido",
                newName: "IX_LineasPedido_VariacionId");

            migrationBuilder.CreateTable(
                name: "Carritos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClienteId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Carritos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Carritos_Clientes_ClienteId",
                        column: x => x.ClienteId,
                        principalTable: "Clientes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ItemsCarrito",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VariacionId = table.Column<int>(type: "int", nullable: false),
                    Cantidad = table.Column<int>(type: "int", nullable: false),
                    CarritoId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemsCarrito", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ItemsCarrito_Carritos_CarritoId",
                        column: x => x.CarritoId,
                        principalTable: "Carritos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ItemsCarrito_Variaciones_VariacionId",
                        column: x => x.VariacionId,
                        principalTable: "Variaciones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Carritos_ClienteId",
                table: "Carritos",
                column: "ClienteId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemsCarrito_CarritoId",
                table: "ItemsCarrito",
                column: "CarritoId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemsCarrito_VariacionId",
                table: "ItemsCarrito",
                column: "VariacionId");

            migrationBuilder.AddForeignKey(
                name: "FK_LineasPedido_Variaciones_VariacionId",
                table: "LineasPedido",
                column: "VariacionId",
                principalTable: "Variaciones",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LineasPedido_Variaciones_VariacionId",
                table: "LineasPedido");

            migrationBuilder.DropTable(
                name: "ItemsCarrito");

            migrationBuilder.DropTable(
                name: "Carritos");

            migrationBuilder.RenameColumn(
                name: "VariacionId",
                table: "LineasPedido",
                newName: "VariacionCelularId");

            migrationBuilder.RenameIndex(
                name: "IX_LineasPedido_VariacionId",
                table: "LineasPedido",
                newName: "IX_LineasPedido_VariacionCelularId");

            migrationBuilder.AddForeignKey(
                name: "FK_LineasPedido_Variaciones_VariacionCelularId",
                table: "LineasPedido",
                column: "VariacionCelularId",
                principalTable: "Variaciones",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
