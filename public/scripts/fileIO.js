const fileIO = (function() {

    function generateSave(state) {
        return {
            name: 'basm-' + Math.random().toString(36).substr(2, 6) + '.json',
            data: 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 4))
        };
    }

    function loadFromLocal(name) {

    }

    function loadFromServer(name) {
        const fileName = name + '.json';
        return new Promise(function (resolve, reject) {
            const req = new XMLHttpRequest();
            req.open('GET', '/data/' + fileName, true);
            req.addEventListener('load', function () {
                if (this.status < 200 && this.status > 400) {
                    reject(Error('Could not load the requested game: ' + req.statusText));
                }
                else
                    resolve(JSON.parse(this.response));
            });
            req.send();
        });
    }

    return {
        generateSave: generateSave,
        loadFromLocal: loadFromLocal,
        loadFromServer: loadFromServer
    };
})();