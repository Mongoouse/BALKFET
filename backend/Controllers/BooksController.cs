using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly BookService _bookService;

        public BooksController(BookService bookService)
        {
            _bookService = bookService;
        }

        [HttpGet]
        public ActionResult<List<Book>> Get() => _bookService.Get();

        [HttpGet("{id:length(24)}")]
        public ActionResult<Book> Get(string id)
        {
            var book = _bookService.Get(id);
            if (book is null)
            {
                return NotFound();
            }
            return book;
        }

        [HttpPost]
        public ActionResult<Book> Create(Book book)
        {
            _bookService.Create(book);
            return CreatedAtAction(nameof(Get), new { id = book.Id }, book);
        }

        [HttpPut("{id:length(24)}")]
        public IActionResult Update(string id, Book bookIn)
        {
            var existing = _bookService.Get(id);
            if (existing is null)
            {
                return NotFound();
            }

            bookIn.Id = existing.Id;
            _bookService.Update(id, bookIn);
            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public IActionResult Delete(string id)
        {
            var book = _bookService.Get(id);
            if (book is null)
            {
                return NotFound();
            }
            _bookService.Remove(id);
            return NoContent();
        }
    }
}
