/*globals FileReader, XMLHttpRequest*/

const Files = (function() {

    function generateSave(state) {
        return {
            name: 'basm-' + Math.random().toString(36).substr(2, 6) + '.json',
            data: 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 4))
        };
    }

    function loadFromLocal(loadForm) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                let state;
                try {
                    state = JSON.parse(event.target.result);
                }
                catch (err) {
                    reject({error: 'Not a (valid) JSON file.'});
                }
                resolve(state);
            };
            reader.readAsText(loadForm.files[0]);
        });
    }

    function loadFromServer(name) {
        const fileName = name + '.json';
        return new Promise((resolve, reject) => {
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
        generateSave,
        loadFromLocal,
        loadFromServer
    };
})();