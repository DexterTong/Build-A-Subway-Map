const UI = (function () {

    function getMap() {
        return document.getElementById('map');
    }

    function initialize() {
        const header = document.getElementById('main-header');
        const sidebar = document.getElementById('sidebar');
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
        //TODO: clear sidebar before adding things
        const lineMenu = document.getElementById('lines-list');
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
        lineGroups.forEach(lineGroup => {lineMenu.appendChild(createLineGroup(lineGroup));});
        const stationList = document.getElementById('station-list');
        createStationArray(undefined, true).forEach(stationElement => {stationList.appendChild(stationElement);});
    }

    function createLineGroup(lineGroup) {
        const lineGroupDiv = document.createElement('div');
        lineGroupDiv.id = lineGroup[0].color;
        lineGroupDiv.classList.add('line-group');
        lineGroup.forEach(line => {lineGroupDiv.appendChild(createLine(line));});
        return lineGroupDiv;
    }

    function createLine(line) {
        const lineDiv = document.createElement('div');
        lineDiv.id = line.id;
        lineDiv.title = line.fullName;
        lineDiv.classList.add('line', line.express ? 'express' : 'local');
        lineDiv.appendChild(document.createTextNode(line.name));
        lineDiv.style.backgroundColor = line.color;
        lineDiv.onclick = event => {core.setActiveLine(event.srcElement.id);};
        return lineDiv;
    }

    function setActiveLine(line) {
        const lineDiv = document.getElementById(line.id);
        const lineIconContainer = document.getElementById('line-icon-container');
        if (lineIconContainer.firstChild !== null)
            lineIconContainer.removeChild(lineIconContainer.firstChild);
        const clonedLineDiv = lineDiv.cloneNode(true);
        clonedLineDiv.removeAttribute('id');
        lineIconContainer.appendChild(clonedLineDiv);
        replaceChildren(document.getElementById('terminus-1'), document.createTextNode(core.getStation(line.stations[0]).name));
        replaceChildren(document.getElementById('terminus-2'), document.createTextNode(core.getStation(line.stations[line.stations.length - 1]).name));
        const numStations = document.getElementById('number-stations');
        if (numStations.firstChild !== null)
            numStations.removeChild(numStations.firstChild);
        numStations.appendChild(document.createTextNode('' + line.stations.length));
        const stationList = document.getElementById('line-station-list');
        while (stationList.firstChild !== null) {
            stationList.removeChild(stationList.firstChild);
        }
        createStationArray(line, true).forEach(station => {stationList.appendChild(station)});
    }

    function setActiveStation(station) {
        replaceChildren(document.getElementById('station-name'), document.createTextNode(station.name));
        replaceChildren(document.getElementById('station-lines'), createLineArray(station.lines));
    }

    function replaceChildren(node, newChildren) {
        while (node.firstChild !== null)
            node.removeChild(node.firstChild);
        if (Array.isArray(newChildren))
            while (newChildren.length > 0)
                node.appendChild(newChildren.shift());
        else
            node.appendChild(newChildren);
    }

    function createLineArray(lineIds) {
        const lineElements = [];
        lineIds.forEach(lineId => {
            const line = core.getLine(lineId);
            const lineElement = document.createElement('span');
            lineElement.appendChild(document.createTextNode(line.name));
            lineElement.classList.add('line');
            if(line.express)
                lineElement.classList.add('express');
            else
                lineElement.classList.add('local');
            lineElement.style.backgroundColor = line.color;
            lineElements.push(lineElement);
        });
        return lineElements;
    }

    function idify(str) {
        return str.trim().replace(/ /g, '-');
    }

    function createStationArray(line, addLink) {
        const stationArray = [];
        const addStation = station => {
            const stationElement = document.createElement('li');
            stationElement.appendChild(document.createTextNode(station.name + ' | '));
            createLineArray(station.lines).forEach(lineSpan => {stationElement.appendChild(lineSpan);});
            if(addLink)
                stationElement.addEventListener('click', core.setActiveStation.bind(this, station.id));
            stationArray.push(stationElement);
        };
        if (line === undefined) {
            const sortedStations = core.getAllStations().sort((A, B) => A.name.localeCompare(B.name));
            sortedStations.forEach(station => {addStation(station);});
        }
        else {
            line.stations.forEach(stationId => {
                const station = core.getStation(stationId);
                addStation(station);
            });
        }
        return stationArray;
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
        loadForm.onchange = core.loadHandler.bind(this, loadForm);
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