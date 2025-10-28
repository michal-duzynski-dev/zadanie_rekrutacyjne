using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DataController : ControllerBase
{
    private readonly IMemoryCache _cache;
    private static int _requestCounter = 0;
    public DataController(IMemoryCache cache)
    {
        _cache = cache;
    }

    // GET api/<DataController>/5
    [HttpGet("{id}")]
    public DataItem Get(int id)
    {
        if(IncreaseAndCheckRequestCount())
        {
            Response.StatusCode = 503; 
            return new DataItem(id,message: "Every 10th request is rejected");
        }

        string cacheKey = $"data_{id}";
        if (_cache.TryGetValue(cacheKey, out string cachedData))
        {
            return new DataItem(id,false,cachedData);
        }

        if (_cache.TryGetValue($"processing_{id}", out bool isProcessing) && isProcessing)
        {
            Response.StatusCode = 202;
            return new DataItem(id,true,message: "Processing underway, please wait.");
        }

        string processingKey = $"processing_{id}";
        _cache.Set(processingKey, true, TimeSpan.FromMinutes(2));

        Task.Run(() =>
        {
            Thread.Sleep(60000);
            var guid = Guid.NewGuid().ToString();
            _cache.Set(cacheKey, guid, TimeSpan.FromMinutes(5));
            _cache.Remove(processingKey);
        });

        Response.StatusCode = 202;
        return new DataItem(id, true, message: "Processing underway, please wait.");

    }

    private bool IncreaseAndCheckRequestCount()
    {
        _requestCounter++;
        return _requestCounter % 10 == 0;
    }
}

public class DataItem
{
    public DataItem(int userId, bool isProcessing = false, string data = null, string message = null)
    {
        UserId = userId;
        IsProcessing = isProcessing;
        Data = data;
        Message = message;

    }
    public int UserId { get; set; }
    public string Data { get; set; }
    public bool IsProcessing { get; set; }
    public string Message { get; set; }
}
