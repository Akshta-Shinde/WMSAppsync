var tbl_header = '<tr>{H-COLS}</tr>';
var tbl_header_col = '<td style="width:{COL-WIDTH}px;;text-align:{COL-ALIGN};">{H-NAME}</td>';

var tbl_body = '<tr id="R{Row-ID}" onclick="rowInfo(this);">{B-COLS}</tr>';
var tbl_body_col = '<td style="width:{COL-WIDTH}px;text-align:{COL-ALIGN};">{B-COL-VALUE}</td>';

var tblOptionList = '<option value="0">Select Table</option>{FINAL-T-LIST}'
var tbloption = '<option value="{LIST-ID}">{TABLE-NAME}</option>'

// var btn_delete = '<button type= "button" style="font-size:20px;border:none;background-color: transparent;color:red;" onclick="deleteItem(this.parentElement.parentElement)" title="Click To Delete"><i class="fas fa-trash"></i></button>';
// var btn_edit = '<button type= "button" style="font-size:20px;border:none;background-color: transparent;color:#1E90FF;" onclick="rowMdm(this.parentElement.parentElement);" title="Click To Edit"><i class="fas fa-pen"></i></button>';
// var btn_cancel = '<button type= "button" style="font-size:20px;border:none;background-color: transparent;color:red;" onclick="cancelUpdate();" title="Click To Cancel"><i class="fa fa-times"></i></button>';
var btn_update = '<button type= "button" style="font-size:20px;border:none;background-color: transparent;color:green;" onclick="updateF();" title="Click To Update"><i class="fa fa-check"></i></button>';
var btn_save = '<button type= "button" style="font-size:20px;border:none;background-color: transparent;color:green;" onclick="insertF();" title="Click To Save"><i class="fa fa-check"></i></button>';
var btn_cancelAdd = '<button type= "button" style="font-size:20px;border:none;background-color: transparent;color:red;" onclick="cancelAdd();" title="Click To Cancel"><i class="fa fa-times"></i></button>';
var btn_view = '<button type= "button" style="font-size:20px;border:none;background-color: transparent;color:black;" title="View"><i class="fa">&#xf06e;</i></button>';
// var btn_check = '<button type= "button" style="font-size:20px;border:none;background-color: transparent;color:green;" onclick="chkQty(this.parentElement.parentElement);" title="Click To Check"><i class="fa fa-check"></i></button>';
var btn_updatePutAway = '<button type= "button" style="font-size:20px;border:none;background-color: transparent;color:green;" onclick="updatePutAway(this.parentElement.parentElement);" title="Click To Put Away"><i class="fa fa-check"></i></button>';
var btn_cancel_putAway = '<button type= "button" style="font-size:20px;border:none;background-color: transparent;color:red;" onclick="cancelUpdate(this.parentElement.parentElement);" title="Click To Cancel"><i class="fa fa-times"></i></button>';

var sUrl = "https://hjv36v7vgd.execute-api.ap-south-1.amazonaws.com/dev/iks/operations";

var iTxt = '<input type="text" name="{NAME}" value="{VALUE}" placeholder="{PLACEHOLDER}" pattern = "[A-Za-z\s]*$" style="width: 95%" {REQUIRED} {READONLY}/>';
var iInt = '<input type="number" name="{NAME}" value="{VALUE}" placeholder="{PLACEHOLDER}" min ="1" style="width: 95%;" {REQUIRED} />';
var iDec = '<input type="number" name="{NAME}" value="{VALUE}" step="0.01" placeholder="{PLACEHOLDER}" min ="0" style="width: 95%;" {REQUIRED} />';
var iTA = '<textarea name="{NAME}" rows="3" placeholder="{PLACEHOLDER}" style="width: 95%" {REQUIRED}>{VALUE}</textarea>';
// var dropdown = '<option value="{OPTION-ID}" {SELECTED}>{OPTION-LIST}</option>';
var iDate = '<input type="datetime" name="{NAME}" value="{VALUE}" placeholder="{PLACEHOLDER}" style="width: 95%" {REQUIRED} />';

var initialTableHeader;
var colWiths = "" // this will be captured from meta data and prepared during table header rendering, | separated values
var tbl_data;
var inEditMode = false;
var str_dropdown;
var insertMode = false;
var formData = [];
var tblno;
var tblist;
var row;
var product_details;
var nodelist = parent.document.querySelectorAll("iframe");

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function printConsole(msg){
	console.log(msg);
}


function getPrcessStageDetails(header, callbackFunction){
	$.ajax(
	{
		url: sUrl,
		type: 'GET',
		headers: header,
		contentType: 'application/json',
		success: function (result) {
            printConsole(result);
            if(result.tmsg == ""){
                callbackFunction(result);
                // showAlerts(1, "Record updated successfully");
            }
		},
		error: function (result, statusTxt, xhr) {
			alert("Error: " + xhr.status + ": " + xhr.statusText);
		}
	});
}

// Update Header
function buildTblHeader(tableData, tblHeaderCol = "", tblHeader = "") {
    var pframe = nodelist[0].iksFrame;
    var jObj = tableData;
    var sHeaderCols = '';
    colWiths = "";
    var local_header, local_header_col;

    if (tblHeader != "") { local_header = tblHeader } else { local_header = tbl_header }
    if (tblHeaderCol != "") { local_header_col = tblHeaderCol } else { local_header_col = tbl_header_col }

    for (i = 0; i < jObj.body.meta.length; i++) {
        var mR = jObj.body.meta[i].mR;
        var mRVal = mR.split("|");
        var cKey = mRVal[6];
        var salign = 'left';
        var calign = mRVal[10];
        var cvisible = mRVal[11];
        var field_visible = true;

        if (cKey == 'UK' || cKey == 'LK') {
            field_visible = false;
            if (cvisible == '1') {
                field_visible = true;
            }
        } else {
            if (cvisible == '-1') {
                field_visible = false;
            }
        }

        // if (cKey == 'UK' || cKey == 'LK' || cvisible == '0') {
        if (!field_visible) {
            sHeaderCols += " ";
        }
        else {
            if (calign != '') {
                salign = calign;
            }
            sHeaderCols += local_header_col.replace("{COL-WIDTH}", mRVal[8]).replace("{H-NAME}", mRVal[7]).replace("{COL-ALIGN}", salign);
        }

        // prepare colwiths data for tbody
        if (colWiths != "") {
            colWiths += "|";
        }

        colWiths += mRVal[8];

    }
    return local_header.replace("{H-COLS}", sHeaderCols);
}

// Update data
function buildTblData(tableData, tblbodycol = "", tblbody = "") {
    var pframe = nodelist[0].iksFrame;
    var jObj = tableData;
    var sBodyRows = '';
    var cWithds = colWiths.split("|");
    var local_body, local_body_col;

    if (tblbody != "") { local_body = tblbody } else { local_body = tbl_body }
    if (tblbodycol != "") { local_body_col = tblbodycol } else { local_body_col = tbl_body_col }
    var rowId_value;

    for (i = 0; i < jObj.body.rData.length; i++) {
        var sBodyCols = '';

        var mR = jObj.body.rData[i].c;
        var mRVal = mR.split("|");

        var salign = 'left';
        for (ic = 0; ic < mRVal.length; ic++) {
            if (jObj.body.meta != undefined) {
                var c = jObj.body.meta[ic].mR;
                var cVal = c.split("|");
                var cKey = cVal[6];
                var calign = cVal[10];
                var cvisible = cVal[11];
                var field_visible = true;

                if (cKey == 'UK' || cKey == 'LK') {
                    field_visible = false;
                    if (cvisible == '1') {
                        field_visible = true;
                    }
                } else {
                    if (cvisible == '-1') {
                        field_visible = false;
                    }
                }
                // if (cKey == 'UK' || cKey == 'LK' || cvisible == '0') {
                if (!field_visible) {
                    sBodyCols += " ";
                    rowId_value = mRVal[ic];
                } else {
                    if (calign != '') {
                        salign = calign;
                    }
                    sBodyCols += local_body_col.replace("{B-COL-VALUE}", mRVal[ic]).replace("{COL-WIDTH}", cWithds[ic]).replace("{COL-ALIGN}", salign);
                }
            } else {
                sBodyCols += local_body_col.replace("{B-COL-VALUE}", mRVal[ic]).replace("{COL-WIDTH}", cWithds[ic]).replace("{COL-ALIGN}", "left");
            }
        }
        var alternate_TrColor = '';
        if (i % 2) {
            alternate_TrColor = 'alernateTrBgc';
        }
        sBodyRows += local_body.replace("{B-COLS}", sBodyCols).replace(/{Row-ID}/g, rowId_value).replace("{BKGC}", alternate_TrColor); // first column has row ID
    }
    return sBodyRows;
}

function buildTableList(listData) {
    var jObj = listData;
    var sOptions = '';

    for (i = 0; i < jObj.body.tlist.length; i++) {
        var mR = jObj.body.tlist[i].tn;
        var mRVal = mR.split("|");
        sOptions += tbloption.replace("{LIST-ID}", mRVal[0]).replace("{TABLE-NAME}", mRVal[1]);
    }
    tblist = listData;
    return tblOptionList.replace("{FINAL-T-LIST}", sOptions);
}

function loadTableList(enbl) {
    $.ajax(
        {
            url: sUrl,
            type: 'GET',
            headers: { opnfor: 0, thisMatrix: enbl },
            contentType: 'application/json',
            success: function (result) {
                $("#initableList").html(buildTableList(result));
                $('#addForm').show();
            },
            error: function (result, statusTxt, xhr) {
                alert("Error: " + xhr.status + ": " + xhr.statusText);
            }
        });
}

function loadTableData() {
    // var site_id = nodelist[0].siteID;
    var site_id = 1;
    printConsole(site_id);
    var pframe = nodelist[0].iksFrame;
    var mdm_tbl_body;
    var mdm_tbl_header;
    var mdm_tbl_body_col
    if (pframe == 'mdm') {
        mdm_tbl_body = '<tr id="R{Row-ID}">{B-COLS}<td style="width:100px;text-align:center;">' + btn_edit + '</td></tr>';
        mdm_tbl_header = '<tr>{H-COLS}<td style="width:100px;">Action</td></tr>'
    } else {
        mdm_tbl_body = tbl_body;
        mdm_tbl_header = tbl_header;
    }
    var mdm_header_col = tbl_header_col;

    if ($("#initableList").children("option:selected").val() == 0) {
        $("#tbl-header").html(initialTableHeader);
        $("#tbl-body").html('');
    }
    else {
        $.ajax(
            {
                url: sUrl,
                type: 'GET',
                headers: { opnfor: 1, thisMatrix: $("#initableList").children("option:selected").val(), thisLOC: site_id },
                contentType: 'application/json',
                success: function (result) {
                    console.log(result);
                    tbl_data = result;
                    $("#tbl-header").html(buildTblHeader(result, mdm_header_col, mdm_tbl_header));
                    $("#tbl-body").html(buildTblData(result, mdm_tbl_body_col, mdm_tbl_body));
                },
                error: function (result, statusTxt, xhr) {
                    alert("Error: " + xhr.status + ": " + xhr.statusText);
                }
            });
        tblno = $("#initableList").children("option:selected").val();
    }
}

function editCell(e, tbl_data, tbl_no) {
    row = e;
    formData = [];
    inEditMode = true;
    printConsole(tbl_data);
    var jObj = tbl_data;
    var tbl_col = 0;
    for (i = 0; i < jObj.body.meta.length; i++) {
        var mR = jObj.body.meta[i].mR;
        var mRVal = mR.split("|");
        var mType = mRVal[4];
        var mField = mRVal[1];
        var mNull = mRVal[3];
        var mPH = mRVal[7];
        var htmlFF;
        formData.push($(e).children()[i]);
        // tbl_col = i;
        var cvisible = mRVal[11];
        var cKey = mRVal[6];
        var field_visible = true;

        if (cKey == 'UK' || cKey == 'LK') {
            field_visible = false;
            if (cvisible == '1') {
                field_visible = true;
            }
        } else {
            if (cvisible == '-1') {
                field_visible = false;
            }
        }
        // if (cKey == 'UK' || cKey == 'LK' || cvisible == '0') {
        console.log($(e).children()[tbl_col]);
        console.log(field_visible);
        if (field_visible) {
            // if (cKey != 'LK' && cKey != 'UK') {
            var strv = $(e).children()[tbl_col].innerHTML;
            if (mRVal[6] != '' && mRVal[9] != '') {
                getDropDownList(strv, mRVal[0], $(e).children()[tbl_col], mField, tbl_no);
            } else {
                if (mType == 'text' || mType == 'longtext') {
                    htmlFF = iTA.replace("{NAME}", mField).replace("{VALUE}", strv).replace("{PLACEHOLDER}", mPH);
                    if (mNull == 'N') {
                        htmlFF = htmlFF.replace("{REQUIRED}", "required");
                    }
                } else if (mType == 'varchar') {
                    htmlFF = iTxt.replace("{NAME}", mField).replace("{VALUE}", strv).replace("{PLACEHOLDER}", mPH);
                    console.log(htmlFF);
                    if (mNull == 'N') {
                        htmlFF = htmlFF.replace("{REQUIRED}", "required");
                    }
                }
                else if (mType == 'smallint' || mType == 'tinyint' || mType == 'year' || mType == 'int') {
                    htmlFF = iInt.replace("{NAME}", mField).replace("{VALUE}", parseInt(strv)).replace("{PLACEHOLDER}", mPH);
                    if (mNull == 'N') {
                        htmlFF = htmlFF.replace("{REQUIRED}", "required");
                    }
                }
                else if (mType == 'decimal') {
                    htmlFF = iDec.replace("{NAME}", mField).replace("{VALUE}", strv).replace("{PLACEHOLDER}", mPH);
                    if (mNull == 'N') {
                        htmlFF = htmlFF.replace("{REQUIRED}", "required");
                    }
                }
                else if (mType == 'datetime') {
                    htmlFF = iDate.replace("{NAME}", mField).replace("{VALUE}", strv).replace("{PLACEHOLDER}", mPH);
                    if (mNull = 'N') {
                        htmlFF = htmlFF.replace("{REQUIRED}", "required");
                    }
                }
                $(e).children()[tbl_col].innerHTML = htmlFF;
            }
            tbl_col++;
        }
    }
    if (insertMode == false && nodelist[0].iksFrame == 'mdm') {
        $(e).children()[tbl_col].innerHTML = tbl_body_col.replace("{B-COL-VALUE}", btn_update + " " + btn_cancel).replace("{COL-WIDTH}", 100);
    }
}


function getDropDownList(cellText, cellIndex, e, mf, p_tbl_no) {
    var st = nodelist[0].siteID;
    console.log(e);
    var strdd = '';
    var fdd;
    var oldValue;
    $.ajax(
        {
            url: sUrl,
            type: 'GET',
            headers: { opnfor: 2, thisMatrix: p_tbl_no, thisvertical: cellIndex, thisLOC: st },
            contentType: 'application/json',
            success: function (result) {
                for (i = 0; i < result.body.rData.length; i++) {
                    var c = result.body.rData[i].c;
                    var mRVal = c.split("|");
                    var tdd = dropdown.replace("{OPTION-ID}", mRVal[0]).replace("{OPTION-LIST}", mRVal[1]);
                    var seltxt;
                    if (mRVal[1] == cellText) {
                        seltxt = 'selected';
                        oldValue = mRVal[0];
                    } else {
                        seltxt = ' ';
                    }
                    tdd = tdd.replace("{SELECTED}", seltxt);
                    strdd += tdd;
                }
                if (nodelist[0].iksFrame == 'inw_header' || nodelist[0].iksFrame == 'otw_header' || nodelist[0].iksFrame == 'inw_pickbysite') {
                    fdd = "<select id='productDetails' name='" + mf + "' oldVal='" + oldValue + "' required style='max-width:95%' onchange='getInvDetails();'><option value='null'>select</option>" + strdd + "</select>";
                } else {
                    fdd = "<select id='productDetails' name='" + mf + "' oldVal='" + oldValue + "' required style='max-width:95%;align:center;'><option value='null'>select</option>" + strdd + "</select>";
                }
                str_dropdown = fdd;
                e.innerHTML = str_dropdown;
            },
            error: function (result, statusTxt, xhr) {
                alert("Error: " + xhr.status + ": " + xhr.statusText);
            }
        });
}

function displayResult(result) {
    // alert testing test123
    if (result.msg != "") {
        //alert(result.msg);
        console.log(result.tmsg);
        return false;
    } else {
        return true;
    }
}

function switchModule(hPage) {
    var sPage = parent.document.getElementById("moduleContainer");
    sPage.src = hPage + ".html";
}

function showAlerts(alertType, sMsg) {
    var sAlerts = '<div class="alert alert-{ALERT-TYPE} alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>{MSG}</strong></div>';
    var alertClass;
    if (alertType == 1) {
        alertClass = "success";
    } else {
        alertClass = "danger";
    }
    sAlerts = sAlerts.replace("{ALERT-TYPE}", alertClass).replace("{MSG}", sMsg);
    var alertDiv = parent.document.getElementById("fm-alerts");
    alertDiv.innerHTML += sAlerts;
}
