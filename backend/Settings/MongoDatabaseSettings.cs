namespace backend.Settings
{
    public class MongoDatabaseSettings
    {
        public string ConnectionString { get; set; } = null!;
        public string DatabaseName { get; set; } = null!;
        public string BooksCollectionName { get; set; } = "Books";
    }
}
