using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TournamentAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddCreatedByUserIdToMatch : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                table: "Matches",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "Matches");
        }
    }
}
