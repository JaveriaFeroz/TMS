using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace TMSAPI.Helper
{
    public static class _legacyagDateTimeHelper
    {
        public static T updateTimeZone<T>(T data)
        {
            try
            {
                PropertyInfo[] propT = typeof(T).GetProperties().Where(p => 
                    p.PropertyType == typeof(DateTime?) || p.PropertyType == typeof(DateTime)).ToArray();
                foreach (PropertyInfo pi in propT)
                {
                    if(DateTime.TryParse(typeof(T).GetProperty(pi.Name).GetValue(data).ToString(), out DateTime dt))
                    {
                        typeof(T).GetProperty(pi.Name).SetValue(data, dt.ToLocalTime());
                    }
                }
                return data;
            }
            catch(Exception) { throw; }
        }            
    }
}