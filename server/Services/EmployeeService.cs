using Microsoft.EntityFrameworkCore;
using UserAuthApi.Data;
using UserAuthApi.DTOs;
using UserAuthApi.Models;

namespace UserAuthApi.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly AppDbContext _context;

        public EmployeeService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<EmployeeDto>> GetAllAsync(string? search = null, string? department = null, string? status = null)
        {
            var query = _context.Employees.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();
                query = query.Where(e =>
                    e.FirstName.ToLower().Contains(term) ||
                    e.LastName.ToLower().Contains(term) ||
                    e.Email.ToLower().Contains(term) ||
                    e.Department.ToLower().Contains(term) ||
                    e.Position.ToLower().Contains(term));
            }

            if (!string.IsNullOrWhiteSpace(department) && !department.Equals("All", StringComparison.OrdinalIgnoreCase))
            {
                var deptTerm = department.Trim().ToLower();
                query = query.Where(e => e.Department.ToLower().Trim() == deptTerm);
            }

            if (!string.IsNullOrWhiteSpace(status) && !status.Equals("All", StringComparison.OrdinalIgnoreCase))
            {
                var statusTerm = status.Trim().ToLower();
                query = query.Where(e => e.Status.ToLower().Trim() == statusTerm);
            }

            var list = await query.OrderByDescending(e => e.CreatedAt).ToListAsync();
            return list.Select(MapToDto);
        }

        public async Task<EmployeeDto?> GetByIdAsync(int id)
        {
            var emp = await _context.Employees.FindAsync(id);
            return emp != null ? MapToDto(emp) : null;
        }

        public async Task<EmployeeDto> CreateAsync(CreateEmployeeDto dto)
        {
            var employee = new Employee
            {
                FirstName = dto.FirstName.Trim(),
                LastName = dto.LastName.Trim(),
                Email = dto.Email.Trim().ToLowerInvariant(),
                Phone = dto.Phone?.Trim() ?? "",
                Department = dto.Department.Trim(),
                Position = dto.Position.Trim(),
                Salary = dto.Salary,
                HireDate = dto.HireDate ?? DateTime.UtcNow,
                Status = string.IsNullOrWhiteSpace(dto.Status) ? "Active" : dto.Status.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return MapToDto(employee);
        }

        public async Task<EmployeeDto?> UpdateAsync(int id, UpdateEmployeeDto dto)
        {
            var emp = await _context.Employees.FindAsync(id);
            if (emp == null) return null;

            emp.FirstName = dto.FirstName.Trim();
            emp.LastName = dto.LastName.Trim();
            emp.Email = dto.Email.Trim().ToLowerInvariant();
            emp.Phone = dto.Phone?.Trim() ?? "";
            emp.Department = dto.Department.Trim();
            emp.Position = dto.Position.Trim();
            emp.Salary = dto.Salary;
            if (dto.HireDate.HasValue)
            {
                emp.HireDate = dto.HireDate.Value;
            }
            emp.Status = string.IsNullOrWhiteSpace(dto.Status) ? "Active" : dto.Status.Trim();

            await _context.SaveChangesAsync();
            return MapToDto(emp);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var emp = await _context.Employees.FindAsync(id);
            if (emp == null) return false;

            _context.Employees.Remove(emp);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<EmployeeStatsDto> GetStatsAsync()
        {
            var employees = await _context.Employees.ToListAsync();

            var totalEmployees = employees.Count;
            var activeEmployees = employees.Count(e => string.Equals(e.Status, "Active", StringComparison.OrdinalIgnoreCase));
            var onLeaveEmployees = employees.Count(e => string.Equals(e.Status, "On Leave", StringComparison.OrdinalIgnoreCase));
            var terminatedEmployees = employees.Count(e => string.Equals(e.Status, "Terminated", StringComparison.OrdinalIgnoreCase));

            var totalPayroll = employees.Sum(e => e.Salary);
            var averageSalary = totalEmployees > 0 ? employees.Average(e => e.Salary) : 0;

            var deptStats = employees
                .GroupBy(e => string.IsNullOrWhiteSpace(e.Department) ? "Unassigned" : e.Department)
                .Select(g => new DepartmentStatDto
                {
                    Department = g.Key,
                    Count = g.Count(),
                    TotalSalary = g.Sum(e => e.Salary)
                })
                .OrderByDescending(d => d.Count)
                .ToList();

            return new EmployeeStatsDto
            {
                TotalEmployees = totalEmployees,
                ActiveEmployees = activeEmployees,
                OnLeaveEmployees = onLeaveEmployees,
                TerminatedEmployees = terminatedEmployees,
                TotalMonthlyPayroll = totalPayroll,
                AverageSalary = Math.Round(averageSalary, 2),
                DepartmentStats = deptStats
            };
        }

        public async Task<byte[]> ExportCsvAsync()
        {
            var employees = await _context.Employees.OrderBy(e => e.Id).ToListAsync();
            var builder = new System.Text.StringBuilder();

            builder.AppendLine("ID,First Name,Last Name,Email,Phone,Department,Position,Salary,Hire Date,Status,Created At");

            foreach (var emp in employees)
            {
                var line = $"\"{emp.Id}\",\"{EscapeCsv(emp.FirstName)}\",\"{EscapeCsv(emp.LastName)}\",\"{EscapeCsv(emp.Email)}\",\"{EscapeCsv(emp.Phone)}\",\"{EscapeCsv(emp.Department)}\",\"{EscapeCsv(emp.Position)}\",\"{emp.Salary:F2}\",\"{emp.HireDate:yyyy-MM-dd}\",\"{EscapeCsv(emp.Status)}\",\"{emp.CreatedAt:yyyy-MM-dd HH:mm:ss}\"";
                builder.AppendLine(line);
            }

            return System.Text.Encoding.UTF8.GetBytes(builder.ToString());
        }

        private static string EscapeCsv(string str)
        {
            if (string.IsNullOrEmpty(str)) return "";
            return str.Replace("\"", "\"\"");
        }

        private static EmployeeDto MapToDto(Employee emp)
        {
            return new EmployeeDto
            {
                Id = emp.Id,
                FirstName = emp.FirstName,
                LastName = emp.LastName,
                Email = emp.Email,
                Phone = emp.Phone,
                Department = emp.Department,
                Position = emp.Position,
                Salary = emp.Salary,
                HireDate = emp.HireDate,
                Status = emp.Status,
                CreatedAt = emp.CreatedAt
            };
        }
    }
}
