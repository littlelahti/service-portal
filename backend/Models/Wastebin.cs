namespace backend.Models
{
    public class Wastebin
    {
        public int Id { get; set; }
        public string? Address { get; set; }
        public string? EmptyingSchedule { get; set; }
        public DateTime LastEmptiedAt { get; set; }
        public int UserId { get; set; }
    }
}