namespace backend.Models
{
    public class Feedback
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? Message { get; set; }
        public string? CreatedAt { get; set; }
    }
}