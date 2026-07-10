using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public record RegisterRequest(
    [Required] string Nome, 
    [Required] string Usuario, 
    [Required] string Senha
);

public record LoginRequest(
    [Required] string Usuario, 
    [Required] string Senha
);

public record AuthResponse(
    string Token, 
    Guid UsuarioId, 
    string Nome
);
