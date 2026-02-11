using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class AddAfiliadosTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_SolicitudesAfiliacion",
                table: "SolicitudesAfiliacion");

            migrationBuilder.RenameTable(
                name: "SolicitudesAfiliacion",
                newName: "AfiliadoSolicitud");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AfiliadoSolicitud",
                table: "AfiliadoSolicitud",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_AfiliadoSolicitud",
                table: "AfiliadoSolicitud");

            migrationBuilder.RenameTable(
                name: "AfiliadoSolicitud",
                newName: "SolicitudesAfiliacion");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SolicitudesAfiliacion",
                table: "SolicitudesAfiliacion",
                column: "Id");
        }
    }
}
