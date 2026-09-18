using UserAuthApi.DTOs;

namespace UserAuthApi.Services
{
    public interface IEmployeeService
    {
        Task<IEnumerable<EmployeeDto>> GetAllAsync(string? search = null, string? department = null, string? status = null);
        Task<EmployeeDto?> GetByIdAsync(int id);
        Task<EmployeeDto> CreateAsync(CreateEmployeeDto dto);
        Task<EmployeeDto?> UpdateAsync(int id, UpdateEmployeeDto dto);
        Task<bool> DeleteAsync(int id);
        Task<EmployeeStatsDto> GetStatsAsync();
        Task<byte[]> ExportCsvAsync();
    }
}
