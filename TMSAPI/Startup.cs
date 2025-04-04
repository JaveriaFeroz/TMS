using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Text;
using System.Text.Json;
using TMSAPI.Helper;

namespace TMSAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            DatabaseFactory.SetDatabases(() => new SqlDatabase(Configuration.GetConnectionString("DefaultConnection")), getDatabase);
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
              .AddJwtBearer(options =>
              {
                  options.TokenValidationParameters = new TokenValidationParameters
                  {
                      ValidateIssuer = true,
                      ValidateAudience = true,
                      ValidateLifetime = true,
                      ValidateIssuerSigningKey = true,
                      ValidIssuer = Configuration["Jwt:Issuer"],
                      ValidAudience = Configuration["Jwt:Audience"],
                      IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]))
                  };
              });

            //services.AddAuthorization(options =>
            //{
            //    options.DefaultPolicy = new AuthorizationPolicyBuilder(JwtBearerDefaults.AuthenticationScheme)
            //        .RequireAuthenticatedUser()
            //        .Build();
            //});
            services.AddAuthorization(options =>
                options.AddPolicy("ValidAccessToken", policy =>
                {
                    policy.AuthenticationSchemes.Add(JwtBearerDefaults.AuthenticationScheme);
                    policy.RequireAuthenticatedUser();
                }));

            //services.AddCors(options =>
            //{
            //    options.AddPolicy(agilitySpecificOrigins,
            //          builder =>
            //          {
            //              builder.AllowAnyOrigin()//.SetIsOriginAllowed(isOriginAllowed: _ => true)
            //                .AllowAnyHeader().AllowAnyMethod().AllowCredentials();
            //          });
            //});
            //services.AddControllers();
            //services.AddCors(options =>
            //{
            //    options.AddPolicy("CorsPolicy",
            //        builder => builder.AllowAnyOrigin()
            //          .AllowAnyMethod()
            //          .AllowAnyHeader()
            //    //.AllowCredentials()
            //    .Build());
            //});
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder
                      .WithOrigins("http://localhost:4200") // Specify your Angular app's URL
                      .AllowAnyMethod()
                      .AllowAnyHeader()
                      .AllowCredentials()
                );
            });
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.Configure<IISOptions>(options =>
            {
                options.ForwardClientCertificate = false;
                options.AutomaticAuthentication = false;
            });
            services.AddControllers(
                options =>
            {
                options.Filters.Add<ValidationFilter>();
            }
            ).AddJsonOptions(a => { a.JsonSerializerOptions.Converters.Add(new JsonDateTimeConverter()); });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {


            app.UseExceptionHandler(errorApp =>
            {
                errorApp.Run(async context =>
                {
                    context.Response.StatusCode = 500;
                    context.Response.ContentType = "application/json";

                    var exceptionHandlerPathFeature =
                        context.Features.Get<IExceptionHandlerPathFeature>();

                    if (exceptionHandlerPathFeature?.Error != null)
                    {
                        var error = exceptionHandlerPathFeature.Error;

                        // Log the full error details
                        Console.WriteLine($"Unhandled Exception: {error.Message}");
                        Console.WriteLine($"Stack Trace: {error.StackTrace}");

                        var result = JsonSerializer.Serialize(new
                        {
                            message = error.Message,
                            stackTrace = error.StackTrace
                        });

                        await context.Response.WriteAsync(result);
                    }
                });
            });

            app.UseCors("CorsPolicy");
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/error");
            }

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseAuthorization();

            app.UseAuthentication();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

        private Database getDatabase(string name)
        {
            return new SqlDatabase(Configuration.GetConnectionString("DefaultConnection"));
        }
    }
}
