using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Routing;

namespace TMSAPI.Helper
{
    public class ValidationFilter : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            //before contrller
            if (!context.ModelState.IsValid)
            {
                var errorsInModelState = context.ModelState
                    .Where(x => x.Value.Errors.Count > 0)
                    .ToDictionary(kvp => kvp.Key, kvp => kvp.Value.Errors.Select(x => x.ErrorMessage).ToArray());

                var errorResponse = new ErrorResponse();

                foreach (var error in errorsInModelState)
                {
                    foreach (var subError in error.Value)
                    {
                        var errorModel = new ErrorModel
                        {
                            FieldName = error.Key,
                            Message = subError
                        };

                        errorResponse.Error.Add(errorModel);
                    }
                    context.Result = new BadRequestObjectResult(errorResponse);
                    return;
                }
            }
            //ActionExecutedContext resultContext = await next();
            // resultContext.Result is set.
            // Do something after the action executes.
            //if (resultContext.Exception != null)
            //{
            //    resultContext.ExceptionHandled = true;
            //    resultContext.Result = new RedirectToRouteResult
            //       (
            //       new RouteValueDictionary(new
            //       {
            //           action = "Error",
            //           controller = "Error"
            //       }));
            //}
            await next();
            //after controller  
        }
    }
}
