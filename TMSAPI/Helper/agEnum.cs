using System.ComponentModel;

namespace TMSAPI.Helper
{
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE1006:Naming Styles", Justification = "<not needed as it is supposed to be named differently>")]
    public class agEnums
    {
        public enum PeriodType { Operational = 1, GL = 2, AR = 3, AP = 4 };
        public enum AccountType { Reporting = 1, SubReporting = 2, Control = 3, Subsidiary = 4 };
        public enum AuthenticationStatus { Successful = 1, InvalidUserId = 2, InvalidPassword = 3, ForcePasswordChange = 4, UserIdDisabled = 5, }
        public enum WorkFlow
        {
            CoreInvoice = 51, FixedCost52, AccessorialInvoice = 53, DebitNote = 54, CreditNote = 55, GroupInvoice = 56, OtherChargesInvoices = 57,
            DetentionInvoice = 58, ARInvoice = 61, JournalReceipt = 62, Receipt = 63
        }
        public enum WorkFlowState
        {
            [Description("New")]
            New = 0,

            [Description("Saved")]
            Saved = 1,

            [Description("Submitted For Approval")]
            SubmittedForApproval = 2,

            [Description("Approved")]
            Approved = 3,

            [Description("Rejected")]
            Rejected = 4,

            [Description("Declined")]
            Declined = 5,
            [Description("Resolved By Work Shop")]
            ResolvedByWorkShop = 6,

            [Description("Acknowledged By Operation")]
            AcknowledgedByOperation = 7,

            [Description("Rejected By Operation")]
            RejectedByOperation = 8,

            [Description("Transferred (InTransit)")]
            TransferredInTransit = 9,

            [Description("Received")]
            Received = 10
        }

        public enum ParentDocumentType
        {
            None = 0,
            PurchaseRequisition = 1,
            PurchaseOrder = 2,
            WorkOrder = 3,
            MaterialRequest = 4,
            GoodsReceiptNote = 5,
            MaterialIssuance = 6,
            InventoryAdjustment = 7,
            InventoryTransfer = 8,
            ServiceRequest = 9
        }

        public enum DocumentType
        {
            None = 0,
            PRNonInventory = 1,
            PRInventory = 2,
            MR = 3,
            WOPeriodic = 4,
            WOMinorMaintenance = 5,
            WOMajorMaintenance = 6,
            MRFM = 7,
            MRTS = 8,
            MRRF = 9,
            MRSD = 10
        }

        public enum Errors
        {
            None = 0,
            AlreadyApproved = 1,
            AlreadySubmitted = 2,
            Concurrency = 3,
            MultipleApprovers = 4,
            NoProcurementHeadExists = 5,
            NoApproverExists = 6,
            ApprovalLimit = 7
        }

        public enum ReceiptType
        {
            None = 0,
            FreshReceipt = 1,
            ReturnFromWorkshop = 2,
            BranchTransfer = 3
        }

        public enum Priority
        {
            None = 0,
            High = 1,
            [Description("Very High")]
            VeryHigh = 2
        }

        public enum IssueType
        {
            None = 0,
            [Description("Against Material Request")]
            AgainstMaterialRequest = 1,
            [Description("Against Purchase Return")]
            AgainstPurchaseReturn = 2,
            [Description("Against Work Order")]
            AgainstWorkOrder = 3,
            [Description("Against Branch Transfer")]
            AgainstBranchTransfer = 4
        }

        public enum SVRState
        {
            [Description("New")]
            New = 0,
            [Description("Saved")]
            Saved = 1,
            [Description("Submitted to Workshop")]
            SubmittedtoWorkshop = 2,
            [Description("Returned by Workshop")]
            ReturnedbyWorkshop = 3,
            [Description("Resolved")]
            Resolved = 4,
            [Description("Cancelled")]
            Cancelled = 5
        }

        public enum WorkOrderState
        {
            [Description("New")]
            New = 0,

            [Description("Saved")]
            Saved = 1,

            [Description("Submitted For Approval")]
            SubmittedForApproval = 2,

            [Description("Submitted To WorkShop")]
            SubmittedToWorkShop = 3,

            [Description("Rejected")]
            Rejected = 4,

            [Description("Declined")]
            Declined = 5,

            [Description("Resolved By Work Shop")]
            ResolvedByWorkShop = 6,

            [Description("Acknowledged By Operation")]
            AcknowledgedByOperation = 7,

            [Description("Rejected By Operation")]
            RejectedByOperation = 8,

            [Description("Forward To Management")]
            ForwardToManagement = 11,
        }

        public enum MaterialRequestStatus
        {
            [Description("New")]
            New = 0,

            [Description("Saved")]
            Saved = 1,

            [Description("Submitted For Approval")]
            SubmittedForApproval = 2,

            [Description("Submitted To WorkShop")]
            SubmittedToWorkShop = 3,

            [Description("Rejected")]
            Rejected = 4,

            [Description("Declined")]
            Declined = 5,

            [Description("Resolved By Work Shop")]
            ResolvedByWorkShop = 6,

            [Description("Acknowledged By Operation")]
            AcknowledgedByOperation = 7,

            [Description("Rejected By Operation")]
            RejectedByOperation = 8,
        }

        public enum RequestType
        {
            Approved = 1,
            Returned = 2,
            Rejected = 3,
        }

    }
}

