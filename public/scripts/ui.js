const UI = (function () {

    function getMap() {
        return document.getElementById('map');
    }

    function initialize() {
        const header = document.getElementById('main-header');
        const sidebar = document.getElementById('ui');
        header.parentNode.removeChild(header);
        sidebar.insertBefore(header, sidebar.firstChild);

        const tabContents = document.getElementsByClassName('tab-content');
        for(let i = 0; i < tabContents.length; i++) {
            tabContents[i].style.display = 'none';
        }

        document.getElementById('button-save').onclick = core.saveGame;
        document.getElementById('button-load').onclick = core.loadGame;
        addMenuSwitchers();
    }

    function addMenuSwitchers() {
        const tabLinks = document.getElementsByClassName('tab-link');
        for(let i = 0; i < tabLinks.length; i++) {
            let tabContentId;
            switch(tabLinks[i].textContent) {
                case 'Lines':
                    tabContentId = 'lines-content';
                    break;
                case 'Stations':
                    tabContentId = 'stations-content';
                    break;
                case 'Transfers':
                    tabContentId = 'transfers-content';
            }
            tabLinks[i].addEventListener('click', function(event){
                switchMenu(event.target, tabContentId);
            });
        }
    }

    function switchMenu(tabLinkElement, tabContentId) {
        const menuLinks = document.getElementsByClassName('tab-link');
        for(let i = 0; i < menuLinks.length; i++) {
            if(menuLinks[i] === tabLinkElement)
                menuLinks[i].classList.add('active');
            else
                menuLinks[i].classList.remove('active');
        }
        const menuContents = document.getElementsByClassName('tab-content');
        for(let i = 0; i < menuContents.length; i++) {
            if(menuContents[i].id === tabContentId)
                menuContents[i].style.display = '';
            else
                menuContents[i].style.display = 'none';
        }
    }

    function update() {
        const lineGroupsObject = core.getAllLines().reduce((groups, line) => {
            if (groups[line.color])
                groups[line.color].push(line);
            else
                groups[line.color] = [line];
            return groups;
        }, {});
        const lineGroupsKeys = Object.keys(lineGroupsObject);
        const lineGroups = [];
        lineGroupsKeys.forEach(key => {
            lineGroups.push(lineGroupsObject[key]);
        });
        lineGroups.forEach(lineGroup => {
            lineGroup.sort((A, B) => {
                const res = A.name.localeCompare(B.name);
                if (res !== 0)
                    return res;
                if (B.express)
                    return -1;
                return 1;
            });
        });
        lineGroups.sort((A, B) => A[0].name.localeCompare(B[0].name));
        replaceList(document.getElementById('line-group-list'),
            lineGroups.map(lineGroup => createLineGroupElement(lineGroup))
        );
        replaceList(document.getElementById('station-list'),
            core.getAllStations()
                .sort((A, B) => A.name.localeCompare(B.name))
                .map(station => createStationElement(station))
        );
    }

    function createLineElement(line) {
        const lineElement = document.createElement('span');
        lineElement.title = line.fullName;
        lineElement.classList.add('line', line.express ? 'express' : 'local');
        lineElement.appendChild(document.createTextNode(line.name));
        lineElement.style.backgroundColor = line.color;
        lineElement.onclick = core.setActiveLine.bind(null, line.id);
        return lineElement;
    }

    function createLineGroupElement(lineGroup) {
        const lineGroupElement = document.createElement('li');
        lineGroupElement.classList.add('line-group');
        lineGroup.forEach(line => {lineGroupElement.appendChild(createLineElement(line));});
        return lineGroupElement;
    }

    function setActiveLine(line) {
        replaceChild(document.getElementById('line-element-container'), createLineElement(line));
        replaceChild(document.getElementById('terminal-1'), document.createTextNode(core.getStation(line.stations[0]).name));
        replaceChild(document.getElementById('terminal-2'), document.createTextNode(core.getStation(line.stations[line.stations.length - 1]).name));
        replaceChild(document.getElementById('station-count'), document.createTextNode('' + line.stations.length));
        replaceList(document.getElementById('line-station-list'), line.stations.map(stationId => createStationElement(core.getStation(stationId))));
    }

    function setActiveStation(station) {
        replaceChild(document.getElementById('station-name'), document.createTextNode(station.name));
        const lineElements = station.lines.map(lineId => createLineElement(core.getLine(lineId)));
        replaceList(document.getElementById('station-lines'), lineElements);
    }

    function replaceChild(parentNode, newChild) {
        if(parentNode.firstChild !== null)
            parentNode.removeChild(parentNode.firstChild);
        parentNode.appendChild(newChild);
    }

    function replaceList(listNode, newListElementArray) {
        while (listNode.firstChild !== null)
            listNode.removeChild(listNode.firstChild);
        const elementsToAdd = newListElementArray.slice();
        while (elementsToAdd.length > 0) {
            const listElement = document.createElement('li');
            listElement.appendChild(elementsToAdd.shift());
            listNode.appendChild(listElement);
        }
    }

    function idify(str) {
        return str.trim().replace(/ /g, '-');
    }

    function createStationElement(station) {
        const stationElement = document.createElement('span');
        const stationName = document.createElement('span'); //change to p and make in-line
        stationName.appendChild(document.createTextNode(station.name));
        stationName.onclick = core.setActiveStation.bind(null, station.id);
        stationElement.appendChild(stationName);
        station.lines.forEach(lineId => {
            const line = core.getLine(lineId);
            const lineElement = createLineElement(line);
            lineElement.onclick = core.setActiveLine.bind(null, line);
            stationElement.appendChild(lineElement);
        });
        return stationElement;
    }

    function downloadGame(save) {
        const saveLink = document.createElement('a');
        saveLink.href = 'data:' + save.data;
        saveLink.download = save.name;
        saveLink.click();
    }

    function uploadGame() {
        const loadForm = document.createElement('input');
        loadForm.setAttribute('type', 'file');
        loadForm.onchange = core.loadHandler.bind(null, loadForm);
        loadForm.click();
    }

    return {
        getMap: getMap,
        initialize: initialize,
        update: update,
        setActiveLine: setActiveLine,
        setActiveStation: setActiveStation,
        downloadGame: downloadGame,
        uploadGame: uploadGame
    };
})();