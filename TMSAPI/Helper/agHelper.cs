using System;
using System.Collections.Generic;
using System.Linq;

namespace TMSAPI.Helper
{
    public class agHelper
    {
        internal static bool InList<T>(T value, params T[] valuesToCompare)
        {
            if (valuesToCompare.Length == 0)
                return false;
            foreach (T pv in valuesToCompare)
            {
                if (pv.Equals(value))
                    return true;
            }
            return false;
        }

        internal static string SuffixRF(string _fieldName)
        {
            return "=> " + _fieldName + " is a required field";
        }

        /// <summary>
        /// Suffix field name with standard validation text i.e. 'xxx' must be +ve and non Zero
        /// </summary>
        /// <param name="_fieldName">The field name/pro[erty to be prefixed for fixed validation text</param>
        /// <returns></returns>
        internal static string SuffixgtZero(string _fieldName)
        {
            return "=> " + _fieldName + " must be +ve and greater than Zero";
        }

        /// <summary>
        /// Suffix field name with standard validation text i.e. 'xxx' must be Zero or +ve value
        /// </summary>
        /// <param name="_fieldName">The field name/property to be prefixed for fixed validation text</param>
        /// <returns></returns>
        internal static string SuffixZero(string _fieldName)
        {
            return "=> " + _fieldName + " must be Zero or +ve value";
        }

        /// <summary>
        /// Suffix field name with standard validation text i.e. 'xxx' must not be zero
        /// </summary>
        /// <param name="_fieldName">The field name/property to be prefixed for fixed validation text</param>
        /// <returns></returns>
        internal static string SuffixNZ(string _fieldName)
        {
            return "=> " + _fieldName + " must be non-Zero";
        }

        /// <summary>
        /// Suffix field name with standard validation text i.e. 'xxx' must be newer than current date
        /// </summary>
        /// <param name="_fieldName">The field name/property to be prefixed for fixed validation text</param>
        /// <returns></returns>
        internal static string SuffixgtCurrent(string _fieldName)
        {
            return "=> " + _fieldName + " must be newer than current Date";
        }

        /// <summary>
        /// Suffix field name with standard validation text i.e. 'xxx' must be older than current date
        /// </summary>
        /// <param name="_fieldName">The field name/property to be prefixed for fixed validation text</param>
        /// <returns></returns>
        internal static string SuffixltCurrent(string _fieldName)
        {
            return "=> " + _fieldName + " must be older than current Date";
        }

        /// <summary>
        /// Suffix field name with standard validation text i.e. 'yyy' must be greater than 'xxx'
        /// </summary>
        /// <param name="_fieldName1">The field to be lesser</param>
        /// <param name="_fieldName2">The field to be greater</param>
        /// <returns></returns>
        internal static string Suffixgt(string _fieldName1, string _fieldName2)
        {
            return "=> " + _fieldName2 + " must be greater than " + _fieldName1;
        }

        /// <summary>
        /// Suffix field name with standard validation text i.e. 'xxx' must be older than current date
        /// </summary>
        /// <param name="_fieldName">The field name/property to be prefixed for fixed validation text</param>
        /// <returns></returns>
        internal static string SuffixDifferent(string _fieldName1, string _fieldName2)
        {
            return "=> " + _fieldName1 + " & " + _fieldName2 + " must not be same";
        }

        /// <summary>
        /// Suffix field name with proper email format
        /// </summary>
        /// <param name="_fieldName">The field name/proerty to be prefix for fixed validation text</param>
        /// <returns></returns>
        internal static string EmailFormat(string _fieldName)
        {
            return "=> Please enter " + _fieldName + " in valid format like someone@somewhere.com";
        }

        /// <summary>
        /// Suffix field name with proper phone / mobile number
        /// </summary>
        /// <param name="_fieldName">The field name/proerty to be prefix for fixed validation text</param>
        /// <returns></returns>
        internal static string CallFormat(string _fieldName)
        {
            return "=> Please enter " + _fieldName + " in valid format like xxxx-xxxxxxx";
        }

        internal static string MaskPassword(string pValue, bool pEncrypt)
        {
            string strPwd = "";
            int intCntr = 1;
            if (pEncrypt)
            {
                foreach (char c in pValue)
                {
                    strPwd += Convert.ToByte(c) - 25 + intCntr++;
                    strPwd += ",";
                }
            }
            else
            {
                for (int i = 0; i < pValue.Trim().Length;)
                {
                    strPwd += Convert.ToChar(Convert.ToByte(pValue[i..pValue.IndexOf(",", i)]) + 25 - intCntr++);
                    i = pValue.IndexOf(",", i) + 1;
                }
            }
            return strPwd;
        }

        internal static bool IsComplex(string pPassword)
        {
            bool hasInt = false;
            bool hasSC = false;
            bool hasAlphaSmall = false;
            bool hasAlphaCapital = false;
            char[] cPassword = pPassword.ToCharArray();
            foreach (char c in cPassword)
            {
                if (Convert.ToByte(c) >= 48 && Convert.ToByte(c) <= 57)
                    hasInt = true;
                if (Convert.ToByte(c) >= 65 && Convert.ToByte(c) <= 90)
                    hasAlphaCapital = true;
                if (Convert.ToByte(c) >= 97 && Convert.ToByte(c) <= 122)
                    hasAlphaSmall = true;
                if ((Convert.ToByte(c) < 48 || Convert.ToByte(c) > 122) || (Convert.ToByte(c) > 57 && Convert.ToByte(c) < 65)
                    || (Convert.ToByte(c) > 90 && Convert.ToByte(c) < 97))
                    hasSC = true;
            }
            if (!hasInt || !hasSC || !hasAlphaCapital || !hasAlphaSmall)
            {
                string msg = "Password must contain combination of Capital & Small Alphabet, Number and Special Character " +
                   "e.g. 20-Dec-79 or AqT-607 Description of Failure: Your Password doesn't contain" + (hasInt ? "" : "Number (Valid values are 0-9)") +
                   (hasAlphaCapital ? "" : "Capital Alphabet (Valid values are A-Z)") + (hasAlphaSmall ? "" : "Small Alphabet (Valid values are a-z)") +
                   (hasSC ? "" : "Special characters (Valid values are any character other than Alphabet and Number)") + "Please try new password using above mentioned criteria" + "," + "Weak Password";
                throw new Exception(msg);
            }
            return (hasInt && hasSC && hasAlphaCapital && hasAlphaSmall);
        }

        /// <summary>
        /// To chopoff unnecessary database info and technical details in the error msg to make it readable and secure
        /// </summary>
        /// <param name="_message">Complete Message Contents</param>
        /// <returns></returns>
        internal static string ExtractDBMsg(string _message)
        {
            try
            {
                if (_message.IndexOf("\"") > 0)
                    return "=> " + _message.Substring(_message.IndexOf("\"") + 1, _message.LastIndexOf("\"", _message.IndexOf("\"")) - 2);
                else
                    return "=> " + _message;
            }
            catch (Exception)
            {
                return "=> " + _message;
            }
        }

        internal static Exception XLColMissing(string _fieldName, string _sheetName)
        {
            return new Exception(_fieldName + " column missing from '" + _sheetName + "' sheet");
        }

        /// <summary>
        /// returns list of objects where Edit = true
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="details"></param>
        /// <returns></returns>
        internal static IEnumerable<T> GetEdits<T>(List<T> details)
        {
            return details.Where(x => ((dynamic)x).Edit);
        }

        /// <summary>
        /// returns list of objects where atleast one of Add, Edit or Delete = true
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="_details"></param>
        /// <returns></returns>
        internal static IEnumerable<T> GetChanges<T>(List<T> _details)
        {
            return _details.Where(x => ((dynamic)x).Add || ((dynamic)x).Edit || ((dynamic)x).Delete);
        }

        /// <summary>
        /// Evaluate object and return number if object is not db null else return null
        /// </summary>
        /// <param name="obj">Object to evaluate</param>
        /// <returns></returns>
        internal static int? iDBNull(object obj)
        {
            if (obj != DBNull.Value)
                return Convert.ToInt32(obj);
            else
                return null;
        }

        /// <summary>
        /// Evaluate object and return short if object is not db null else return null
        /// </summary>
        /// <param name="obj">Object to evaluate</param>
        /// <returns></returns>
        internal static short? sDBNull(object obj)
        {
            if (obj != DBNull.Value)
                return Convert.ToInt16(obj);
            else
                return null;
        }

        /// <summary>
        /// Evaluate object and return decimal if object is not db null else return null
        /// </summary>
        /// <param name="obj">Object to evaluate</param>
        /// <returns></returns>
        internal static decimal? dDBNull(object obj)
        {
            if (obj != DBNull.Value)
                return Convert.ToDecimal(obj);
            else
                return null;
        }

        /// <summary>
        /// Evaluate object and return datetime if object is not db null else return null
        /// </summary>
        /// <param name="obj">Object to evaluate</param>
        /// <returns></returns>
        internal static DateTime? dtDBNull(object obj)
        {
            if (obj != DBNull.Value)
                return Convert.ToDateTime(obj);
            else
                return null;
        }

        internal static int NVL(object value, int alternateValue)
        {
            if (value == null || value == DBNull.Value)
                return alternateValue;
            else
                return Convert.ToInt32(value);
        }

        internal static double NVL(object value, double alternateValue)
        {
            if (value == null || value == DBNull.Value)
                return alternateValue;
            else
                return Convert.ToDouble(value);
        }

        internal static decimal NVL(object value, decimal alternateValue)
        {
            if (value == null || value == DBNull.Value)
                return alternateValue;
            else
                return Convert.ToDecimal(value);
        }

        internal static bool NVL(object value, bool alternateValue)
        {
            if (value == null || value == DBNull.Value)
                return alternateValue;
            else
                return Convert.ToBoolean(value);
        }
    }
}