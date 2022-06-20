var sUrl = "https://hjv36v7vgd.execute-api.ap-south-1.amazonaws.com/dev/iks";
// var stages =[];
var current_po = '';
var current_client = '';
// var VASstages =[];


$( document ).ready(function() {
    console.log( "document loaded" );
    document.getElementById("id-02").style.display = "none";
    getOperationCount();

});

// Creating new PO from Screen
function getOperationCount() {
    console.log('inside getOperation function');
    $.ajax(
        {
            url: sUrl,
            type: 'GET',
            headers: { opnfor: 1011},
            contentType: 'application/json',
            success: function (result) {
                $("#id-01").html(buildTableRows(result));
                console.log('getOperationCount: ',result);
                document.getElementById("id-02").style.display = "block";
            },
            error: function (result, statusTxt, xhr) {
                alert("Error: " + xhr.status + ": " + xhr.statusText);
            }
        });
}

function getCustomerWiseCount(stage) {
    console.log('Insite customer fun: ', stage);
    $.ajax(
        {
            url: sUrl,
            type: 'GET',
            headers: { opnfor: 1012, thisMatrix: stage},
            contentType: 'application/json',
            success: function (result) {
                document.getElementById("txnDetails").style.display = "block";
                $('#poDetails').html(buildCustomerDiv(result));

                // console.log('customerWise:',result);
            },
            error: function (result, statusTxt, xhr) {
                alert("Error: " + xhr.status + ": " + xhr.statusText);
            }
        });
}

/// for displaying the selected Po.
function getPoDetails(po, cno) {
    console.log('Inside po details: ', po, cno);
    current_client = cno;
    // $.ajax(
    //     {
    //         url: sUrl,
    //         type: 'GET',
    //         headers: {opnfor: 1013, thisMatrix: po},
    //         contentType: 'application/json',
    //         success: function (result) {
    //             console.log('buildPODetailsRows:',result);
    //             $("#tbl-PoStages").html(buildPODetailsRows(result));
    //             document.getElementById("NextStage").value =po;
    //         },
    //         error: function (result, statusTxt, xhr) {
    //             alert("Error: " + xhr.status + ": " + xhr.statusText);
    //         }
    //     });
}
function getActivityDetails(po) {
    $.ajax(
        {
            url: sUrl,
            type: 'GET',
            headers: { opnfor: 1009, thisMatrix: po},
            contentType: 'application/json',
            success: function (result) {
                $("#tbl-StagesActivity").html(buildActivityTableRows(result));
            },
            error: function (result, statusTxt, xhr) {
                alert("Error: " + xhr.status + ": " + xhr.statusText);
            }
        });
}
// Displaying PO in table format

function buildTableRows(result){
    console.log('buildAccordian', result);
    var jObj = result;
    var sBodyCols = '';
    let stageSum = 0;
    for (i = 0; i < jObj.body.rData.length; i++) {
        var mR = jObj.body.rData[i].c;
        var mRVal = mR.split("|");
        stageSum = stageSum + parseInt(mRVal[3]);
    }
    sBodyCols +='<div class="card-head card-head-xs style-default collapsed" data-toggle="collapse" data-parent="#accordion10" data-target="#accordion10-1" aria-expanded="false" style="margin-bottom: 2px;"> <header>Inward</header><header style="margin-left:52%;">'+stageSum+'</header></div><div id="accordion10-1" class="collapse" aria-expanded="false" style="height: 0px;">'
    for (i = 0; i < jObj.body.rData.length; i++) {
        var mR = jObj.body.rData[i].c;
        var mRVal = mR.split("|");
        sBodyCols += '<div class="card-body" style="padding:10px"><div id="'+mRVal[1]+'" class="card-head card-head-xs style-default-light collapsed" style="margin-bottom: 2px;" data-toggle="collapse" data-parent="#accordion'+mRVal[1]+' data-target="#accordion'+mRVal[1]+'-1" aria-expanded="false" onclick="getCustomerWiseCount(this.id)"><header>'+mRVal[2]+'</header><header style="text-align:right;">'+mRVal[3]+'</header><div class="row"><div id="'+mRVal[1]+'-1" class="card-head card-head-xs style-default-light collapsed" style="margin-bottom: 2px;"></div></div></div></div>'
    }
    sBodyCols += '</div>';
    return sBodyCols; 
}
function buildPODetailsRows(result){
    var jObj = result;
    var sBodyCols = '';
    var po = '';
    
    for (i = 0; i < jObj.body.rData.length; i++) {
        sBodyCols += '<tr>'
        var mR = jObj.body.rData[i].c;
        var mRVal = mR.split("|");
console.log('error:', mRVal);
        for(ic = 0; ic < mRVal.length; ic++){
            po = mRVal[0];
            sBodyCols += '<td>'+mRVal[ic]+ '</td> '
        }
        // sBodyCols += '<td><button class="btn btn-block ink-reaction btn-raised btn-xs btn-primary-bright" onclick="getNextStage(' +"'" +mRVal[0] +"'" +')">Next Stage</button><td></tr>';
        sBodyCols += '</tr>';
        current_po = mRVal[0];
    }
    console.log('currentPO: ',current_po);
    getActivityDetails(current_po);
    return sBodyCols; 
}

function buildCustomerDiv(result){
    var jObj = result;
    var sBodyCols ='';
    var po = '';
    var cno = '';
    for (i = 0; i < jObj.body.rData.length; i++) {
        var mR = jObj.body.rData[i].c;
        var mRVal = mR.split("|");
        po = mRVal[1];
        cno = mRVal[2];
        console.log(mRVal);
        console.log('mRVal:',cno, po);
        // sBodyCols += '<a href="example.html"><tr>'
        sBodyCols += '<tr onclick="location.href='+"'index.html'"+'">'
        // sBodyCols += '<tr onclick="getPoDetails(' +"'" +po +"','" + cno+"'"+')">'
        for(ic = 0; ic < mRVal.length-1; ic++){
            sBodyCols += '<td>'+mRVal[ic]+ '</td>'
        }
        sBodyCols += '</tr></a>';
    }
    console.log('sBodyCols:',sBodyCols)
    return sBodyCols; 
}

// Displaying activities in table format
function buildActivityTableRows(result){
    var jObj = result;
    var sBodyCols = '';
    
    for (i = 0; i < jObj.body.rData.length; i++) {
        sBodyCols += '<tr>'
        var mR = jObj.body.rData[i].c;
        var mRVal = mR.split("|");
        // for(ic = 1; ic < mRVal.length-1; ic++){
        sBodyCols += '<td>'+mRVal[1]+ '</td>'
        if(mRVal[4].includes("X")){
            //   sBodyCols += '<td></td>';
            sBodyCols += '<td><button class="btn btn-block ink-reaction btn-raised btn-xs" title="'+mRVal[1]+'" onclick="getNextStage(' +"'" +current_po +"'" +')"style="color:white;background-color:' +mRVal[0]+'">' +mRVal[2]+'</button></td>';
          }
          else {
              sBodyCols += '<td><button class="btn btn-block ink-reaction btn-raised btn-xs" title="'+mRVal[1]+'"style="color:white;background-color:' +mRVal[0]+'">' +mRVal[2]+'</button></td>';
            }
          sBodyCols += '<td><button class="btn dropdown-toggle" onclick="getActivityHelp()" title="'+mRVal[5]+'" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-question"></i></button></td>'
        // }

        sBodyCols += '</tr>';
    }
    // current_po = mRVal[0];
    // getActivityDetails(current_po);
    return sBodyCols; 
}

function getActivityHelp(){
    $("#activityHelp").toggle();

}

function getNextStage(po) {
    // Standard Module stages
    // var e = document.getElementById("clientId");
    clientId = current_client;
    console.log(po, current_client);
    // --e.options[e.selectedIndex].value;
    if(clientId == ''){
        alert('Please select client');
    }
    else{
        // var e = document.getElementById("clientId");
        clientId = current_client;
        // e.options[e.selectedIndex].value;
        $.ajax(
            {
                url: sUrl,
                type: 'GET',
                headers: { opnfor: 1007, thisMatrix: clientId, thisvertical: po},
                contentType: 'application/json',
                success: function (result) {
                    // $("#tbl-PoStages").html(buildSTDTableRows(result));
                    console.log('Stage updated...');
                    getUpdatedStage(clientId, po);
                    // current_client = '';
                    // current_po = '';
                },
                error: function (result, statusTxt, xhr) {
                    alert("Error: " + xhr.status + ": " + xhr.statusText);
                }
            });
    }
}

function getUpdatedStage(clientId, po) {
    console.log('getUpdatedStage:',clientId, po);
    $.ajax(
        {
            url: sUrl,
            type: 'GET',
            headers: { opnfor: 1008, thisMatrix: clientId, thisvertical: po},
            contentType: 'application/json',
            success: function (result) {
                console.log('getting updated stage', result);
                $("#tbl-PoStages").html(buildPODetailsRows(result));
            },
            error: function (result, statusTxt, xhr) {
                alert("Error: " + xhr.status + ": " + xhr.statusText);
            }
        });

}