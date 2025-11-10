using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WastebinController : ControllerBase
    {
        private readonly DataContext _context;

        public WastebinController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Wastebin
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Wastebin>>> GetWastebins()
        {
            var wastebins = await _context.Wastebins.ToListAsync();
            if (wastebins == null)
            {
                return NotFound();
            }
            return wastebins;
        }

        // GET: api/Wastebin/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Wastebin>> GetWastebin(int id)
        {
            var wastebin = await _context.Wastebins.FindAsync(id);

            if (wastebin == null)
            {
                return NotFound();
            }

            return wastebin;
        }

        // GET: api/Wastebin/5
        [HttpGet("byUser/{id}")]
        public async Task<ActionResult<IEnumerable<Wastebin>>> GetWastebinByUserId(int id)
        {
            var wastebins = await _context.Wastebins.Where(a => a.UserId == id).ToListAsync();

            if (wastebins == null)
            {
                return NotFound();
            }

            return wastebins;
        }

        // PUT: api/Wastebin/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<ActionResult<Wastebin>> PutWastebin(int id, Wastebin wastebin)
        {
            if (id != wastebin.Id)
            {
                return BadRequest();
            }

            _context.Entry(wastebin).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WastebinExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            var updatedWastebin = await _context.Wastebins.FindAsync(id);
            return updatedWastebin;
        }

        // POST: api/Wastebin
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Wastebin>> Add(Wastebin wastebin)
        {
            _context.Wastebins.Add(wastebin);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetWastebin", new { id = wastebin.Id }, wastebin);
        }

        // DELETE: api/Wastebin/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var wastebin = await _context.Wastebins.FindAsync(id);
            if (wastebin == null)
            {
                return NotFound();
            }

            _context.Wastebins.Remove(wastebin);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool WastebinExists(int id)
        {
            return _context.Wastebins.Any(e => e.Id == id);
        }
    }
}
