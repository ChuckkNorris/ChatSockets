using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace ChatSocketsServer.Modules
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task YellIfMessageHasNeat(string message) {
          if (message.ToLower().Contains("neat")) {
            await Clients.All.SendAsync("ReceiveYell", "THAT MESSAGE IS PRETTY NEAT!");
          } else {
            await Clients.All.SendAsync("ReceiveYell", "Boring...");
          }
          
        }
    }
}