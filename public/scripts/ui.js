const UI = (function () {

    function getMap() {
        return document.getElementById('map');
    }

    function initialize(state) {
        const header = document.getElementById('main-header');
        const sidebar = document.getElementById('sidebar');
        header.parentNode.removeChild(header);
        sidebar.insertBefore(header, sidebar.firstChild);
        document.getElementById('button-save').onclick = core.saveGame;
        addMenuSwitchers();
        update(state);
    }

    function addMenuSwitchers() {
        const tabContents = document.getElementsByClassName('tab-content');
        for(let i = 0; i < tabContents.length; i++) {
            tabContents[i].style.display = 'none';
        }
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

    function update(state) {
        const lineMenu = document.getElementById('lines-list');
        const lineGroupsObject = state.lines.reduce((groups, line) => {
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
        lineGroups.forEach(lineGroup => {lineMenu.appendChild(createLineGroupDiv(lineGroup));});
        const stationList = document.getElementById('station-list');
        createStationArray(undefined, true).forEach(stationElement => {stationList.appendChild(stationElement);});
    }

    function createLineGroupDiv(lineGroup) {
        const lineGroupDiv = document.createElement('div');
        lineGroupDiv.id = lineGroup[0].color;
        lineGroupDiv.classList.add('line-group');
        lineGroup.forEach(line => {lineGroupDiv.appendChild(createLineDiv(line));});
        return lineGroupDiv;
    }

    function createLineDiv(line) {
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
        populateDOMList(stationList, createStationArray(line, true));
    }

    function setActiveStation(station) {
        replaceChildren(document.getElementById('station-name'), document.createTextNode(station.name));
        replaceChildren(document.getElementById('station-lines'), makeLineSpanArray(station.lines));
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

    function makeLineSpanArray(lineIds) {
        const lineSpans = [];
        lineIds.forEach(lineId => {
            const line = core.getLine(lineId);
            const lineSpan = document.createElement('span');
            lineSpan.appendChild(document.createTextNode(line.name));
            lineSpan.classList.add('line');
            if(line.express)
                lineSpan.classList.add('express');
            else
                lineSpan.classList.add('local');
            lineSpan.style.backgroundColor = line.color;
            lineSpans.push(lineSpan);
        });
        return lineSpans;
    }

//replace all spaces in str for html-compliant id's
    function idify(str) {
        return str.trim().replace(/ /g, '-');
    }

    function createStationArray(line, addLink) {
        const stationList = [];
        const addStation = station => {
            const stationElement = document.createElement('li');
            stationElement.appendChild(document.createTextNode(station.name + ' | '));
            makeLineSpanArray(station.lines).forEach(lineSpan => {stationElement.appendChild(lineSpan);});
            if(addLink)
                stationElement.addEventListener('click', core.setActiveStation.bind(this, station.id));
            stationList.push(stationElement);
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
        return stationList;
    }

    function populateDOMList(listNode, arr) {
        arr.forEach(element => {listNode.appendChild(element);});
    }

    function downloadSave(data) {
        const save = document.createElement('a');
        save.href = 'data:' + data;
        save.download = generateSaveName();
        save.click();
        save.remove();
    }

    function generateSaveName() {
        // Generate a unique-enough filename
        return 'basm-' + Math.random().toString(36).substr(2, 6) + '.json';
    }

    return {
        getMap: getMap,
        initialize: initialize,
        setActiveLine: setActiveLine,
        setActiveStation: setActiveStation,
        downloadSave: downloadSave
    };
})();