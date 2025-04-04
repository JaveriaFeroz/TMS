namespace TMSAPI.Areas.Operation.Models
{
    public class Event
    {
        #region private properties
        //private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short EventId { get; set; }
        public string EventName { get; set; }
        #endregion

        #region constructor
        public Event()
        {
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            // no implementation
        }
        #endregion
    }
}