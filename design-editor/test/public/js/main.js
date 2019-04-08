(function () {
    var xmlhttp = new XMLHttpRequest(),
        runButton = document.getElementById('run'),
        listOfFilesSelector = document.getElementById('test-files'),
        frame = document.getElementById('test-frame');


    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === XMLHttpRequest.DONE) {
            if (xmlhttp.status === 200) {
                listOfFilesSelector.innerHTML = '';
                JSON.parse(xmlhttp.responseText).forEach(function (file) {
                    listOfFilesSelector.innerHTML += '<option value="' + file + '">' + file + '</option>';
                });

                listOfFilesSelector.disabled = false;
                runButton.disabled = false;

            } else {
                console.error('Cannot retrive list of spec!');
            }
        }
    };

    xmlhttp.open('GET', './spec-list.json', true);
    xmlhttp.send();

    function afterLoadBlank() {
        var selectedFile = listOfFilesSelector.options[listOfFilesSelector.selectedIndex].value;
        frame.removeEventListener('load', afterLoadBlank);

        frame.src = './jasmine.html#' + encodeURI(selectedFile);
        document.title = 'Test runner | ' + selectedFile;
    }

    runButton.addEventListener('click', function () {
        frame.addEventListener('load', afterLoadBlank);
        frame.src = 'about:blank';
        document.body.classList.remove('initial');
    });
}());
