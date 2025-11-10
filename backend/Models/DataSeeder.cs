namespace backend.Models
{
    public static class DataSeeder
    {
        public static void Seed(DataContext context)
        {
            if (!context.Users.Any())
            {
                context.Users.AddRange(
                    new User { Name = "Edward Perry", Email = "edward.perry@email.com", Phone = "Finance" },
                    new User { Name = "Josephine Drake", Email = "josephine.drake@email.com", Phone = "Finance" }
                );
                context.SaveChanges();
            }
        }
    }
}
