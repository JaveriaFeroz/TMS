using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace TMSAPI.Areas.Common.Models
{
    public class Menu
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short MenuId { get; set; }
        public string MenuName { get; set; }
        public short? ParentId { get; set; }
        public string SubGroup { get; set; }
        public short SortOrder { get; set; }
        public string Route { get; set; }
        public short? WorkFlowId { get; set; }
        #endregion

        #region constructor
        public Menu()
        {
        }

        public Menu(short _menuId, string _menuName, object _parentId, string _subGroup, 
            object _sortOrder, object _route, object _workflowId)
        {
            try
            {
                MenuId = _menuId;
                MenuName = _menuName;
                if (_parentId != DBNull.Value)
                    ParentId = Convert.ToInt16(_parentId);
                SubGroup = _subGroup;
                if (_sortOrder != DBNull.Value)
                    SortOrder = Convert.ToInt16(_sortOrder);
                if (_route != DBNull.Value)
                    Route = _route.ToString();
                if (_workflowId != DBNull.Value)
                    WorkFlowId = Convert.ToInt16(_workflowId);
            }
            catch (Exception)
            { throw; }
        }
        #endregion

        #region internal methods
        internal static List<Menu> Get(string _userId)
        {
            try
            {
                List<Menu> lstMenu = new List<Menu>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetMenuByUserId"))
                {
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, _userId);
                    using DataTable dt = db.ExecuteDataSet(dbCommand).Tables[0];
                    if (dt != null)
                    {
                        foreach (DataRow dr in dt.Rows)
                        {
                            lstMenu.Add(new Menu(
                                Convert.ToInt16(dr["OptionId"]),
                                dr["OptionName"].ToString(),
                                dr["ParentOptionId"],
                                dr["OptionSubGroup"].ToString(),
                                dr["OptionSequence"],
                                dr["Route"], dr["workflowId"]));
                        }
                    }
                }
                return lstMenu;
            }
            catch (Exception) { throw; }
        }
        #endregion
    }
}