
var memoria = angular.module('memoria', []);
memoria.controller('mainController', function ($scope) {
	$scope.processID = 0;
	$scope.procesos = [];
	$scope.ciclos = 0;
	$scope.perdida = 0;
	
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
			if ($scope.ciclos == parseInt(element.tiempo) + parseInt(element.entrante)) {
				$('td:contains(PID=' + element.id + ')').each(function (i, obj) {
					var pagina = $scope.paginas[$(obj).attr('id')];
					pagina.status = "libre",
					pagina.proceso = {};
					pagina.memlibre = $scope.pagSize;
					$(this).removeClass('ocupado').addClass('libre');
					$(this).removeClass('fraccionada').addClass('libre');
					$(this).text($(this).attr('id'));
					element.estado = "Finalizado";
				});
			}
			for (var i = 0; i < numPaginas - 1; i++) {				
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
				var nextId = parseInt($('.libre').first().attr('id'), 10);
				var $paginaObj = $('#' + nextId);
				var clase = $paginaObj.attr('class');
				if (clase == "ocupado" || clase == "fraccionada") {
					nextId++;
					$paginaObj = $('#' + nextId);
				}
				var pagina = $scope.paginas[$paginaObj.attr('id')];
				pagina.status = "fraccionada";
				pagina.proceso = element.id;
				pagina.memlibre = $scope.pagSize - memSobrante;
				$paginaObj.removeClass("libre").addClass("fraccionada");
				$paginaObj.text("PID=" + pagina.proceso);
			}


		}, this);
		var fraccionadaCheck = $('.fraccionada').length;
		if (fraccionadaCheck > 0) {
			$scope.perdida = 0;
			$('.fraccionada').each(function (i, obj) {
				var pagina = $scope.paginas[$(obj).attr('id')];
				$scope.perdida += pagina.memlibre;
			});
		} else {
			$scope.perdida = 0;
		}
		$scope.ciclos++;
	}// fin correr memoria

	$scope.automatico = function () {
		setInterval(function () { $scope.correrMemoria() }, 2000);
	}
	
	$scope.detener = function () {
		clearInterval($scope.automatico);
		$scope.ciclos = 0;
	}
});
