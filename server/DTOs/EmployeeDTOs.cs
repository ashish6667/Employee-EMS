using System.ComponentModel.DataAnnotations;

namespace UserAuthApi.DTOs
{
    public class EmployeeDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName => $"{FirstName} {LastName}";
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public decimal Salary { get; set; }
        public DateTime HireDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class CreateEmployeeDto
    {
        [Required(ErrorMessage = "First Name is required.")]
        [StringLength(50, MinimumLength = 2)]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last Name is required.")]
        [StringLength(50, MinimumLength = 2)]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Department is required.")]
        public string Department { get; set; } = "Engineering";

        [Required(ErrorMessage = "Position / Job Title is required.")]
        public string Position { get; set; } = string.Empty;

        [Range(0, 10000000, ErrorMessage = "Salary must be a positive number.")]
        public decimal Salary { get; set; }

        public DateTime? HireDate { get; set; }

        public string Status { get; set; } = "Active";
    }

    public class UpdateEmployeeDto
    {
        [Required(ErrorMessage = "First Name is required.")]
        [StringLength(50, MinimumLength = 2)]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last Name is required.")]
        [StringLength(50, MinimumLength = 2)]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Department is required.")]
        public string Department { get; set; } = string.Empty;

        [Required(ErrorMessage = "Position is required.")]
        public string Position { get; set; } = string.Empty;

        [Range(0, 10000000)]
        public decimal Salary { get; set; }

        public DateTime? HireDate { get; set; }

        public string Status { get; set; } = "Active";
    }

    public class DepartmentStatDto
    {
        public string Department { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal TotalSalary { get; set; }
    }

    public class EmployeeStatsDto
    {
        public int TotalEmployees { get; set; }
        public int ActiveEmployees { get; set; }
        public int OnLeaveEmployees { get; set; }
        public int TerminatedEmployees { get; set; }
        public decimal TotalMonthlyPayroll { get; set; }
        public decimal AverageSalary { get; set; }
        public List<DepartmentStatDto> DepartmentStats { get; set; } = new();
    }
}

