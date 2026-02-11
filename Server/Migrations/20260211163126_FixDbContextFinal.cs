using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class FixDbContextFinal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_AfiliadoSolicitud",
                table: "AfiliadoSolicitud");

            migrationBuilder.RenameTable(
                name: "AfiliadoSolicitud",
                newName: "AfiliadosSolicitudes");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AfiliadosSolicitudes",
                table: "AfiliadosSolicitudes",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_AfiliadosSolicitudes",
                table: "AfiliadosSolicitudes");

            migrationBuilder.RenameTable(
                name: "AfiliadosSolicitudes",
                newName: "AfiliadoSolicitud");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AfiliadoSolicitud",
                table: "AfiliadoSolicitud",
                column: "Id");
        }
    }
}
