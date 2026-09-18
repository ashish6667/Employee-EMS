using UserAuthApi.DTOs;

namespace UserAuthApi.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
        Task<UserDto?> GetUserByIdAsync(int userId);
    }
}
