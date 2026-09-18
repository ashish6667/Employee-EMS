using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserAuthApi.DTOs;
using UserAuthApi.Services;

namespace UserAuthApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeesController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] string? department, [FromQuery] string? status)
        {
            var employees = await _employeeService.GetAllAsync(search, department, status);
            return Ok(employees);
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var stats = await _employeeService.GetStatsAsync();
            return Ok(stats);
        }

        [HttpGet("export")]
        public async Task<IActionResult> ExportCsv()
        {
            var csvBytes = await _employeeService.ExportCsvAsync();
            var fileName = $"employees_export_{DateTime.UtcNow:yyyyMMdd_HHmmss}.csv";
            return File(csvBytes, "text/csv", fileName);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var emp = await _employeeService.GetByIdAsync(id);
            if (emp == null) return NotFound(new { message = $"Employee with ID {id} not found." });
            return Ok(emp);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateEmployeeDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var created = await _employeeService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateEmployeeDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updated = await _employeeService.UpdateAsync(id, dto);
            if (updated == null)
            {
                return NotFound(new { message = $"Employee with ID {id} not found." });
            }

            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _employeeService.DeleteAsync(id);
            if (!success)
            {
                return NotFound(new { message = $"Employee with ID {id} not found." });
            }

            return Ok(new { message = "Employee record deleted successfully." });
        }
    }
}
