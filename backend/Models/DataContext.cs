using Microsoft.EntityFrameworkCore;

namespace backend.Models
{

    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Wastebin> Wastebins { get; set; } = null!;
        public DbSet<Feedback> Feedbacks { get; set; } = null!;

    }
}