

loadJSON('/getusergoals', prepareGoalSelect);

var undoBtn = document.getElementById("undo");
var redoBtn = document.getElementById("redo");

function roadChanged() {
    var bufStates = editor.undoBufferState();
    if (bufStates.undo === 0)  {
      undoBtn.disabled = true;
      undoBtn.innerHTML = "Undo (0)";
    } else {
      undoBtn.disabled = false;
      undoBtn.innerHTML = "Undo ("+bufStates.undo+")";
    }
    if (bufStates.redo === 0)  {
      redoBtn.disabled = true;
      redoBtn.innerHTML = "Redo (0)";
    } else {
      redoBtn.disabled = false;
      redoBtn.innerHTML = "Redo ("+bufStates.redo+")";
    }
}

var editor2 = new bmndr({divGraph: document.getElementById('roadgraph2'),
                        divTable: document.getElementById('roadtable2'),
                        roadEditor:false,
                        maxFutureDays: 365,
                        showFocusRect: false,
                        showContext: true});
if (document.getElementById("showalldata2").checked) editor2.maxDataDays(-1); else editor2.maxDataDays(100);
editor2.reverseTable(document.getElementById("reversetable2").checked);

var editor = new bmndr({divGraph: document.getElementById('roadgraph'),
                        divTable: document.getElementById('roadtable'),
                        roadEditor: true,
                        maxFutureDays: 365,
                        showFocusRect: true,
                        showContext: true,
                        onRoadChange: roadChanged});
if (document.getElementById("showalldata").checked) editor.maxDataDays(-1); else editor.maxDataDays(100);
editor.showData(document.getElementById("showdata").checked);
editor.showContext(document.getElementById("showcontext").checked);
editor.keepSlopes(document.getElementById("keepslopes").checked);
editor.keepIntervals(document.getElementById("keepintervals").checked);
editor.reverseTable(document.getElementById("reversetable").checked);
editor.autoScroll(document.getElementById("autoscroll").checked);

//editor2.loadGoal(document.getElementById("roadselect").value);

document.onkeydown = documentKeyDown;



// Helper Functions. Something about function hoisting?

function loadJSON( url, callback ) {   

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', url, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            //if (xobj.readyState == 4) {
            callback(JSON.parse(xobj.responseText));
        }
    };
    xobj.send(null);  
}

function documentKeyDown(e) {
    var evtobj = window.event? window.event : e;
    if (evtobj.keyCode == 89 && evtobj.ctrlKey) editor.redo();
    if (evtobj.keyCode == 90 && evtobj.ctrlKey) editor.undo();
}

function prepareGoalSelect(goalist) {
  var roadSelect = document.getElementById('roadselect');
  var c = document.createDocumentFragment();
  goalist.forEach(function(slug,index){
    var opt = document.createElement("option");
    opt.text = slug;
    opt.value = slug;
    roadSelect.add(opt);
  })
  roadSelect.addEventListener("change", handleGoalSelect);
  roadSelect.value = goalist[0];
  editor.loadGoal('/getgoaljson/'+roadSelect.value);
  editor2.loadGoal('/getgoaljson/'+roadSelect.value);
}

function handleGoalSelect() {
  console.log("handling goal select: "+this.value);
  //console.log(event.target.value)
  editor.loadGoal('/getgoaljson/'+this.value)
  editor2.loadGoal('/getgoaljson/'+this.value)
  /*
  //alternately: use the loadJSON fn to just get the bb json data directly?
  loadJSON('/getgoaljson/'+event.target.value, function(data) {
    console.log(data)
    editor.loadGoal(document.getElementById("roadselect").value);
    //editor.loadRoad(data);
    //editor.roadChanged();
    //editor.updateRoadTableTitle();
  })
  */
}