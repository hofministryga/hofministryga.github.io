// Loaded via <script> tag, create shortcut to access PDF.js exports.
var { pdfjsLib } = globalThis;

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.mjs';

function setFirstPagePDF(file)
{
	var pdf_promise = pdfjsLib.getDocument(file);
	pdf_promise.promise.then(function(pdf) {
		pdf.getPage(1).then(function(page) {
			var scale = 0.5;
			var viewport = page.getViewport({scale:scale,});
			var outputScale = window.devicePixelRatio || 1;

			var canvas = document.getElementById("pdf-preview");
			var context = canvas.getContext('2d');

			canvas.width = Math.floor(viewport.width * outputScale);
			canvas.height = Math.floor(viewport.height * outputScale);
			canvas.style.width = Math.floor(viewport.width) + "px";
			canvas.style.height =  Math.floor(viewport.height) + "px";

			var transform = outputScale !== 1
				? [outputScale, 0, 0, outputScale, 0, 0]
				: null;

			var renderContext = {
				canvasContext: context,
				transform: transform,
				viewport: viewport
			};
			page.render(renderContext);
		});
	});
}

window.onload = function(){
	setFirstPagePDF("resources/Bible Study Conference Line 08052021.pdf");
};