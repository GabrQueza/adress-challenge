using System.Security.Claims;
using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class EnderecoController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;

        public EnderecoController(AppDbContext context, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
        }

        private Guid GetUsuarioId()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (Guid.TryParse(userIdStr, out var userId))
            {
                return userId;
            }
            throw new UnauthorizedAccessException("Usuário inválido ou não autenticado.");
        }

        [HttpGet]
        public async Task<IActionResult> GetEnderecos()
        {
            var userId = GetUsuarioId();
            var enderecos = await _context.Enderecos
                .Where(e => e.UsuarioId == userId)
                .ToListAsync();

            return Ok(enderecos);
        }

        [HttpPost]
        public async Task<IActionResult> CreateEndereco([FromBody] EnderecoRequest request)
        {
            var userId = GetUsuarioId();

            var endereco = new Endereco
            {
                UsuarioId = userId,
                Cep = request.Cep,
                Logradouro = request.Logradouro,
                Bairro = request.Bairro,
                Cidade = request.Cidade,
                Uf = request.Uf,
                Numero = request.Numero,
                Complemento = request.Complemento
            };

            _context.Enderecos.Add(endereco);
            await _context.SaveChangesAsync();

            return Ok(endereco);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEndereco(Guid id, [FromBody] EnderecoRequest request)
        {
            var userId = GetUsuarioId();

            var endereco = await _context.Enderecos
                .FirstOrDefaultAsync(e => e.Id == id && e.UsuarioId == userId);

            if (endereco == null)
                return NotFound(new { message = "Endereço não encontrado." });

            endereco.Cep = request.Cep;
            endereco.Logradouro = request.Logradouro;
            endereco.Bairro = request.Bairro;
            endereco.Cidade = request.Cidade;
            endereco.Uf = request.Uf;
            endereco.Numero = request.Numero;
            endereco.Complemento = request.Complemento;

            await _context.SaveChangesAsync();

            return Ok(endereco);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEndereco(Guid id)
        {
            var userId = GetUsuarioId();

            var endereco = await _context.Enderecos
                .FirstOrDefaultAsync(e => e.Id == id && e.UsuarioId == userId);

            if (endereco == null)
                return NotFound(new { message = "Endereço não encontrado." });

            _context.Enderecos.Remove(endereco);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Endereço deletado com sucesso." });
        }

        [HttpGet("viacep/{cep}")]
        public async Task<IActionResult> GetViaCep(string cep)
        {
            // Remove qualquer não dígito
            var cleanCep = Regex.Replace(cep, @"[^\d]", "");

            if (cleanCep.Length != 8)
                return BadRequest(new { message = "O CEP deve ter exatamente 8 dígitos numéricos." });

            var client = _httpClientFactory.CreateClient();
            var response = await client.GetAsync($"https://viacep.com.br/ws/{cleanCep}/json/");

            if (!response.IsSuccessStatusCode)
                return BadRequest(new { message = "Erro ao consultar o serviço do ViaCEP." });

            var content = await response.Content.ReadAsStringAsync();
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var viaCepResult = JsonSerializer.Deserialize<ViaCepResponse>(content, options);

            if (viaCepResult != null && viaCepResult.Erro == "true")
            {
                return NotFound(new { message = "CEP não encontrado." });
            }

            return Ok(viaCepResult);
        }
    }
}
