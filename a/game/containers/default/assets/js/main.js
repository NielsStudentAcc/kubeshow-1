var api = new API(servicehost);
var deploymentAPI = new DEPLOYMENTAPI(adminhost);
var pods = new PODS();
var podsUI = new PODSUI(pods);

function init(){
	DEPLOYMENTAPI.Get(handlePods, handlePodsError);
}

function handlePods(e){
    podsUI.DrawPods(e);
}

function handlePodsError(e){
    $(".pods").html("");
    console.log("Error getting pods:", e);
}

