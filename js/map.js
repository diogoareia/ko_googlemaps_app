jQuery(document).ready(function($) {

	var viewModel = function() {
		var self = this;
		self.markersCoordinates = ko.observableArray([]);
		
		self.getPinMarker = function(col){
			
			var base = 'img/';
			var size = '48'
			var ext = '.png'
			var pin = '';
			
			if(col <= 50){
				pin = 'pin_green';
			}else if (col <= 75){
				pin = 'pin_yellow';
			}else if (col > 75){
				pin = 'pin_red';
			}else{
				pin = 'pin_green';
			}
			  
			return base + pin + size + ext;
		}
		
		self.getMapData = function(pk_id) {
			$.ajax({
				type: "GET",
				url: "map_data.json", 
				dataType: "json",
				success: function(data){
					
					$.each(data.Map.MapPoints, function(key, val){
						
						var perc = Math.round(val.Value); 
						var pin = self.getPinMarker(val.Value);
								
						self.markersCoordinates.push({
							latLng:[val.Latitude, val.Longitude], 
							options:{
								//icon:new google.maps.MarkerImage("img/pin_red16.png")
								content:  '<div style="color: #FFF; background: url('+ pin +') no-repeat 0 0; font-size:14px;' 
											+ 'line-height: 48px; width:48px; height: 48px; font-weight: bold; text-align:center">' + perc + '%</div>',
								offset:{
									y:-24,
									x:-24
								}
							}
						});
					});
				}
			});
		}
		
		self.getMapData();
	}
	
	ko.bindingHandlers.googleMap = {
		
		init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
			
			$('#' + element.id).gmap3({
				 map:{
					options:{
					 center: [-12, -54],
					 zoom: 4
					}
				 },
				 marker:{
					latLng: [-12, -51],
					callback: function(){
						//$(this).html('<h3>Loading Markers</h3>');
					}
				 }
			});	
			
		},
		
		update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
			
			var markersObj = ko.utils.unwrapObservable(valueAccessor());
			
			$('#'+element.id).gmap3(
				{ 
					/*
					marker: { 
						values: markersObj
					},
					*/
					overlay: {
						values: markersObj
					}
				}
			);   
		}
	
	}
	
	ko.applyBindings(viewModel);
	
});
