/**
 *  TODO
 *  Task 1:
 *  Encapsulate AJAX call logic into Promise based approach
 *
 *  Task 2:
 *  Add FrontEnd validations to the application
 *
 *  Task 3:
 *  Write TestCases using Jasmine
 *
 **/
// function storeResponse(){
//     var responseData;
//     return{
//         _getResponse: function(){
//             return responseData;
//         },
//         setResponse: function(data){
//             responseData = data;
//         }
//     }
// }
//
// function makeAjaxCall(url,respondFn,type,data){
//     var xhttp = new XMLHttpRequest(), reqType, postData;
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//             respondFn(JSON.parse(this.responseText));
//             //document.getElementById("demo").innerHTML = this.responseText;
//         }
//     };
//     if(!type){
//         reqType = "GET";
//     }else{
//         reqType = type.toUpperCase();
//         //Send the proper header information along with the request
//     }
//     xhttp.open(reqType, url, true);
//     xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//     postData = data || {};
//     xhttp.send(postData);
// }

function getAjaxPromise(requestUrl, requestType, postData){

    if(!requestUrl){
        return new Error('{"name":"NoReqURL","message":"Hey you! use url first"}');
    }

    if (requestType && requestType.toUpperCase()==="POST" && typeof postData === "undefined"){
        return new Error('{"name":"NoPostData","message":"Need Post Data with requestType: POST"}');
    }

    var ajaxPromise = new Promise (function(resolve,reject){

        var xhttp = new XMLHttpRequest();

        // Set Type to GET or POST
        if(!requestType) {
            requestType = "GET";
        }
        else{
            requestType = requestType.toUpperCase();
        }

        // Set data
        postData = postData || {} ;

        xhttp.open(requestType,requestUrl,true);
        //xhttp.setRequestHeader("Content-type", "multipart/form-data");
        xhttp.onload = function(){
            if(xhttp.status === 200)
                resolve(JSON.parse(xhttp.response));
            else
                reject(xhttp.statusText);
        }
        xhttp.onerror = function(){
            reject(xhttp.statusText);
        }

        xhttp.send(postData);
    });

    return ajaxPromise;
}

function initCarousel(){
    var getCarsUrl = "/api/getcars";
    var allCars = [], currentCarid="";

    function init(){
        getAjaxPromise(getCarsUrl).then(function(data){
            allCars=data;
            if(allCars.length){
                updateCarousel(allCars[0]["carid"]);
            }
            populateTable(allCars);
        });
        var linkCarouselLeft = document.getElementById("link-carousel-left");
        var linkCarouselRight = document.getElementById("link-carousel-right");
        linkCarouselLeft.addEventListener("click",function(){
           moveCarousel(-1);
        });
        linkCarouselRight.addEventListener("click",function(){
            moveCarousel(1);
        });

        var linkAddCar = document.getElementById("link-add-car");
        linkAddCar.addEventListener("click",function(){
           var sectionMain = document.getElementById("section-main");
           sectionMain.style.display = "none";

           var sectionAddCar = document.getElementById("section-add-car");
           sectionAddCar.style.display = "block";
        });

        var linkRemoveAll = document.getElementById("link-remove-all");
        linkRemoveAll.addEventListener("click", function() {
            var blnRemoveConfirm = window.confirm("Are you sure to delete all cars");
            if (blnRemoveConfirm) {

                for (var k = allCars.length - 1; k >= 0; k--) {
                    var formPostData = new FormData();
                    formPostData.append('carid',allCars[k].carid);
                    getAjaxPromise("/api/removecar", "POST", formPostData).then(function (data) {

                    });
                    removeCarFromTable(allCars[k].carid);
                }
            }
        });

        var btnAddCar = document.getElementById("btn-add-car");
        btnAddCar.addEventListener("click",function(){
            document.getElementById("hidden-carid").value = document.getElementById("car-manf").value.toString().substring(0,3).toUpperCase() + document.getElementById("car-model").value.toString().substring(0,3).toUpperCase();
            var formAddCar = document.getElementById("form-new-car"),
                inputs = formAddCar.getElementsByTagName("input"),
                formData = {}, urlAddCar = "/api/addcar";

            var formData = new FormData(formAddCar);

            // for(var i=0; i< inputs.length; i++){
            //     formData[inputs[i].name] = inputs[i].value;
            // }
            //
            // var formPostdata = JSON.stringify(formData);

            getAjaxPromise(urlAddCar,"POST",formData).then(function(data){
                console.log("Added New Car",data);
            });
        });
    }

    function updateCarousel(carid){
        var allCars2 = allCars;
        currentCarid = carid;
        if(carid){
           var carouselImg = document.getElementsByClassName("carousel-img");
           var carouselSec = document.getElementsByClassName("carousel-section");
           if ( carouselImg && carouselImg.length){
                var carouselImgElement = carouselImg[0].children[0];
                for ( var j=0; j<allCars2.length; j++){
                    if(allCars2[j].carid == carid){
                        carouselImgElement.src = window.location.pathname +"images/cars/"+ allCars2[j].img;
                        carouselSec[0].children[0].children[1].textContent= allCars2[j].manufacturer;
                        carouselSec[0].children[1].children[1].textContent = allCars2[j].model;
                        carouselSec[0].children[2].children[1].textContent= allCars2[j].price;
                    }
                }
           }
        }
    }

    function moveCarousel(direction){
        if(currentCarid && allCars.length){
            for(var j=0;j<allCars.length;j++){
                if(allCars[j].carid == currentCarid){
                    if(direction == 1){
                        if(j<allCars.length-1){
                            updateCarousel(allCars[j+1].carid);
                        }else{
                            updateCarousel(allCars[0].carid);
                        }
                    }else{
                        if(j>0){
                            updateCarousel(allCars[j-1].carid);
                        }else{
                            updateCarousel(allCars[allCars.length-1].carid);
                        }
                    }
                    break;
                }
            }
        }
    }

    function populateTable(result){
        var tbody = document.getElementById('table-body');
        for(var i=0; i<result.length; i++){
            var newTr = document.createElement("tr");
            tbody.appendChild(newTr);

            var newTd1 = document.createElement("td");
            newTr.appendChild(newTd1);
            var newImg = document.createElement("img");
            newImg.src = location.protocol+"//"+location.hostname+":"+location.port+ location.pathname + "/images/cars/"+ result[i].img;
            newTd1.appendChild(newImg);

            var newTd2 = document.createElement("td");
            newTr.appendChild(newTd2);
            var newSpan1 = document.createElement("span");
            newSpan1.textContent = result[i].manufacturer;
            newTd2.appendChild(newSpan1);

            var newTd3 = document.createElement("td");
            newTr.appendChild(newTd3);
            var newSpan2 = document.createElement("span");
            newSpan2.textContent = result[i].model;
            newTd3.appendChild(newSpan2);

            var newTd4 = document.createElement("td");
            newTr.appendChild(newTd4);
            var newSpan3 = document.createElement("span");
            newSpan3.textContent = result[i].price;
            newTd4.appendChild(newSpan3);

            var newTd5 = document.createElement("td");
            newTr.appendChild(newTd5);
            var newSpan4 = document.createElement("span");
            newSpan4.textContent = result[i].wiki;
            newTd5.appendChild(newSpan4);

            var newTd6 = document.createElement("td");
            newTr.appendChild(newTd6);
            var newAnchor = document.createElement("a");
            newAnchor.textContent = "Remove";
            newAnchor.carid = result[i].carid;
            newAnchor.addEventListener("click",function(evt){
                var formPostData = new FormData();
                formPostData.append('carid',evt.target.carid);
                getAjaxPromise("/api/removecar","POST",formPostData).then(function(data){
                    removeCarFromTable(evt.target.carid);
                });
            });
            newAnchor.href="#";
            newTd6.appendChild(newAnchor);
        }
    }

    function removeCarFromTable(carid){
        if(carid){
            for(var k=allCars.length-1; k>=0; k--){
                if(allCars[k].carid == carid){
                    allCars.splice(k,1);
                    break;
                }
            }
            var tbody = document.getElementById('table-body');
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }
            populateTable(allCars);
        }
    }

    return{
        init: init
    }
}

function hideAddCar(){
    document.getElementById("section-add-car").style.display = "none";
    document.getElementById("section-main").style.display = "block";
}

document.addEventListener("DOMContentLoaded",function(){initCarousel().init()},false)