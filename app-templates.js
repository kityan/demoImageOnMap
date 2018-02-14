angular.module("app-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("views/home.html","<div style=\"height: 100%; width: 100%;\">\r\n	<map image-src=\"file | ngfDataUrl\" coords=\"coords\" angle=\"angle\" scale=\"scale\" set-coords=\"setCoords\" set-angle=\"setAngle\" set-scale=\"setScale\"></map>\r\n</div>\r\n\r\n<div class=\"imagePanel\">\r\n\r\n	<div class=\"coords\" ng-if=\"coords\">\r\n		<p>lat: {{coords.lat | toFixed:6}}</p>\r\n		<p>lng: {{coords.lng | toFixed:6}}</p>\r\n		<button class=\"btn btn-primary\" ng-click=\"openSetCoordsDialog()\">Set coords</button>\r\n	</div>\r\n	<div class=\"coords\" ng-if=\"coords\">\r\n		<p>angle: {{angle | toDeg | toFixed:2}}</p>\r\n		<button class=\"btn btn-primary\" ng-click=\"openSetAngleDialog()\">Set angle</button>\r\n	</div>\r\n	<div class=\"coords\" ng-if=\"coords\">\r\n		<p>scale: {{scale | toFixed:2}}</p>\r\n		<button class=\"btn btn-primary\" ng-click=\"openSetScaleDialog()\">Set scale</button>\r\n	</div>		\r\n\r\n	<button ng-hide=\"file\" class=\"btn btn-primary\" ngf-select ng-model=\"file\" name=\"file\" ngf-pattern=\"\'image/*\'\" ngf-accept=\"\'image/*\'\" ngf-max-size=\"20MB\" ngf-change=\"upload()\">Load image</button>\r\n\r\n</div>");
$templateCache.put("views/modal/setAngleDialog.html","<form ng-submit=\"save()\">\r\n\r\n	<div class=\"modal-header\">Setting angle</div>\r\n\r\n	<div class=\"modal-body\">\r\n\r\n		<div>\r\n			<div class=\"form-group\">\r\n				<label>Angle</label>\r\n				<input type=\"number\" step=\"any\" class=\"form-control\" name=\"angle\" ng-model=\"angle\">\r\n			</div>\r\n		</div>\r\n\r\n	</div>\r\n	<div class=\"modal-footer\">\r\n		<button class=\"btn btn-primary\" type=\"submit\">OK</button>\r\n		<button class=\"btn btn-default\" type=\"button\" tabindex=\"-1\" ng-click=\"cancel()\">Cancel</button>\r\n	</div>\r\n\r\n</form>");
$templateCache.put("views/modal/setCoordsDialog.html","<form ng-submit=\"save()\">\r\n\r\n	<div class=\"modal-header\">Setting coords</div>\r\n\r\n	<div class=\"modal-body\">\r\n\r\n		<div>\r\n			<div class=\"form-group\">\r\n				<label>Lat</label>\r\n				<input type=\"number\" step=\"any\" class=\"form-control\" name=\"lat\" ng-model=\"coords.lat\">\r\n			</div>\r\n			<div class=\"form-group\">\r\n				<label>Lng</label>\r\n				<input type=\"number\" step=\"any\" class=\"form-control\" name=\"lon\" ng-model=\"coords.lng\">\r\n			</div>\r\n		</div>\r\n\r\n	</div>\r\n	<div class=\"modal-footer\">\r\n		<button class=\"btn btn-primary\" type=\"submit\">OK</button>\r\n		<button class=\"btn btn-default\" type=\"button\" tabindex=\"-1\" ng-click=\"cancel()\">Cancel</button>\r\n	</div>\r\n\r\n</form>");
$templateCache.put("views/modal/setScaleDialog.html","<form ng-submit=\"save()\">\r\n\r\n	<div class=\"modal-header\">Setting scale</div>\r\n\r\n	<div class=\"modal-body\">\r\n\r\n		<div>\r\n			<div class=\"form-group\">\r\n				<label>Scale</label>\r\n				<input type=\"number\" step=\"any\" class=\"form-control\" name=\"scale\" ng-model=\"scale\">\r\n			</div>\r\n		</div>\r\n\r\n	</div>\r\n	<div class=\"modal-footer\">\r\n		<button class=\"btn btn-primary\" type=\"submit\">OK</button>\r\n		<button class=\"btn btn-default\" type=\"button\" tabindex=\"-1\" ng-click=\"cancel()\">Cancel</button>\r\n	</div>\r\n\r\n</form>");}]);