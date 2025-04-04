"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RWBEventComponent = void 0;
const common_1 = require("@angular/common");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let RWBEventComponent = class RWBEventComponent {
    //#endregion
    constructor(router, formbulider, svcRWBEvent, svcToaster, Enum, svcWaitDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcRWBEvent = svcRWBEvent;
        this.svcToaster = svcToaster;
        this.Enum = Enum;
        this.svcWaitDlg = svcWaitDlg;
        this.optionName = 'Rwb Event';
        this.errors = [];
        this.minDate = new Date(new Date().getDate() - 45);
        this.maxDate = new Date();
        this.enablePartialDelivery = false;
        //EventTime: any;
        //EventDate: any;
        this.footer = new footer_1.agFooter();
        this.colLog = [
            {
                headerName: 'Trip Event(s)',
                children: [
                    { headerName: "Event Name", field: "eventName", width: 240 },
                    { headerName: "Event Date Time", field: "eventDateTime", width: 150 },
                    { headerName: "Vehicle #", field: "vehicleNo", width: 80 },
                    {
                        headerName: "KM Reading", field: "kmReading", type: "numericColumn", width: 80,
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser
                    },
                    { headerName: "From City", field: "fromCityName", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "To City", field: "toCityName", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Consignee", field: "consigneeName", hide: true, suppressColumnsToolPanel: true },
                ]
            }
        ];
        this.loadLookup();
        this.initGrid();
        this.enablePartialDelivery = agFormHelper_1.agFormHelper.enablePartialDelivery();
    }
    ngOnInit() {
        this.frmRWBEvent = this.formbulider.group({
            rwbNo: [null, [forms_1.Validators.required]],
            eventId: [null, [forms_1.Validators.required]],
            rwbId: [null],
            destinationId: [null],
            toCityId: [null],
            vehicleId: [null],
            vehicleNo: [null],
            trailerId: [null],
            trailerNo: [null],
            eventDate: [null, [forms_1.Validators.required]],
            eventTime: [null, [forms_1.Validators.required]],
            stateId: [null],
            stateName: [null],
            currentKMs: [null],
            lastEventDateTime: [null],
            driverId1: [null],
            driverName1: [null],
            driverId2: [null],
            driverName2: [null],
            supplierId: [null],
            supplierName: [null],
            outsourced: [null],
            rentedVehicleId: [null],
            receiverName: [null],
            receiverCNIC: [null],
            invoiceNo: [null],
            deliveryNo: [null],
            shpimentNo: [null],
            tonnage: [null],
            applyDet: [null],
            detGraceHRs: [null],
            detGraceHRsFromRwb: [null],
            shortQty: [null],
            shortRate: [null],
            shortAmount: [null],
            shortageDesc: [null],
            arrivalDate: [null],
            arrivalTime: [null],
            nextDepartureDate: [null],
            nextDepartureTime: [null],
            lastDepartureDate: [null],
            lastDepartureTime: [null],
            lastDepartureDateTime: [null],
            enablePartialDelivery: [null],
            consigneeId: [null],
            leaseTypeId: [null],
            changeAsset: [null],
            emptryTrip: [null]
        });
        this.frmRWBEvent.disable();
        this.frmRWBEvent.patchValue({ applyDet: false, outsourced: false, eventId: 0, enablePartialDelivery: this.enablePartialDelivery, changeAsset: false });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        if (!this.enablePartialDelivery) {
            this.goLog.columnApi.setColumnsVisible(["consigneeName"], false);
        }
        else {
            this.goLog.columnApi.setColumnsVisible(["fromCityName", "toCityName"], false);
        }
    }
    //#region toolbar functions
    tbRecall() {
        this.initForm();
        this.frmRWBEvent.controls.rwbNo.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.rwbNo.nativeElement.focus();
    }
    tbEdit() {
        this.frmRWBEvent.enable();
        this.frmRWBEvent.controls.rwbNo.disable();
        this.frmRWBEvent.controls.stateName.disable();
        this.frmRWBEvent.controls.driverId1.disable();
        this.frmRWBEvent.controls.driverName1.disable();
        this.frmRWBEvent.controls.driverId2.disable();
        this.frmRWBEvent.controls.driverName2.disable();
        this.frmRWBEvent.controls.trailerNo.disable();
        this.frmRWBEvent.controls.outsourced.disable();
        var formData = this.frmRWBEvent.getRawValue();
        if ((formData.eventId == 2 || formData.eventId == 4 || formData.eventId == 7) && formData.outsourced == 0) {
            this.frmRWBEvent.controls.driverName1.disable();
            this.frmRWBEvent.controls.driverName2.disable();
            this.frmRWBEvent.controls.supplierName.disable();
            //if (formData.lastKMs == 0) {
            //  this.frmRWBEvent.controls.outsourced.enable();
            //}
            //else {
            //  this.frmRWBEvent.controls.outsourced.disable();
            //}
            this.loadRWBAsset(formData.rwbId);
        }
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.eventId.focus();
    }
    tbSave() {
        try {
            this.frmRWBEvent.markAllAsTouched();
            if (!this.frmRWBEvent.invalid) {
                var formData = this.frmRWBEvent.getRawValue();
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcRWBEvent.save(formData).subscribe(() => {
                        this.initForm();
                        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                        this.svcToaster.showSuccess('Record saved Successfully');
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
        sessionStorage.removeItem("lstConsignee");
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region RWB Log grid definition & functions
    initGrid() {
        this.goLog = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                resizable: true,
                sortable: true,
                singleClickEdit: true,
                editable: false
            }
        };
    }
    //#endregion
    //#region local functions
    get(rwbNo) {
        rwbNo = agFormHelper_1.agFormHelper.padL(rwbNo);
        this.svcWaitDlg.open({});
        try {
            this.svcRWBEvent.get(rwbNo).subscribe(rwbevent => {
                if (rwbevent) {
                    this.frmRWBEvent.disable();
                    this.stdTT = rwbevent.data.stdTT;
                    this.lastKMReading = rwbevent.data.lastKMsReading;
                    this.stdKMs = rwbevent.data.stdKMs;
                    this.lstEvent = rwbevent.data.events;
                    this.distanceThreshold = rwbevent.data.distanceThreshold;
                    this.frmRWBEvent.controls['enablePartialDelivery'].setValue(this.enablePartialDelivery);
                    this.frmRWBEvent.controls['rwbNo'].setValue(rwbNo);
                    this.frmRWBEvent.controls['rwbId'].setValue(rwbevent.data.rwbId);
                    this.frmRWBEvent.controls['stateId'].setValue(rwbevent.data.stateId);
                    this.frmRWBEvent.controls['stateName'].setValue(rwbevent.data.stateName);
                    this.frmRWBEvent.controls['toCityId'].setValue(rwbevent.data.destinationId);
                    this.frmRWBEvent.controls['lastEventDateTime'].setValue(rwbevent.data.lastEventDateTime);
                    this.frmRWBEvent.controls['vehicleId'].setValue(rwbevent.data.vehicleId);
                    this.frmRWBEvent.controls['vehicleNo'].setValue(rwbevent.data.vehicleNo);
                    this.frmRWBEvent.controls['trailerId'].setValue(rwbevent.data.trailerId);
                    this.frmRWBEvent.controls['trailerNo'].setValue(rwbevent.data.trailerNo);
                    this.frmRWBEvent.controls['driverId1'].setValue(rwbevent.data.driverId1);
                    this.frmRWBEvent.controls['driverName1'].setValue(rwbevent.data.driverName1);
                    this.frmRWBEvent.controls['driverId2'].setValue(rwbevent.data.driverId2);
                    this.frmRWBEvent.controls['driverName2'].setValue(rwbevent.data.driverName2);
                    this.frmRWBEvent.controls['supplierName'].setValue(rwbevent.data.supplierName);
                    if (rwbevent.data.stateId != 4) {
                        this.frmRWBEvent.controls['currentKMs'].setValue(rwbevent.data.lastKMsReading);
                    }
                    this.frmRWBEvent.controls['leaseTypeId'].setValue(rwbevent.data.leaseTypeId);
                    this.frmRWBEvent.controls['supplierId'].setValue(rwbevent.data.supplierId);
                    this.frmRWBEvent.controls['changeAsset'].setValue(false);
                    this.frmRWBEvent.controls['applyDet'].setValue(false);
                    this.frmRWBEvent.controls['outsourced'].setValue(rwbevent.data.outsourced);
                    this.frmRWBEvent.controls['emptryTrip'].setValue(rwbevent.data.emptryTrip);
                    if (rwbevent.data.outsourced) {
                        this.frmRWBEvent.controls['rentedVehicleId'].setValue(rwbevent.data.vehicleNo);
                    }
                    this.frmRWBEvent.controls['detGraceHRs'].setValue(rwbevent.data.detGraceHRs);
                    this.frmRWBEvent.controls['detGraceHRsFromRwb'].setValue(rwbevent.data.detGraceHRsFromRwb);
                    if (Object.keys(this.lstEvent).length > 0) {
                        this.frmRWBEvent.controls['eventId'].setValue(this.lstEvent[0].eventId);
                    }
                    if (!this.enablePartialDelivery) {
                        this.goLog.columnApi.setColumnsVisible(["consigneeName"], false);
                        this.goLog.columnApi.setColumnsVisible(["fromCityName", "toCityName"], true);
                    }
                    else {
                        this.goLog.columnApi.setColumnsVisible(["consigneeName"], true);
                        this.goLog.columnApi.setColumnsVisible(["fromCityName", "toCityName"], false);
                    }
                    if (this.enablePartialDelivery && rwbevent.data.lastEventDateTime != null) {
                        if (rwbevent.data.emptryTrip) {
                            this.lastKMReading = rwbevent.data.lastKMsReading;
                            this.stdKMs = 0;
                            this.lastDepartureDateTime = rwbevent.data.lastEventDateTime;
                            this.frmRWBEvent.controls['lastDepartureDate'].setValue(common_1.formatDate(rwbevent.data.lastEventDateTime, 'dd-MMM-yyyy', 'en-US'));
                            this.frmRWBEvent.controls['lastDepartureTime'].setValue(common_1.formatDate(rwbevent.data.lastEventDateTime, 'HH:mm', 'en-US'));
                        }
                        try {
                            this.svcRWBEvent.getConsignees(rwbevent.data.rwbId).subscribe(cn => {
                                if (cn) {
                                    sessionStorage.removeItem("lstConsignee");
                                    this.lstConsignee = cn;
                                    sessionStorage.setItem("lstConsignee", JSON.stringify(cn));
                                }
                            }, error => { this.svcToaster.showFailure(error); });
                            this.svcRWBEvent.getShortage(rwbevent.data.rwbId).subscribe(sh => {
                                if (sh) {
                                    this.frmRWBEvent.controls['shortQty'].setValue(sh.qty);
                                    this.frmRWBEvent.controls['shortRate'].setValue(sh.rate);
                                    this.frmRWBEvent.controls['shortAmount'].setValue(sh.amount);
                                    this.frmRWBEvent.controls['shortDescription'].setValue(sh.description);
                                }
                            }, error => { this.svcToaster.showFailure(error); });
                        }
                        catch (e) {
                            this.svcToaster.showFailure(e);
                        }
                    }
                    try {
                        this.svcRWBEvent.getRwbEvents(rwbNo).subscribe(log => {
                            if (log) {
                                this.logData = log;
                            }
                        }, error => { this.svcToaster.showFailure(error); });
                    }
                    catch (e) {
                        this.svcToaster.showFailure(e);
                    }
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
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
    loadLookup() {
        try {
            this.svcRWBEvent.getLookup().subscribe(data => {
                this.lstSupplier = data.lstSupplier;
                this.lstCity = data.lstCity;
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    loadRWBAsset(rwbId) {
        try {
            this.svcRWBEvent.getAssets(rwbId, 1).subscribe(data => {
                this.lstAsset = data.lstAsset;
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(re) {
        this.errors = [];
        let reNumber = new RegExp('^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$');
        if (re.outsourced && re.eventId == 2 && re.supplierId == null) {
            this.errors.push('Please select valid vendor of the vehicle');
        }
        if (!re.outsourced) {
            if (re.currentKMs == 0 || !re.currentKMs)
                this.errors.push('Please enter valid KMs reading');
            if ((re.eventId == 2 || re.eventId == 4 || re.eventId == 7)) {
                if (!re.vehicleId && !re.outsourced) {
                    this.errors.push('Please select valid Vehicle from the dropdown');
                }
                if (!re.trailerId && !re.outsourced) {
                    this.errors.push('Trailer is missing for the selected vehicle');
                }
                if (re.outsourced && !re.rentedVehicleId) {
                    this.errors.push('Please Enter Rented Asset No');
                }
                if (!re.driverId1 || !re.driverId2) {
                    this.errors.push('Driver 1 and 2 are mandatory');
                }
                if (re.vehicleId && !this.enablePartialDelivery) {
                    var lastKm = this.lstAsset.filter(x => x.assetId == re.vehicleId)[0].kms;
                    if (lastKm > re.currentKMs && re.eventId != 4) {
                        if (confirm('You are entering Current Meter Reading as ' + re.currentKMs +
                            ' which is lower than the last reported meter reading (' + lastKm + ') for this Asset. Are you sure you are entering correct Meter Reading and system should proceed?')) {
                        }
                        else {
                            this.errors.push('You are entering Current Meter Reading as ' + re.currentKMs +
                                ' which is lower than the last reported meter reading (' + lastKm + ') for this Asset');
                        }
                    }
                    else if (re.currentKMs - lastKm > this.distanceThreshold) {
                        if (confirm('You are entering Current Meter Reading ' + re.currentKMs +
                            ' with huge variation from the last reported KM reading ' + lastKm + ' for this vehicle.Are you sure you are entering correct Meter Reading and system should proceed')) {
                        }
                        else {
                            this.errors.push('You are entering Current Meter Reading ' + re.currentKMs +
                                ' with huge variation from the last reported KM reading ' + lastKm + 'reported for this Vehicle');
                        }
                    }
                    else if (this.leaseTypeId != 1 && !re.supplierId) {
                        this.errors.push('Please select valid vehicle Vendor');
                    }
                }
            }
            if ((re.eventId == 1 || re.eventId == 3 || re.eventId == 5 || re.eventId == 6 || re.eventId == 8) && this.lastKMReading > 0) {
                if (this.lastKMReading > re.currentKMs) {
                    if (confirm('You are entering Current Meter Reading as ' + re.currentKMs +
                        ' which is lower than the last reported KM reading (' + this.lastKMReading + ') for this vehicle. Are you sure you are entering correct Meter Reading and system should proceed')) {
                    }
                    else {
                        this.errors.push('You are entering Current Meter Reading as ' + re.currentKMs +
                            ' which is lower than the last reported KM reading (' + this.lastKMReading + ') for this Vehicle');
                    }
                }
                else if ((re.currentKMs - this.lastKMReading) > this.distanceThreshold) {
                    if (re.eventId == 8) {
                        if (confirm('You are entering Current Meter Reading ' + re.currentKMs +
                            ' with huge variation from the last reported KM reading ' + lastKm + ' for this Vehicle. Are you sure you are entering correct Meter Reading and system should proceed')) {
                        }
                        else {
                            this.errors.push('You are entering Current Meter Reading ' + re.currentKMs +
                                ' with huge variation from the last reported KM reading ' + lastKm + ' for this Vehicle');
                        }
                    }
                }
                var kmDiff = re.currentKMs - this.lastKMReading;
                if (kmDiff != this.stdKMs) {
                    if ((kmDiff > this.stdKMs && kmDiff < this.stdKMs + this.distanceThreshold) ||
                        (kmDiff < this.stdKMs && kmDiff > this.stdKMs - this.distanceThreshold)) {
                        if (confirm('There is a difference between trip KM ' + kmDiff + ' calculated through current meter reading ' +
                            'entered by you and the standard KM distance defined in the system, which is ' + this.stdKMs + '. Are you sure you ' +
                            'are entering correct meter reading and system should proceed with committing Arrival Information?')) {
                        }
                        else {
                            this.errors.push('There is a difference between trip KM ' + kmDiff + ' calculated through current meter reading ' +
                                'entered by you and the standard KM distance defined in the system  which is ' + this.stdKMs);
                        }
                    }
                    if (kmDiff > this.stdKMs + this.distanceThreshold) {
                        this.errors.push('The KM reading entered by you shows journey KMs between 2 points as ' + kmDiff +
                            ', which is deviating @ high threshold from Standard KMs ' + this.stdKMs +
                            ' for this route. Entry is not allowed at this high threshold from your Id');
                    }
                }
            }
            if (re.eventId == 8 || re.receiverCNIC) {
                if (!reNumber.test(re.receiverCNIC)) {
                    this.errors.push('CNIC must be defined in proper format like #####-#######-#');
                }
            }
            if (re.eventId == 8 && this.enablePartialDelivery) {
                var arrivalDateTime = common_1.formatDate(re.arrivalDate, 'dd-MMM-yyyy', 'en-US') + ' ' + re.arrivalTime;
                var deliveryDateTime = common_1.formatDate(re.eventDate, 'dd-MMM-yyyy', 'en-US') + ' ' + re.eventTime;
                var nextDeparture = common_1.formatDate(re.nextDepartureDate, 'dd-MMM-yyyy', 'en-US') + ' ' + re.nextDepartureTime;
                if (re.shortQty < 0 || re.shortRate < 0) {
                    this.errors.push('Shortage Rate and Amount cannot be Less then zero');
                }
                if (!re.arrivalDate || !re.arrivalTime) {
                    this.errors.push('Please entere valid Arrival Date/Time');
                }
                if (!re.nextDepartureDate || !re.nextDepartureTime) {
                    this.errors.push('Please enter valid Next Departure Date & Time');
                }
                if (!re.emptryTrip && arrivalDateTime <= common_1.formatDate(this.lastDepartureDateTime, 'dd-MMM-yyyy HH:mm', 'en-US')) {
                    this.errors.push('Arrival Date/Time is the time when vehicle arrives at selected consignee, it should be later than Last Departure Date/Time.');
                }
                if (deliveryDateTime <= arrivalDateTime) {
                    this.errors.push('Delivery Date/Time is the time when vehicle begin to decant, it should be later than Arrival Date/Time');
                }
                if (nextDeparture <= deliveryDateTime) {
                    this.errors.push('Next Departure Date/Time is the time when vehicle departs for next consignee / origin, it should be later than Delivery Date/Time');
                }
                if (!re.emptryTrip && !re.consigneeId) {
                    this.errors.push('Please select valid Consignee');
                }
            }
        }
    }
    onAssetChange(assetId) {
        var asset = this.lstAsset.filter(a => a.assetId == assetId)[0];
        this.frmRWBEvent.controls['driverId1'].setValue(asset.driverId1);
        this.frmRWBEvent.controls['driverName1'].setValue(asset.driverName1);
        this.frmRWBEvent.controls['driverId2'].setValue(asset.driverId2);
        this.frmRWBEvent.controls['driverName2'].setValue(asset.driverName2);
        this.frmRWBEvent.controls['supplierId'].setValue(asset.supplierId);
        this.frmRWBEvent.controls['supplierName'].setValue(asset.supplierName);
        this.frmRWBEvent.controls['currentKMs'].setValue(asset.kMs);
        this.frmRWBEvent.controls['trailerId'].setValue(asset.trailerId);
        this.frmRWBEvent.controls['trailerNo'].setValue(asset.trailerNo);
        this.frmRWBEvent.controls['leaseTypeId'].setValue(asset.leaseTypeId);
    }
    onEventChange() {
        try {
            var formData = this.frmRWBEvent.getRawValue();
            if (!formData.outsourced && (formData.EventId == 2 || formData.EventId == 4 || formData.EventId == 7)) {
                if (formData.LastKMs == 0) {
                    this.frmRWBEvent.controls.outsourced.enable();
                    this.frmRWBEvent.controls['vehicleId'].setValue(null);
                    this.frmRWBEvent.controls['trailerId'].setValue(null);
                    this.frmRWBEvent.controls['trailerNo'].setValue("");
                    this.frmRWBEvent.controls['driverId1'].setValue(null);
                    this.frmRWBEvent.controls['driverName1'].setValue("");
                    this.frmRWBEvent.controls['driverId2'].setValue(null);
                    this.frmRWBEvent.controls['driverName2'].setValue("");
                    this.frmRWBEvent.controls['supplierName'].setValue("");
                    this.frmRWBEvent.controls['currentKMs'].setValue(0);
                    this.frmRWBEvent.controls['leaseTypeId'].setValue(null);
                    this.frmRWBEvent.controls['supplierId'].setValue(null);
                }
                else {
                    this.frmRWBEvent.controls.outsourced.disable();
                }
                if (!this.enablePartialDelivery) {
                    this.loadRWBAsset(formData.rwbId);
                }
            }
            else {
                this.frmRWBEvent.controls['currentKMs'].setValue(0);
            }
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    onCosigneeChange() {
        var data = JSON.parse(sessionStorage.getItem("lstConsignee"));
        this.lastKMReading = data[0].lastDeliveryKms;
        this.frmRWBEvent.controls['currentKMs'].setValue(this.lastKMReading);
        this.stdKMs = data[0].stdKMs;
        this.lastDepartureDateTime = data[0].lastDepartureDateTime;
        this.frmRWBEvent.controls['lastDepartureDate'].setValue(data[0].lastDepartureDate);
        this.frmRWBEvent.controls['lastDepartureTime'].setValue(common_1.formatDate(data[0].lastDepartureTime, 'HH:mm', 'en-US'));
    }
    //onOutsource(event) {
    //  if (event.checked) {
    //    this.frmRWBEvent.controls['vehicleId'].setValue(0);
    //    this.frmRWBEvent.controls['trailerId'].setValue(null);
    //    this.frmRWBEvent.controls['trailerNo'].setValue(null);
    //    this.frmRWBEvent.controls['driverId1'].setValue(null);
    //    this.frmRWBEvent.controls['driverName1'].setValue(null);
    //    this.frmRWBEvent.controls['driverId2'].setValue(null);
    //    this.frmRWBEvent.controls['driverName2'].setValue(null);
    //    this.frmRWBEvent.controls['supplierName'].setValue(null);
    //    this.frmRWBEvent.controls['currentKMs'].setValue(0);
    //    this.frmRWBEvent.controls['leaseTypeId'].setValue(null);
    //    this.frmRWBEvent.controls['supplierId'].setValue(null);
    //  }
    //}
    calcShortageAmount(qty, rate) {
        this.frmRWBEvent.patchValue({ shortAmount: qty * rate });
    }
    initForm() {
        this.frmRWBEvent.reset();
        this.frmRWBEvent.disable();
        this.errors = [];
        this.frmRWBEvent.patchValue({
            applyDet: false, outsourced: false, eventId: null,
            enablePartialDelivery: this.enablePartialDelivery, changeAsset: false
        });
        this.logData = [];
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('rwbNo', { static: true })
], RWBEventComponent.prototype, "rwbNo", void 0);
__decorate([
    core_1.ViewChild('eventId', { static: true })
], RWBEventComponent.prototype, "eventId", void 0);
RWBEventComponent = __decorate([
    core_1.Component({
        selector: 'app-rwbevent',
        templateUrl: './rwbevent.component.html',
        styleUrls: ['./rwbevent.component.css']
    })
], RWBEventComponent);
exports.RWBEventComponent = RWBEventComponent;
//# sourceMappingURL=rwbevent.component.js.map