using Microsoft.AspNetCore.Mvc;

namespace Celumarket.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new
            {
                status = "ok",
                app = "Celumarket.API",
                timestampUtc = DateTime.UtcNow
            });
        }
    }
}
