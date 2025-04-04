using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace TMSAPI.Helper
{
    public class JsonDateTimeConverter : JsonConverter<DateTime>
    {
        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            //return DateTime.Parse(DateTimeOffset.Parse(reader.GetString()).ToOffset(TimeSpan.FromHours(5)).DateTime.ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ssZ"));
            return DateTime.Parse(reader.GetString());
        }

        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            //writer.WriteStringValue(value.ToUniversalTime().ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ssZ"));
            writer.WriteStringValue(value);
        }
    }
}