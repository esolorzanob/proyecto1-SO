
var memoria = angular.module('memoria', []);


memoria.controller('mainController', function ($scope) {
	$scope.processID = 0;
	$scope.procesos = [];

	$scope.createMemory = function () {
		$scope.rows = [];
		var cells = $scope.memSize / $scope.pagSize;
		var result = 0;
		for (var i = 0; i <= 12; i++) {
			if (Math.pow(2, i) == cells) {
				result = i;
			}
		}
		var numCols = Math.floor(result / 2);
		numCols = Math.pow(2, numCols);
		var numRows = cells / numCols;
		var counter = 0;
		for (var row = 1; row <= numRows; row++) {
			var columns = [];

			for (var col = 1; col <= numCols; col++) {
				var pagina = {
					status: "libre",
					ubicacion: col + "," + row,
					proceso: {},
					tamaño: $scope.pagSize,
					memlibre: 0,
					numPagina: col + counter
				}
				columns.push(pagina);
			}
			counter += numCols;
			$scope.rows.push(columns);
		}
	} // fin de crear memoria
	
	$scope.agregarProceso = function () {
		var proceso = {};
		proceso.id = $scope.processID;
		proceso.size = $scope.proceso.size;
		proceso.tiempo = $scope.proceso.tiempo;
		$scope.processID++;
		$scope.procesos.push(proceso);
	}

	$scope.correrMemoria = function () {
		
		$scope.procesos.forEach(function (element) {
			var numPaginas = element.size / $scope.pagSize;
			for (var i = 1; i <= numPaginas; i++) {
				var listo = false;
				for (var e = 0; e < $scope.rows.length; e++) {
					for (var x = 0; x < $scope.rows[e].length; x++) {
						var pagina = $scope.rows[e][x];
						if (pagina.status == "libre") {
							pagina.status = "ocupado";
							pagina.proceso = element.id;
							$('#' + pagina.numPagina).removeClass("libre").addClass("ocupado");
							$('#' + pagina.numPagina).text("PID=" + pagina.proceso);
							listo = true;
							break;
						}
					}
					if (listo) {
						break;
					}
				}
			} // fin de for por pagina
			
		}, this);
		
		
	}// fin agregar programa

});
