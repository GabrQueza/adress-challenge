using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Endereco
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(9)]
    public string Cep { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(150)]
    public string Logradouro { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string? Complemento { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Bairro { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string Cidade { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(2)]
    public string Uf { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(20)]
    public string Numero { get; set; } = string.Empty;
    
    [Required]
    public Guid UsuarioId { get; set; }
    
    public Usuario? Usuario { get; set; }
}
