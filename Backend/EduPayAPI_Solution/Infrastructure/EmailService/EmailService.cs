
// public class EmailService : IEmailService
// {
//     private readonly IConfiguration _configuration;
//     private readonly ILogger _logger;

//     public EmailService(IConfiguration configuration)
//     {
//         _configuration = configuration;
//         _logger = Log.ForContext<EmailService>();
//     }

//     public async Task SendAsync(string to, string subject, string htmlBody)
//     {
//         try
//         {
//             var host = _configuration["Email:Host"];
//             var port = int.Parse(_configuration["Email:Port"]!);
//             var username = _configuration["Email:Username"];
//             var password = _configuration["Email:Password"];
//             var from = _configuration["Email:From"];

//             var smtpClient = new SmtpClient(host, port)
//             {
//                 Credentials = new NetworkCredential(username, password),
//                 EnableSsl = true,
//                 UseDefaultCredentials = false
//             };

//             var mail = new MailMessage
//             {
//                 From = new MailAddress(from!),
//                 Subject = subject,
//                 Body = htmlBody,
//                 IsBodyHtml = true
//             };

//             mail.To.Add(to);

//             _logger.Information("Sending email to {Email}", to);

//             await smtpClient.SendMailAsync(mail);

//             _logger.Information("Email sent successfully to {Email}", to);
//         }
//         catch (Exception ex)
//         {
//             _logger.Error(ex, "Failed to send email to {Email}", to);
//         }
//     }
// }

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger _logger;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
        _logger = Log.ForContext<EmailService>();
    }

    public async Task SendAsync(string to, string subject, string htmlBody)
    {
        try
        {
            var host = _configuration["Email:Host"];
            var port = int.Parse(_configuration["Email:Port"]!);
            var username = _configuration["Email:Username"];
            var password = _configuration["Email:Password"];
            var from = _configuration["Email:From"];

            using var smtpClient = new SmtpClient(host, port)
            {
                Credentials = new NetworkCredential(username, password),
                EnableSsl = true,
                UseDefaultCredentials = false,
                DeliveryMethod = SmtpDeliveryMethod.Network,

                // 🔥 QUAN TRỌNG: tăng timeout để tránh Railway delay
                Timeout = 120000
            };

            using var mail = new MailMessage
            {
                From = new MailAddress(from!),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true
            };

            mail.To.Add(to);

            _logger.Information("Sending email to {Email}", to);

            await smtpClient.SendMailAsync(mail);

            _logger.Information("Email sent successfully to {Email}", to);
        }
        catch (Exception ex)
        {
            _logger.Error(ex, "Failed to send email to {Email}", to);
        }
    }
}