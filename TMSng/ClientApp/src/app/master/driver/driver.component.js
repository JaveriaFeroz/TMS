"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const FileSaver = require("file-saver");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGrid_date_component_1 = require("../../helper/agGrid-date.component");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
const driverdocument_1 = require("./driverdocument");
let DriverComponent = class DriverComponent {
    constructor(router, formbulider, svcDriver, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcDriver = svcDriver;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.optionName = 'Driver';
        this.colSearch = [
            { headerName: 'Driver Id', field: 'driverId', width: 70 },
            { headerName: 'Driver Name', field: 'driverName' },
            { headerName: 'Prime Mover', field: 'primeMover' },
            { headerName: 'CNIC', field: 'cnic' },
            { headerName: 'Branch', field: 'branch' },
            { headerName: 'Is Active ', field: 'isActive' },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.MaxDate = new Date().getDate() + 2190;
        //DOBMaxDate = new Date().getDate() - 22000;
        //DOBMinDate = new Date().getDate() - 6570;
        this.CurrentDate = new Date();
        this.DOBMaxDate = new Date();
        this.DOBMinDate = new Date();
        this.Date = new Date();
        this.driverImg = null;
        this.frameworkComponents = {
            agDateEditor: agGrid_date_component_1.agGridDateEditor,
        };
        this.allowImgUpload = false;
        this.config = { childList: true, subtree: true };
        this.callback = function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.addedNodes.length > 0) {
                    if (mutation.addedNodes[0].id === 'btnSave' && document.getElementById('btnEdit').disabled === false) {
                        mutation.addedNodes[0].disabled = true;
                    }
                }
            }
        };
        this.observer = new MutationObserver(this.callback);
        //#region Driver Training Grid Definition & functions
        this.colTraining = [
            {
                headerName: 'Driver Training',
                children: [
                    {
                        headerName: "Training Title", field: "trainingId", width: 200,
                        cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(), cellEditorParams: { source: 'Training', class: "200" },
                        valueFormatter: agGridHelper_1.agGridHelper.getTrainingName,
                    },
                    {
                        headerName: "Trainer", field: "trainerId", width: 200,
                        cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(), cellEditorParams: { source: 'Trainer', class: "200" },
                        valueFormatter: agGridHelper_1.agGridHelper.getTrainerName,
                    },
                    {
                        headerName: "Start Date", field: "startDate", width: 105,
                        cellEditor: 'agDateEditor', editable: true, valueFormatter: agGridHelper_1.agGridHelper.dateFormatter
                    },
                    {
                        headerName: "End Date", field: "endDate", width: 105,
                        cellEditor: 'agDateEditor', editable: true, valueFormatter: agGridHelper_1.agGridHelper.dateFormatter
                    },
                    {
                        headerName: "Due Date", field: "dueDate", width: 105,
                        cellEditor: 'agDateEditor', editable: true, valueFormatter: agGridHelper_1.agGridHelper.dateFormatter
                    },
                    { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
                ]
            }
        ];
        //#endregion 
        //#region Document Detail Grid Definition & functions
        this.colDocument = [
            {
                headerName: 'Driver Medical',
                children: [
                    { headerName: "DocumentId", field: "detailId", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Document Type", field: "typeName", width: 300, editable: false, },
                    {
                        headerName: "File Name", field: "fileName", width: 300, cellRenderer: params => {
                            return "<a  class='Template'  title='Click to view or download the document'>" + params.value + "</a>";
                        },
                        cellStyle: { textDecoration: 'underline', color: 'blue', bold: true, cursor: 'pointer' }
                    },
                    { headerName: "Add", field: "isNew", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Edit", field: "Edit", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Delete", field: "isDeleted", hide: true, suppressColumnsToolPanel: true }
                ]
            }
        ];
        //#endregion 
        //#region Driver Medical Test Grid Definition & functions
        this.colMedical = [
            {
                headerName: 'Driver Medical',
                children: [
                    {
                        headerName: "Medical Test", field: "testId", width: 200,
                        cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(), cellEditorParams: { source: 'MedicalTest', class: "200" },
                        valueFormatter: agGridHelper_1.agGridHelper.getMedicalTestName,
                    },
                    {
                        headerName: "Test Date", field: "testDate", width: 105,
                        cellEditor: 'agDateEditor', editable: true, valueFormatter: agGridHelper_1.agGridHelper.dateFormatter
                    },
                    {
                        headerName: "Due Date", field: "dueDate", width: 105,
                        cellEditor: 'agDateEditor', editable: true, valueFormatter: agGridHelper_1.agGridHelper.dateFormatter
                    },
                    { headerName: "Remarks", field: "remarks", width: 300, cellEditor: "agLargeTextCellEditor" },
                    { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
                ]
            }
        ];
        //#endregion
        //#region Driver Reference Grid Definition & functions
        this.colReference = [
            {
                headerName: 'Driver References',
                children: [
                    { headerName: "ReferenceName", field: "referenceName", width: 120 },
                    { headerName: "CNIC #", field: "cnic", width: 120 },
                    { headerName: "Company Name", field: "companyName", width: 200 },
                    {
                        headerName: "Relation", field: "relationId", width: 100,
                        cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(), cellEditorParams: { source: 'Relation', class: "100" },
                        valueFormatter: agGridHelper_1.agGridHelper.getRelationName
                    },
                    { headerName: "Contact #", field: "contactNo", width: 110 },
                    { headerName: "Address", field: "address", width: 350, cellEditor: "agLargeTextCellEditor" },
                    { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
                ]
            }
        ];
        this.initGrid();
        this.loadLookup();
        this.DOBMinDate.setDate(this.Date.getDate() - 22000);
        this.DOBMaxDate.setDate(this.Date.getDate() - 6570);
        this.driverImg = "../../assets/images/NoPicture.png";
    }
    ngOnInit() {
        this.frmDriver = this.formbulider.group({
            driverId: [null, [forms_1.Validators.required]],
            driverName: [null, [forms_1.Validators.required]],
            fatherName: [null, [forms_1.Validators.required]],
            address: [null, [forms_1.Validators.required]],
            doB: [null, [forms_1.Validators.required]],
            cellNo: [null, [forms_1.Validators.required]],
            licenseNo: [null, [forms_1.Validators.required]],
            licenseExpiry: [null, [forms_1.Validators.required]],
            cnic: [null, [forms_1.Validators.required]],
            cnicExpiry: [null, [forms_1.Validators.required]],
            qualificationId: [null, [forms_1.Validators.required]],
            noKName: [null, [forms_1.Validators.required]],
            noKRelationId: [null, [forms_1.Validators.required]],
            joiningDate: [null, [forms_1.Validators.required]],
            separationDate: [null],
            separationTypeId: [null],
            separationReason: [null],
            branchId: [null, [forms_1.Validators.required]],
            designation: [null, [forms_1.Validators.required]],
            employeeNo: [null],
            contractorId: [null, [forms_1.Validators.required]],
            workExperience: [null, [forms_1.Validators.required]],
            monthlySalary: [null, [forms_1.Validators.required]],
            previousEmployer: [null],
            //PreviousEmployer2: [null],
            isActive: [null],
            fileImage: null,
            addNew: [null],
            documentTypeId: [null] //,
            //DriverPicture: [null],      
        });
        this.frmDriver.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
    }
    ngAfterViewInit() {
        //it is necessary to disable save button as due to ngIf it remains active otherwise
        this.disableSave();
        this.targetNode = document.getElementById('divHToolbar'); //document.body;//document.getElementById('btnSave') as Node;
        this.observer.observe(this.targetNode, this.config);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmDriver.reset();
        this.frmDriver.enable();
        this.frmDriver.controls.driverId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.frmDriver.patchValue({ isActive: true });
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
        this.allowImgUpload = true;
        this.driverName.nativeElement.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmDriver.controls.driverId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.driverId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcDriver.getDrivers().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Driver", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.driverId);
                    }
                });
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcWaitDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbEdit() {
        this.frmDriver.enable();
        this.frmDriver.controls.driverId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
        this.allowImgUpload = true;
        this.driverName.nativeElement.focus();
    }
    tbSave() {
        try {
            this.frmDriver.markAllAsTouched();
            if (!this.frmDriver.invalid) {
                var formData = this.frmDriver.getRawValue();
                formData.footer = this.footer;
                formData.medicals = this.getMedicalFromGrid();
                formData.references = this.getReferenceFromGrid();
                formData.trainings = this.getTrainingsFromGrid();
                formData.picture = this.driverImg;
                if (formData.driverId != null) {
                    formData.documents = this.getDocumentsFromGrid();
                }
                //}
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcDriver.save(formData).subscribe(() => {
                        this.initForm();
                        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                        this.svcToaster.showSuccess('Record Saved Successfully');
                    }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
                }
            }
        }
        catch (e) {
            this.svcWaitDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbUndo() {
        this.initForm();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    tbExit() {
        sessionStorage.removeItem("lstMedicalTestType");
        sessionStorage.removeItem("lstRelation");
        sessionStorage.removeItem("lstTraining");
        sessionStorage.removeItem("lstTrainer");
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region grid setup
    initGrid() {
        this.goTraining = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            //columnDefs: this.colTraining,
            //rowData: [],
            rowSelection: 'single',
            onCellValueChanged: function (params) {
                if (!params.data.add)
                    params.data.edit = true;
                if (params.colDef.field == "trainingId") {
                    if (params.data.trainingId != "") {
                        params.node.setDataValue("trainingId", parseInt(params.data.trainingId));
                    }
                    else {
                        params.node.setDataValue("trainingId", null);
                    }
                }
                if (params.colDef.field == "trainerId") {
                    if (params.data.trainerId != "") {
                        params.node.setDataValue("trainerId", parseInt(params.data.trainerId));
                    }
                    else {
                        params.node.setDataValue("trainerId", null);
                    }
                }
            }
        };
        this.goDocument = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            //columnDefs: this.colDocument,
            //rowData: [],
            rowSelection: 'single',
            onCellValueChanged: function (params) {
                if (!params.data.add)
                    params.data.edit = true;
            },
            onGridReady: () => {
                this.goDocument.api.sizeColumnsToFit();
            }
        };
        this.goMedical = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            rowSelection: 'single',
            //columnDefs: this.colMedical,
            //rowData: [],
            // rowSelection: 'single',
            //stopEditingWhenGridLosesFocus: true,
            onCellValueChanged: function (params) {
                if (!params.data.add)
                    params.data.edit = true;
                if (params.colDef.field == "testId") {
                    if (params.data.testId != "") {
                        params.node.setDataValue("testId", parseInt(params.data.testId));
                    }
                    else {
                        params.node.setDataValue("testId", null);
                    }
                }
            }
        };
        this.goReference = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            rowSelection: 'single',
            onCellValueChanged: function (params) {
                if (!params.data.add)
                    params.data.edit = true;
                if (params.colDef.field == "relationId") {
                    if (params.data.relationId != "") {
                        params.node.setDataValue("relationId", parseInt(params.data.relationId));
                    }
                    else {
                        params.node.setDataValue("relationId", null);
                    }
                }
            }
        };
    }
    onAddTraining() {
        try {
            var res = this.goTraining.api.applyTransaction({
                add: [{ detailId: null, trainingId: null, trainerId: null, startDate: null, endDate: null, dueDate: null, add: true, edit: false, delete: false }]
            });
            this.goTraining.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "trainingId" });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Add Line: ');
        }
    }
    ;
    onDeleteTraining() {
        try {
            if (this.goTraining.api.getSelectedRows().length > 0) {
                if (confirm("Are you sure you want to Delete selected row?")) {
                    this.goTraining.api.getSelectedRows().forEach(x => x.delete = true);
                    agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goTraining.api);
                }
            }
            else
                this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
        }
        catch (exception) {
            this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
        }
    }
    ;
    getTrainingsFromGrid() {
        let rowData = [];
        this.goTraining.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    onAddDocument() {
        try {
            this.frmDriver.patchValue({ addNew: true });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Add Line: ');
        }
    }
    ;
    onUndoDocument() {
        try {
            this.frmDriver.patchValue({ addNew: false });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Undo Line: ');
        }
    }
    ;
    setWIPDocument(e) {
        this.wipDocument = e.target.files[0];
    }
    onUploadDocument() {
        try {
            if (this.frmDriver.controls.documentTypeId.value == null) {
                this.svcToaster.showFailure("Please Select valid Document before hitting uplaod!");
                return;
            }
            var driverDoc = new driverdocument_1.DriverDocument();
            driverDoc.image = this.wipDocument;
            var formData = new FormData();
            formData.append('image', driverDoc.image);
            formData.append('typeId', this.frmDriver.controls.documentTypeId.value);
            formData.append('driverId', this.frmDriver.controls.driverId.value);
            this.svcDriver.upload(formData).subscribe(() => {
                this.frmDriver.patchValue({ documentTypeId: null });
                this.svcDriver.getDocuments(this.frmDriver.controls.driverId.value).subscribe(ic => {
                    if (ic) {
                        this.documentData = ic;
                    }
                }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception);
        }
    }
    ;
    onCellClicked(event) {
        var column = event.api.getFocusedCell().column.colDef.headerName;
        if (column == "File Name") {
            this.svcDriver.getDoc(event.node.data.detailId).subscribe(ic => {
                if (ic) {
                    const byteCharacters = atob(ic.fileContent);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: ic.contentType });
                    FileSaver.saveAs(blob, ic.fileName);
                }
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
    }
    onDeleteDocument() {
        try {
            if (document.getElementById('btnEdit').disabled == false) {
                this.svcToaster.showFailure('Delete function will only work after you switch form to Edit mode!');
                return;
            }
            if (this.goDocument.api.getSelectedRows().length > 0) {
                if (confirm("Are you sure you want to Delete selected row?")) {
                    this.goDocument.api.getSelectedRows().forEach(x => x.isDeleted = true);
                    agGridHelper_1.agGridHelper.setGridIsDeletedFilter(this.goDocument.api);
                }
            }
            else
                this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
        }
        catch (exception) {
            this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
        }
    }
    ;
    getDocumentsFromGrid() {
        let rowData = [];
        this.goDocument.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    onAddMedical() {
        try {
            var res = this.goMedical.api.applyTransaction({
                add: [{ testId: null, testDate: null, dueDate: null, remarks: null, add: true, edit: false, delete: false, detailId: null }]
            });
            this.goMedical.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "testId" });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Add Line: ');
        }
    }
    ;
    onDeleteMedical() {
        try {
            if (this.goMedical.api.getSelectedRows().length > 0) {
                if (confirm("Are you sure you want to Delete selected row?")) {
                    this.goMedical.api.getSelectedRows().forEach(x => x.delete = true);
                    agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goMedical.api);
                }
            }
            else
                this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
        }
        catch (exception) {
            this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
        }
    }
    ;
    getMedicalFromGrid() {
        let rowData = [];
        this.goMedical.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    onAddReference() {
        try {
            var res = this.goReference.api.applyTransaction({
                add: [{ referenceName: null, cnic: null, companyName: null, relationId: null, contactNo: null, address: null, add: true, edit: false, delete: false }]
            });
            this.goReference.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "referenceName" });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Add Line: ');
        }
    }
    ;
    onDeleteReference() {
        try {
            if (this.goReference.api.getSelectedRows().length > 0) {
                if (confirm("Are you sure you want to Delete selected row?")) {
                    this.goReference.api.getSelectedRows().forEach(x => x.delete = true);
                    agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goReference.api);
                }
            }
            else
                this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
        }
        catch (exception) {
            this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
        }
    }
    ;
    getReferenceFromGrid() {
        let rowData = [];
        this.goReference.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    //#endregion
    //#region local functions
    get(Id) {
        if (!Id) {
            this.svcToaster.showFailure("Please provide valid Id before recalling existing entry!");
            return;
        }
        this.svcWaitDlg.open({});
        try {
            this.svcDriver.get(Id).subscribe(driver => {
                if (driver) {
                    this.frmDriver.controls['driverId'].setValue(driver.driverId);
                    this.frmDriver.controls['driverName'].setValue(driver.driverName);
                    this.frmDriver.controls['fatherName'].setValue(driver.fatherName);
                    this.frmDriver.controls['address'].setValue(driver.address);
                    this.frmDriver.controls['doB'].setValue(driver.doB);
                    this.frmDriver.controls['cellNo'].setValue(driver.cellNo);
                    this.frmDriver.controls['licenseNo'].setValue(driver.licenseNo);
                    this.frmDriver.controls['licenseExpiry'].setValue(driver.licenseExpiry);
                    this.frmDriver.controls['cnic'].setValue(driver.cnic);
                    this.frmDriver.controls['cnicExpiry'].setValue(driver.cnicExpiry);
                    this.frmDriver.controls['qualificationId'].setValue(driver.qualificationId);
                    this.frmDriver.controls['noKName'].setValue(driver.noKName);
                    this.frmDriver.controls['noKRelationId'].setValue(driver.noKRelationId);
                    this.frmDriver.controls['joiningDate'].setValue(driver.joiningDate);
                    this.frmDriver.controls['separationDate'].setValue(driver.separationDate);
                    this.frmDriver.controls['separationTypeId'].setValue(driver.separationTypeId);
                    this.frmDriver.controls['separationReason'].setValue(driver.separationReason);
                    this.frmDriver.controls['branchId'].setValue(driver.branchId);
                    this.frmDriver.controls['designation'].setValue(driver.designation);
                    this.frmDriver.controls['employeeNo'].setValue(driver.employeeNo);
                    this.frmDriver.controls['contractorId'].setValue(driver.contractorId);
                    this.frmDriver.controls['workExperience'].setValue(driver.workExperience);
                    this.frmDriver.controls['monthlySalary'].setValue(driver.monthlySalary);
                    this.frmDriver.controls['previousEmployer'].setValue(driver.previousEmployer);
                    this.frmDriver.controls['isActive'].setValue(driver.isActive);
                    this.driverImg = driver.picture;
                    this.medicalData = driver.medicals;
                    this.referenceData = driver.references;
                    this.trainingData = driver.trainings;
                    this.documentData = driver.documents;
                    this.footer = driver.footer;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                    agFormHelper_1.agFormHelper.setGridToolbar(false);
                    agFormHelper_1.agFormHelper.setGridStatus(false);
                }
                else {
                    this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
                }
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    getDriverImage(e) {
        var img = e.target.files[0];
        if (img.length === 0)
            return;
        var mimeType = e.target.files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            alert("Only images are supported.");
            return;
        }
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = (_event) => {
            var image = reader.result;
            this.driverImg = image.slice(23).toString();
            this.driverImg = reader.result;
        };
    }
    validateGridStatus() {
        var rd = this.isReadOnly();
        agFormHelper_1.agFormHelper.setGridStatus(!rd);
        agFormHelper_1.agFormHelper.setGridToolbar(!rd);
    }
    loadLookup() {
        try {
            this.svcDriver.getLookups().subscribe(data => {
                this.lstQualification = data.lstQualifications;
                this.lstBranch = data.lstBranch;
                this.lstRelation = data.lstRelation;
                this.lstSeparationType = data.lstSeparationType;
                this.lstContractor = data.lstContractors;
                this.lstDocumentType = data.lstDocumentType;
                sessionStorage.setItem("lstMedicalTest", JSON.stringify(data.lstMedicalTest));
                sessionStorage.setItem("lstRelation", JSON.stringify(data.lstRelation));
                sessionStorage.setItem("lstTraining", JSON.stringify(data.lstTraining));
                sessionStorage.setItem("lstTrainer", JSON.stringify(data.lstTrainer));
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(_drv) {
        this.errors = [];
        var valueArr;
        let regexpNumber = new RegExp('^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$');
        let MobileNo = new RegExp('^[0-9]{4}-[0-9]{7}$');
        if (_drv.separationDate != null && _drv.isActive) {
            this.errors.push('Driver status must be Inactive if separation date is entered');
        }
        if (_drv.separationDate != null && _drv.separationTypeId == null) {
            this.errors.push('Please select valid separation type for separated Driver');
        }
        if (!MobileNo.test(_drv.cellNo)) {
            this.errors.push('Contact No must be provided in valid format like 9999-9999999');
        }
        if (Object.keys(_drv.trainings.filter(x => !x.delete)).length > 0) {
            if (_drv.trainings.some(x => !x.delete && !x.trainingId)) {
                this.errors.push('Valid Training Id must be selected or row may please be removed if not needed');
            }
            if (_drv.trainings.some(x => !x.delete && !x.trainerId)) {
                this.errors.push('Valid Trainer Id must be selected or row may please be removed if not needed');
            }
            valueArr = _drv.trainings.filter(x => !x.delete).map(item => ({ trainingId: item.trainingId, startDate: item.startDate })).slice().sort();
            for (var i = 0; i < valueArr.length - 1; i++) {
                if (valueArr[i + 1]['trainingId'] === valueArr[i]['trainingId']) {
                    if (valueArr[i + 1]['startDate'] === valueArr[i]['startDate']) {
                        this.errors.push('Training entries must be unique! Same training can`t be availed twice in same day!');
                        i = valueArr.length;
                    }
                }
            }
        }
        if (Object.keys(_drv.references.filter(x => !x.delete)).length > 0) {
            if (_drv.references.some(x => !x.delete && x.referenceName === "")) {
                this.errors.push('Receiver Name cant be empty. Please remove rows that are no more required instead of keeping blank values');
            }
            if (_drv.references.some(x => !x.delete && x.cnic === "")) {
                this.errors.push('Reference CNIC is a mandatory field. Please remove rows that are no more required instead of keeping blank values');
            }
            if (_drv.references.some(x => !x.delete && x.contactNo === "")) {
                this.errors.push('Contact # Name cant be empty. Please remove rows that are no more required instead of keeping blank values');
            }
            if (_drv.references.some(x => !x.delete && !regexpNumber.test(x.cnic))) {
                this.errors.push('3rd party CNIC must be defined in proper format like #####-#######-#');
            }
            if (_drv.references.some(x => !x.delete && !MobileNo.test(x.contactNo))) {
                this.errors.push('Reference Contact# must be defined in proper format like xxxx-xxxxxxx');
            }
            valueArr = _drv.references.filter(x => !x.delete).map(item => { return item.cnic; }).slice().sort();
            for (var i = 0; i < valueArr.length - 1; i++) {
                if (valueArr[i + 1] === valueArr[i])
                    this.errors.push('Reference CNIC # must be unique!');
                i = valueArr.length;
            }
        }
        if (Object.keys(_drv.medicals.filter(x => !x.delete)).length > 0) {
            if (_drv.medicals.some(x => !x.delete && !x.testId)) {
                this.errors.push('Valid Medical Test must be selected or row may please be removed if not needed');
            }
            if (_drv.medicals.some(x => !x.delete && x.testId != 0 && !x.testDate)) {
                this.errors.push('Test date is a mandatory field');
            }
            valueArr = _drv.medicals.filter(x => !x.delete).map(item => ({ testId: item.testId, testDate: item.testDate })).slice().sort();
            for (var i = 0; i < valueArr.length - 1; i++) {
                if (valueArr[i + 1]['testId'] === valueArr[i]['testId']) {
                    if (valueArr[i + 1]['testDate'] === valueArr[i]['testDate']) {
                        this.errors.push('Medical tests must be unique!');
                        i = valueArr.length;
                    }
                }
            }
        }
    }
    isReadOnly() {
        return (document.querySelector('[id="btnEdit"]')['disabled'] == false);
    }
    disableSave() {
        if (document.getElementById("btnSave"))
            document.getElementById("btnSave").disabled = true;
    }
    initForm() {
        this.frmDriver.reset();
        this.frmDriver.disable();
        this.driverImg = "./assets/images/NoPicture.png";
        this.errors = [];
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        this.medicalData = [];
        this.referenceData = [];
        this.trainingData = [];
        this.allowImgUpload = false;
        this.fileImage.nativeElement.value = "";
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('driverId', { static: true })
], DriverComponent.prototype, "driverId", void 0);
__decorate([
    core_1.ViewChild('driverName', { static: true })
], DriverComponent.prototype, "driverName", void 0);
__decorate([
    core_1.ViewChild('drvPicture', { static: true })
], DriverComponent.prototype, "fileImage", void 0);
__decorate([
    core_1.ViewChild('btnEdit', { static: true })
], DriverComponent.prototype, "btnEdit", void 0);
DriverComponent = __decorate([
    core_1.Component({
        selector: 'app-driver',
        templateUrl: './driver.component.html',
        styleUrls: ['./driver.component.css']
    })
], DriverComponent);
exports.DriverComponent = DriverComponent;
//# sourceMappingURL=driver.component.js.map