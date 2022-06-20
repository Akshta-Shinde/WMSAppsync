var sUrl = "https://hjv36v7vgd.execute-api.ap-south-1.amazonaws.com/dev/iks/operations";
var edit_button = '<button class="fa fa-pencil" title="Edit Header" onclick="editSANHeader()" style="float: right;font-size:30px;"></button>';
var buttons = '<button onclick="cancel()" style="float: right;font-size:20px;"><i class="fa fa-close" aria-hidden="true"></i></button><button onclick="saveSANHeader()" style="float: right;font-size:20px;"><i class="fa fa-check" aria-hidden="true"></i></button>'
var tbl_data_mdm;
var btn_delete = '<button type= "button" style="font-size:20px;border:none;background-color: transparent;color:red;" onclick="deleteItem(this.parentElement.parentElement)" title="Click To Delete"><i class="fas fa-trash"></i></button>';
var btn_edit = '<button type= "button" style="font-size:20px;border:none;background-color: transparent;color:white;float: right;" onclick="editHeader();" title="Click To Edit"><i class="fas fa-pen"></i></button>';
var btn_cancel = '<button type= "button" style="font-size:20px;border:none;background-color: transparent;color:red;float: right;" onclick="cancel();" title="Click To Cancel"><i class="fa fa-times"></i></button>';
var btn_check = '<button type= "button" style="font-size:20px;border:none;background-color: transparent;color:green;float: right;" onclick="update()" title="Click To Check"><i class="fa fa-check"></i></button>';
var dropdown = '<option value="{OPTION-ID}" {SELECTED}>{OPTION-LIST}</option>';

$.when($.ready).then(function () {
    // loadSatgeDetails(tblNo, txnNo, warehouse, customer);
	loadSatgeDetails("2", "TXN0001", "WH01", "A", "A-V");
});

function setStageDetails_old(result){
	tbl_data_mdm = result;
	$("#displayTitle").html(result.body.title);
	$("#displayHeader").html(result.body.header);
	$("#displayLineItems").html(result.body.LineItems);
	$("#actions").html(btn_edit);
	$('#displayHeader input').attr('readonly', true);
	$('#displayHeader select').attr('disabled', true);
}

function readonlyForm(){
	$("#actions").html(btn_edit);
	$('#displayHeader input').attr('readonly', true);
	$('#displayHeader select').attr('disabled', true);
}

function setStageDetails(result){
	tbl_data_mdm = result;
	// const myObj = JSON.parse(result);
	result = result.body;

	for (const key in result) {
		// $("#displayTitle").html(result.body.title);
		var elementId = "display" + key;
		$("#" + elementId).html(result[key]);
	}
	readonlyForm();
}

function loadSatgeDetails(tblNo, txnNo, warehouse, customer, activityNo) {
	var header = {
		opnfor: 120100, 
		tableNo: "2",  
		activity: "A-V",
		transaction: "TXN0001", 
		warehouse: "WH01",
		customer: "A"
	}
	getPrcessStageDetails(header, setStageDetails);
}

function editHeader(){
    $('#displayHeader input').attr('readonly', false);
    $('#displayHeader select').attr('disabled', false);
    $("#actions").html(btn_cancel + btn_check);
	var jObj = tbl_data_mdm;

	for (i = 0; i < jObj.body.headerMeta.length; i++) {
		var mR = jObj.body.headerMeta[i].mR;
        var mRVal = mR.split("|");
		var mField = mRVal[1];
		var cKey = mRVal[6];
		if (cKey == 'UK' || cKey == 'LK') {
			$('#' + mField).attr('readonly', true);
		}
		else if (mRVal[6] != '' && mRVal[9] != '') {
			var defaulSelected = $('#' + mField)[0].attributes[1].value;
			var e = $('#' + mField)[0];
			getDropDownList1(defaulSelected, mRVal[0], e, mField, 2);
			// var header = {
			// 	opnfor: 2, 
			// 	tableNo: "2",  
			// 	where: mRVal[0],
			// 	warehouse: "WH01",
			// 	customer: "A"
			// }
			// getPrcessStageDetails(header, setDropDown);
		}
	}
}

function setDropDown(cellText, cellIndex, e, mf, p_tbl_no) {
    var strdd = '';
    var fdd;
    var oldValue;

	for (i = 0; i < result.body.rData.length; i++) {
		var c = result.body.rData[i].c;
		var mRVal = c.split("|");
		var tdd = dropdown.replace("{OPTION-ID}", mRVal[0]).replace("{OPTION-LIST}", mRVal[1]);
		var seltxt;
		if (mRVal[0] == cellText) {
			seltxt = 'selected';
			oldValue = mRVal[0];
		} else {
			seltxt = ' ';
		}
		tdd = tdd.replace("{SELECTED}", seltxt);
		strdd += tdd;
	}
	fdd = "<select class='form-control' id='" + mf + "' name='" + mf + "'>" + strdd + "</select>";
	str_dropdown = fdd;
	e.innerHTML = str_dropdown;
}

function getDropDownList1(cellText, cellIndex, e, mf, p_tbl_no){
	var strdd = '';
    var fdd;
    var oldValue;
	var wh = "WH01";
	var cust =  "A";
    $.ajax(
        {
            url: sUrl,
            type: 'GET',
            headers: { opnfor: 2, tableNo: p_tbl_no, where: cellIndex, warehouse: wh, customer: cust},
            contentType: 'application/json',
            success: function (result) {
                for (i = 0; i < result.body.rData.length; i++) {
                    var c = result.body.rData[i].c;
                    var mRVal = c.split("|");
                    var tdd = dropdown.replace("{OPTION-ID}", mRVal[0]).replace("{OPTION-LIST}", mRVal[1]);
                    var seltxt;
                    if (mRVal[0] == cellText) {
                        seltxt = 'selected';
                        oldValue = mRVal[0];
                    } else {
                        seltxt = ' ';
                    }
                    tdd = tdd.replace("{SELECTED}", seltxt);
                    strdd += tdd;
                }
				fdd = "<select class='form-control' id='" + mf + "' name='" + mf + "'>" + strdd + "</select>";
				str_dropdown = fdd;
                e.innerHTML = str_dropdown;
            },
            error: function (result, statusTxt, xhr) {
                alert("Error: " + xhr.status + ": " + xhr.statusText);
            }
        });
}

function cancel(){
	loadSatgeDetails("2", "TXN0001", "WH01", "A");
	$("#actions").html(btn_edit);
}

function update(){
	var fa = [];
	var jObj = tbl_data_mdm;
	var kVal;
	var tKey = '';
	var tVer = '';
	var isDropdown = false;
	var user = 'emiza';

	for (i = 0; i < jObj.body.headerMeta.length; i++) {
		var isDropdown = false;
		var mR = jObj.body.headerMeta[i].mR;
		var mRVal = mR.split("|");
		var mField = mRVal[1];
		var cKey = mRVal[6];
		var ctype = mRVal[4];
		var field_visible = true;
		var cvisible = mRVal[11];
		var dVal = '';
		var cVal = '';

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

		if (field_visible) {
			var fName = mField;
			if (mRVal[6] == '' && mRVal[9] == '') {
				if(ctype == 'timestamp'){
					// STR_TO_DATE('11-Jun-2022 11:50', '%d-%b-%Y %H:%i:%s')
					var cVal = "STR_TO_DATE('" + document.getElementById(mField).value + "', '%d-%b-%Y %H:%i:%s')";	
					fa.push(
						fName + "=" + cVal
					)
				}else{
					var cVal = document.getElementById(mField).value;
					fa.push(
						fName + "='" + cVal + "'"
					)
				}
			}else{
				var cVal = $('select#' + mField).find('option:selected').val();
				dVal = cVal;
				fa.push(
					fName + "='" + cVal + "'"
				)
			}
		}

		var islkpk = false;
		if (cKey == 'LK' || cKey == 'UK' || cKey == 'PK') {
			islkpk = true;
			kVal = cVal;
			if (!field_visible) {
				kVal = document.getElementById(mField).value;
			}
			if (isDropdown) {
				if (dVal != cVal) {
					kVal = dVal;
				}
			}
			tKey = mRVal[1];
		}

		if (islkpk) {
			if (tVer != "") {
				tVer = tVer + " AND " + tKey + "='" + kVal + "'";
			} else {
				tVer = tKey + "='" + kVal + "'";
			}
		}
	}

	fa.push(
		"ModifiedBy='" + user + "', ModifiedDate=now()"
	)

	var header = {
		opnfor: 120100, 
		tableNo: "2", 
		activity: "A-06", 
		where: tVer, 
		fieldArray: fa,
		user: 'emiza' 
	};
	getPrcessStageDetails(header, loadSatgeDetails)
}

function editLineItem(e){
	console.log(e);
}

function deleteLineItem(e){
	console.log(e);
}
