
function loadData()
{
    var request = new XMLHttpRequest();
    const url = "https://docs.google.com/uc?export=download&id=1l9LbESuW8qHf2cW2w7NHJZqtMdt6zohH";
    request.open('GET', url, true);
    request.send();
    request.responseType = 'text';

    request.onreadystatechange = function() {
        if(request.status === 200)
        {
            var pObj = document.getElementById(testID);
            pObj.innerHTML = "Loaded";
        }
    }
}