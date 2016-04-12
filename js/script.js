
var memoria = angular.module('memoria', []);


memoria.controller('mainController', function ($scope) {
	$scope.processID = 0;
	$scope.procesos = [];
	$scope.ciclos = 0;
	$scope.createMemory = function () {
		$scope.rows = [];
		$scope.cells = Math.floor($scope.memSize / $scope.pagSize);
		$scope.lostMemory = $scope.memSize % $scope.pagSize;
		$scope.paginas = [];
        var numRows = $scope.cells / 8;
        var numCols = $scope.cells / numRows;
		var counter = 0;
		var paginas = 0;
		for (var row = 0; row <= numRows; row++) {
			var columns = [];

			for (var col = 0; col < 8; col++) {
				var pagina = {
					status: "libre",
					numPagina: col + counter,
					ubicacion: $scope.pagSize * (col + counter),
					proceso: {},
					tamaño: $scope.pagSize,
					memlibre: $scope.pagSize

				}
				paginas++;
				columns.push(pagina);
				$scope.paginas.push(pagina);
				if (paginas >= $scope.cells) {

					break;
				}
			}
			counter += 8;
			$scope.rows.push(columns);

		}
	} // fin de crear memoria
	
	$scope.agregarProceso = function () {
        var proceso = {};
		proceso.id = $scope.processID;
		proceso.size = $scope.proceso.size;
		proceso.tiempo = $scope.proceso.tiempo;
		proceso.entrante = $scope.proceso.entrante;
		proceso.estado = "Esperando";
		$scope.processID++;
		$scope.procesos.push(proceso);
	}

	$scope.correrMemoria = function () {

		$scope.procesos.forEach(function (element) {
			var numPaginas = element.size / $scope.pagSize;
			var memSobrante = element.size % $scope.pagSize;
			for (var i = 0; i < numPaginas - 1; i++) {
				var listo = false;
				for (var e = 0; e < $scope.paginas.length; e++) {
					var pagina = $scope.paginas[e];
					if (pagina.status == "libre" && element.entrante == $scope.ciclos) {
						pagina.status = "ocupado";
						pagina.proceso = element.id;
						pagina.memlibre = 0;
						$('#' + pagina.numPagina).removeClass("libre").addClass("ocupado");
						$('#' + pagina.numPagina).text("PID=" + pagina.proceso);
						element.estado = "En memoria";
						break;
					}

				}
			} // fin de for por pagina
			if (memSobrante != 0 && element.entrante == $scope.ciclos) {
				var nextId = parseInt($('.ocupado').last().attr('id'), 10);
				nextId += 1;
				var $paginaObj = $('#' + nextId);
				var pagina = $scope.paginas[$paginaObj.attr('id')];
				pagina.status = "fraccionada";
				pagina.proceso = element.id;
				pagina.memlibre = 17 - memSobrante;
				$paginaObj.removeClass("libre").addClass("fraccionada");
				$paginaObj.text("PID=" + pagina.proceso);
			}
			if ($scope.ciclos == parseInt(element.tiempo)+parseInt(element.entrante)) {
				$('td:contains(PID=' + element.id + ')').each(function (i) {
					var pagina = $scope.paginas[element.id + i];
					pagina.status = "libre",
					pagina.proceso = {};
					pagina.memlibre = 17;
					$(this).removeClass('ocupado').addClass('libre');
					$(this).removeClass('fraccionada').addClass('libre');
					$(this).text($(this).attr('id'));
					element.estado = "Finalizado";
				});
			}

		}, this);

		$scope.ciclos++;
	}// fin correr memoria

});
