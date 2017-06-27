(function(){
	var countrySelector = document.getElementsByClassName("nav-dropdown");
	var countrySelector1 = document.getElementById("country-selector1");
	var countrySelector2 = document.getElementById("country-selector2");
	var commontrendsList1 = document.getElementById('common-trends-list1');
	var commontrendsList2 = document.getElementById('common-trends-list2');
	var commontrendsChart1 = document.getElementById('common-trends-chart1');
	var commontrendsChart2 = document.getElementById('common-trends-chart2');
	var result1 = document.getElementById('result1');
	var result2 = document.getElementById('result2');

	var elem1, elem2, elem3, i;
	var countryData,commonTrendsData,trendsList,countryIndex,countryOption,newArrCommonTrendsData,sortedArr;
    var commonResults = [];
	var dupCommonResults = [];
	var arrCountries = [];
	var arrCommonTrendsData = [];
	var urlForTrends ;


	//to load countries in the select options
	function loadCountries() {
	    var xhttp = new XMLHttpRequest();
	    xhttp.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200) {
		    	countryData = JSON.parse(this.responseText);
		        arrCountries.push(countryData.countries);

		        for(i=0;i<arrCountries[0].length;i++){
		        	countrySelector1.innerHTML +=
		            "<option value = " + arrCountries[0][i]+ ">" + arrCountries[0][i] + "</option>";
		            countrySelector2.innerHTML +=
		            "<option value = " + arrCountries[0][i] + ">" + arrCountries[0][i] + "</option>";
		        }
		    }
	    }
	    xhttp.open("GET", "http://localhost:3001/countries/", true);
	    xhttp.send();
	}
	loadCountries();


	// trend functioality
	function trendFunctionality(){
	for(i=0;i<countrySelector.length;i++){
	    countrySelector[i].addEventListener('change',function(event) {
	    	//detecting the inputs filled - one country only
			if(event.target == countrySelector1){
				elem1 = 1;
		    	countryIndex = countrySelector1.selectedIndex;
		    	countryOption = countrySelector1.options;
		    }
		    else{
		    	elem2 = 2;
		    	countryIndex = countrySelector2.selectedIndex;
		    	countryOption = countrySelector2.options;
		    }


			//fetching the common trends
			urlForTrends = "http://localhost:3001/countries/" + countryOption[countryIndex].text + "/trends/";
			function loadCommonTrends() {
			    var xhttp = new XMLHttpRequest();
			    xhttp.onreadystatechange = function() {
				    if (this.readyState == 4 && this.status == 200) {
				    	commonTrendsData = JSON.parse(this.responseText);
				    	trendsList = commonTrendsData.trends;
				    	trendsList.map(function(obj){

				    		//if only one country is selected
				    		if(!(elem1 == 1 && elem2 == 2)){
					    		if(event.target == countrySelector1){
							    	commontrendsList1.innerHTML += "<li>" + obj.name + "</li>";
					       			arrCommonTrendsData.push(obj.name);
							    }
							    else{
							    	commontrendsList2.innerHTML += "<li>" + obj.name + "</li>";
					       		    arrCommonTrendsData.push(obj.name);
							    }
						    }

						    //if both countries are selected
						    else{
					    	    elem3 = 3;
						    	   	commontrendsList1.innerHTML = " ";
						    	   	commontrendsList2.innerHTML = " ";
									arrCommonTrendsData.push(obj.name);

					   				newArrCommonTrendsData = arrCommonTrendsData.slice();
					   				sortedArr = newArrCommonTrendsData.slice().sort(); 
									commonResults = [];

									for (i = 0; i < newArrCommonTrendsData.length - 1; i++) {
									    if (sortedArr[i + 1] == sortedArr[i]) {
									        commonResults.push(sortedArr[i]);
									    }
									}
									dupCommonResults = commonResults.slice();
									for(i=0;i<commonResults.length;i++){
										commontrendsList1.innerHTML += "<li>" + commonResults[i] + "</li>";
								    }
				       		}		
				        }) 

				    	//for the pie chart
				        var canvas = document.getElementById("myCanvas1");
						var ctx = canvas.getContext("2d");
						var lastend = 0;
						var data ; 
						var totalTrendWeight = 0;
						var chartColors = ['#1abc9c','#e67e22','#2ecc71',"#f1c40f","#2c3e50","#ecf0f1","#c0392b","#f39c12","#2980b9","#bdc3c7","#d35400"]; 

						if(elem3 !=3){
							data = arrCommonTrendsData.slice(); 
							for (var i = 0; i < data.length; i++) {
						    	totalTrendWeight += data[i].length;
						    }
						}
						else{
							data = dupCommonResults.slice(); 
							for (var i = 0; i < data.length; i++) {
						    	totalTrendWeight += data[i].length;
						    }
						}
						
						commontrendsChart1.innerHTML = "";
						commontrendsChart2.innerHTML = "";

						for (var i = 0; i < data.length; i++) {
						    ctx.fillStyle = chartColors[i];
						    ctx.beginPath();
						    ctx.moveTo(canvas.width / 2, canvas.height / 2);
						    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2, lastend, lastend + (Math.PI * 2 * (data[i].length / totalTrendWeight)), false);
						    ctx.lineTo(canvas.width / 2, canvas.height / 2);
						    ctx.fill();
						    lastend += Math.PI * 2 * (data[i].length / totalTrendWeight);

						    //to display the trends list and total trrend weight
						  	if( elem3 !=3 ){
							    if(event.target == countrySelector1){
							    	var trendItems ;
							  		result1.innerHTML = "The total trend weight is " + totalTrendWeight;
							    	commontrendsChart1.innerHTML += "<li class = "+ "trends" + ">" + data[i] + "   " + data[i].length / totalTrendWeight*100 + "%</li>";
							    	// trendItems = document.getElementsByClassName('trends');
							    	// var span = document.createElement('span');
							    	// span.style.color = chartColors[i];
							    	// trendItems.appendChild(span);

							    }
							    else{
							    	result2.innerHTML = "The total trend weight is " + totalTrendWeight;
							    	commontrendsChart2.innerHTML += "<li>" + data[i] + "   " + data[i].length / totalTrendWeight*100 + "%</li>";
							    }
						    }	
						    else{
						    	result1.innerHTML = "The total trend weight is " + totalTrendWeight;
						    	commontrendsChart1.innerHTML += "<li>" + data[i] + "   " + data[i].length / totalTrendWeight*100 + "%</li>";  
						    	
						    	countrySelector1.disabled = true;
						    	countrySelector2.disabled = true;
						    	
						    }

						}

				    }
			    }
				xhttp.open("GET", urlForTrends , true);
				xhttp.send();
			}
			loadCommonTrends();
	    });
	}
		var button = document.createElement('button');
		button.className += "displayBtn";
		button.innerHTML = 'Click for twitter trends';
			button.addEventListener('click',function(){
				window.location.reload();  
			});
		result2.appendChild(button);

	}trendFunctionality();

		
})();
