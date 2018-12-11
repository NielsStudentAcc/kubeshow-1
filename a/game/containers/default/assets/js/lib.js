var servicehost = "";
var adminhost = "";

function PODS(){
    this.max = 12;
    var podsArray = [];
    var DoNotReAdd = new Object();

    var initPods = function(){
        podsArray = [];
        for (var i = 0; i < this.max; i++){
            podsArray[i] = "";
        }
    };

    this.SetMax = function(max){
        this.max = max;
        initPods();
    };
    initPods();

    this.FindEmpty = function(){
        for (var i = 0; i < this.max; i++){
            if (typeof podsArray[i] !== 'object'){
                return i;
            }
        }
        return -1;
    };

    this.IsPodPresent = function(name){
        for (var i = 0; i < podsArray.length; i++){
            if (typeof podsArray[i] !== 'object'){
                continue;
            }

            if(name == podsArray[i].name){
                return true;
            }
        }
        return false;
    };

    this.Get = function(input){
        if (typeof input == "string") {
            var name = input;
            for (var i = 0; i < podsArray.length; i++){
                if (typeof podsArray[i] !== 'object'){
                    continue;
                }

                if(name == podsArray[i].name){
                    return podsArray[i];
                }
            }
        }

        if (typeof input == "number") {
            return podsArray[input];
        }

        return ;
    };

    this.Set = function(pod){
        if (DoNotReAdd.hasOwnProperty('pod.name')){
            return;
        }
        podsArray[pod.holder] = pod;
    };

    this.Delete = function(pod){
        DoNotReAdd[pod.name] = true;
        podsArray[pod.holder] = "";
    };

    this.Count = function(){
        return podsArray.length;
    };

    this.Add = function(json){
        var name = json.metadata.name;
        var pod = new POD(json);

        if (this.IsPodPresent(name)){
            pod = this.Get(name);
        } else{
            var target = this.FindEmpty();
            pod.holder = target;
        }

        pod.SetPhase(json);

        if (pod.holder != -1){
            this.Set(pod);
        }
    }



}

function PODSUI(pods, logwindow){
    var pods = pods;
    console.log(pods);
    if (typeof(logwindow)==='undefined') logwindow = new LOGWINDOW();

    var alreadyShown = new Object();
    alreadyShown.terminating = new Object();
   
    this.ClearTerminating = function(){
        for (var i = 0; i < pods.Count(); i++){
            var podObj = pods.Get(i);
            if (podObj.ShouldRemove() ){
                pods.Delete(podObj);
                var poddiv = document.getElementById(podObj.name);
                if (poddiv != null){
                    poddiv.parentNode.removeChild(poddiv);
                }

            }
        }
    }

    this.ClearMissing = function(podNames){
        var podsDOM = document.querySelectorAll('.pod'), i;

        for (i = 0; i < podsDOM.length; ++i) {

            if (podNames.lastIndexOf(podsDOM[i].id) < 0){
                pods.Delete(podsDOM[i].id);
                //TODO: uncomment.
                podsDOM[i].parentNode.removeChild(podsDOM[i]);
            }
        }
    }

    this.ClearAll = function(){
        for (var i = 0; i < pods.Count(); i++){
            var podObj = pods.Get(i);
            var poddiv = document.getElementById(podObj.name);
            if (poddiv){
                poddiv.parentNode.removeChild(poddiv);
            }
        }
    }

    this.AddPod  = function(pod, hitHandler){

        var div = document.getElementById(pod.name);

        if (!div){
            div = document.createElement("div");
            div.id = pod.name;
            div.dataset.selflink = pod.selflink;
            div.classList.add("pod");
            var span = document.createElement("span");
            span.innerHTML = pod.shortname;
            span.dataset.selflink = pod.selflink;
            div.append(span);
            $("#pod-" + pod.holder).append(div);
            logwindow.Log(pod);
        }

        div.classList.add(pod.phase);

        if (pod.phase == "running"){
            div.addEventListener("click", hitHandler);
        } else{
            div.removeEventListener("click", hitHandler);
        }

    }

    this.DrawPods = function(json){
        var podNames = [];
        console.log('JSON > ' + JSON.stringify(json));
        for (var i = 0; i < json.items.length; i++){
            podNames.push(json.items[i].metadata.name);
        }

        this.ClearTerminating();
        this.ClearMissing(podNames);

        for (var i = 0; i < json.items.length; i++){
            pods.Add(json.items[i]);
        }
        
        console.log(podNames);
    }
}

function API(hostname){ 

    this.debug = false;
    this.fails = 0;
    this.fail_threshold = 2;
    var apihostname = window.location.host;
    this.timeout = 5000;
    var apiprotocol = window.location.protocol + "//";
    if (apihostname.length == 0){
        apiprotocol ="";
    }
    var uri_color = "/api/color/";
    var uri_color_complete = "/api/color-complete/";

    var ajaxProxy = function(url, successHandler, errorHandler, timeout) {
        timeout = typeof timeout !== 'undefined' ? timeout : this.timeout;
        var connections = $.ajax({
            url: url,
            success: successHandler,
            error: errorHandler,
            timeout: timeout

        });
        if (this.debug){
            console.log("Called: ", url);
        }
    };

    var getColorURI = function(){
        return apiprotocol + apihostname + uri_color;
    };

    var getColorCompleteURI = function(){
        return apiprotocol + apihostname + uri_color_complete;
    };

    this.Color = function(successHandler, errorHandler){
        ajaxProxy(getColorURI(), successHandler, errorHandler, 400);
    };

    this.ColorComplete = function(successHandler, errorHandler){
        ajaxProxy(getColorCompleteURI(), successHandler, errorHandler, 400);
    };

    this.URL = getColorURI;

    this.IsHardFail = function(){
        if (this.fails > this.fail_threshold){
            return true;
        } else {
            this.fails++;
            return false;
        }
    };

    this.ResetFails = function(){
        if (this.fails != 0){
            this.fails = 0;
            return true;
        } 
        return false;
    };

}

function DEPLOYMENTAPI(hostname, logwindow){
    if (typeof(logwindow)==='undefined') logwindow = new LOGWINDOW();

    this.debug = false;
    var apihostname = window.location.host;
    this.timeout = 5000;
    var apiprotocol = window.location.protocol + "//";
    if (apihostname.length == 0){
        apiprotocol ="";
    }
    var uri_getnodes = "/admin/k8s/nodes/get";
    var uri_get = "/admin/k8s/pods/get";
    var uri_delete = "/admin/k8s/deployment/delete";
    var uri_create = "/admin/k8s/deployment/create";
    var uri_deletepod = "/admin/k8s/pod/delete?pod=";
    var uri_drain = "/admin/k8s/node/drain?node=";
    var uri_uncordon = "/admin/k8s/node/uncordon?node=";


    var getPodsURI = function(){
        return apiprotocol + apihostname + uri_get;
    };

    var getNodesURI = function(){
        return apiprotocol + apihostname + uri_getnodes;
    };

    var getDeleteURI = function(){
        return apiprotocol + apihostname + uri_delete;
    };

     var getDeletePodURI = function(){
        return apiprotocol + apihostname + uri_deletepod;
    };

    var getCreateURI = function(){
        return apiprotocol + apihostname + uri_create;
    };

    var getDrainURI = function(){
        return apiprotocol + apihostname + uri_drain;
    };

    var getUncordonURI = function(){
        return apiprotocol + apihostname + uri_uncordon;
    };

    var success = function(e){
        if (typeof(logwindow)!='undefined') {
            logwindow.Log(e);
        }
    };

    var error = function(e){
        if (typeof e.status != "undefined" && e.status == 404){
            console.log("Item not found which in most cases is expected.");
        } else{
            console.log("Failure: " , e);
        } 
        
    };

    var ajaxProxy = function(url) {
        $.ajax({
            url: url,
            success: success,
            error: error,
            timeout: this.timeout

        });
        if (this.debug){
            console.log("Called: ", url);
        }

    };

    this.Delete = function(){
        ajaxProxy(getDeleteURI());
    };

    this.DeletePod = function(pod, successHandler, errorHandler){
        var url = getDeletePodURI() + pod;
        $.ajax({
            url: url,
            success: successHandler,
            error: errorHandler,
            timeout: this.timeout
        });
        if (this.debug){
            console.log("Called: ", url);
        }
    };

    this.DrainNode = function(node, successHandler, errorHandler){
        var url = getDrainURI() + node
        $.ajax({
            url: url,
            success: successHandler,
            error: errorHandler,
            timeout: this.timeout

        });
        if (this.debug){
            console.log("Called: ", url);
        }
    };

    this.UncordonNode = function(node, successHandler, errorHandler){
        var url = getUncordonURI() + node
        $.ajax({
            url: url,
            success: successHandler,
            error: errorHandler,
            timeout: this.timeout

        });
        if (this.debug){
            console.log("Called: ", url);
        }
    };

    this.Create = function(successHandler, errorHandler){
        var url = getCreateURI();
        $.ajax({
            url: url,
            success: successHandler,
            error: errorHandler,
            timeout: this.timeout

        });
        if (this.debug){
            console.log("Called: ", url);
        }
    };

    this.Get = function(successHandler, errorHandler){
        var url = getPodsURI();
        $.ajax({
            url: url,
            success: successHandler,
            error: errorHandler,
            timeout: this.timeout

        });
        if (this.debug){
            console.log("Called: ", url);
        }
    };

    this.GetNodes = function(successHandler, errorHandler){
        var url = getPodsURI();
        $.ajax({
            url: url,
            success: successHandler,
            error: errorHandler,
            timeout: this.timeout

        });
        if (this.debug){
            console.log("Called: ", url);
        }
    };

    this.ResetNodes = function(){
        this.GetNodes(handleRefreshNodes);

    };

    var handleRefreshNodes = function(nodes, ex){
        for (var i = 0; i < nodes.items.length; i++){
            var node = nodes.items[i];
            var url = getUncordonURI() +  node.metadata.name;
            ajaxProxy(url);
        }
    };


}
