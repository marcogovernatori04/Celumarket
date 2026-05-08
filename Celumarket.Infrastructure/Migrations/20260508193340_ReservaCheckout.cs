using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Celumarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ReservaCheckout : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ReservasCheckout",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClienteId = table.Column<int>(type: "int", nullable: false),
                    FechaCreacionUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaVencimientoUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Estado = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReservasCheckout", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReservasCheckout_Clientes_ClienteId",
                        column: x => x.ClienteId,
                        principalTable: "Clientes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ReservasCheckoutItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReservaCheckoutId = table.Column<int>(type: "int", nullable: false),
                    VariacionId = table.Column<int>(type: "int", nullable: false),
                    Cantidad = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReservasCheckoutItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReservasCheckoutItems_ReservasCheckout_ReservaCheckoutId",
                        column: x => x.ReservaCheckoutId,
                        principalTable: "ReservasCheckout",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReservasCheckoutItems_Variaciones_VariacionId",
                        column: x => x.VariacionId,
                        principalTable: "Variaciones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ReservasCheckout_ClienteId",
                table: "ReservasCheckout",
                column: "ClienteId");

            migrationBuilder.CreateIndex(
                name: "IX_ReservasCheckoutItems_ReservaCheckoutId",
                table: "ReservasCheckoutItems",
                column: "ReservaCheckoutId");

            migrationBuilder.CreateIndex(
                name: "IX_ReservasCheckoutItems_VariacionId",
                table: "ReservasCheckoutItems",
                column: "VariacionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReservasCheckoutItems");

            migrationBuilder.DropTable(
                name: "ReservasCheckout");
        }
    }
}
