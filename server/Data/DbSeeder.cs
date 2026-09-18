using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using UserAuthApi.Models;

namespace UserAuthApi.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            // Ensure employees table exists even if database was created previously
            try
            {
                await context.Database.ExecuteSqlRawAsync(@"
                    CREATE TABLE IF NOT EXISTS `employees` (
                        `Id` int NOT NULL AUTO_INCREMENT,
                        `FirstName` varchar(50) NOT NULL,
                        `LastName` varchar(50) NOT NULL,
                        `Email` varchar(150) NOT NULL,
                        `Phone` varchar(20) NOT NULL DEFAULT '',
                        `Department` varchar(50) NOT NULL DEFAULT 'Engineering',
                        `Position` varchar(100) NOT NULL,
                        `Salary` decimal(18,2) NOT NULL,
                        `HireDate` datetime(6) NOT NULL,
                        `Status` varchar(20) NOT NULL DEFAULT 'Active',
                        `CreatedAt` datetime(6) NOT NULL,
                        PRIMARY KEY (`Id`),
                        UNIQUE KEY `IX_employees_Email` (`Email`)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                ");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Database Seeder Note] Auto table creation check: {ex.Message}");
            }

            // Cleanup any previous sample/dummy employees created during seeding
            try
            {
                await context.Database.ExecuteSqlRawAsync(@"DELETE FROM `employees` WHERE `Email` LIKE '%@company.com';");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Database Seeder Note] Dummy employee cleanup check: {ex.Message}");
            }

            if (!context.Users.Any())
            {
                var defaultUser = new User
                {
                    FullName = "Admin User",
                    Email = "admin@ems.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow
                };
                context.Users.Add(defaultUser);
                await context.SaveChangesAsync();
                Console.WriteLine("[Database Seeder] Created default admin user: admin@ems.com / Admin123!");
            }
        }
    }
}
