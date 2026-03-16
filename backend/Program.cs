var builder = WebApplication.CreateBuilder(args);

// MongoDB settings
builder.Services.Configure<backend.Settings.MongoDatabaseSettings>(
    builder.Configuration.GetSection("MongoDatabase"));

builder.Services.AddSingleton(sp =>
    sp.GetRequiredService<Microsoft.Extensions.Options.IOptions<backend.Settings.MongoDatabaseSettings>>().Value);

builder.Services.AddSingleton<backend.Services.BookService>();

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
