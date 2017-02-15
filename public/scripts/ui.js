/*globals Core, document*/
/*exported UI*/

const UI = (function () {

    function getMap() {
        return document.getElementById('map');
    }

    document.addEventListener('DOMContentLoaded', Core.initialize);

    function initialize() {
        const header = document.getElementById('main-header');
        const sidebar = document.getElementById('ui');
        header.parentNode.removeChild(header);
        sidebar.insertBefore(header, sidebar.firstChild);

        const tabContents = document.getElementsByClassName('tab-content');
        for (let i = 0; i < tabContents.length; i++) {
            tabContents[i].classList.add('hide');
        }

        document.getElementById('button-save').onclick = Core.saveGame;
        document.getElementById('button-load').onclick = Core.loadGame;
        document.getElementById('button-station-add').onclick = Core.createStation;
        document.getElementById('button-station-delete').onclick = Core.deleteStation;
        document.getElementById('button-line-delete').onclick = Core.deleteLine;

        addMenuSwitchers();
    }

    const switchToLinesMenu = switchMenu.bind(null, 'lines-tab', 'lines-content');

    const switchToStationsMenu = switchMenu.bind(null, 'stations-tab', 'stations-content');

    const switchToTransfersMenu = switchMenu.bind(null, 'transfers-tab', 'transfers-content');

    function addMenuSwitchers() {
        document.getElementById('lines-tab').addEventListener('click', switchToLinesMenu);
        document.getElementById('stations-tab').addEventListener('click', switchToStationsMenu);
        document.getElementById('transfers-tab').addEventListener('click', switchToTransfersMenu);
    }

    function switchMenu(tabLinkId, tabContentId) {
        const menuLinks = document.getElementsByClassName('tab-link');
        for (let i = 0; i < menuLinks.length; i++) {
            if (menuLinks[i].id === tabLinkId)
                menuLinks[i].classList.add('active');
            else
                menuLinks[i].classList.remove('active');
        }

        const menuContents = document.getElementsByClassName('tab-content');
        for (let i = 0; i < menuContents.length; i++) {
            if (menuContents[i].id === tabContentId)
                menuContents[i].classList.remove('hide');
            else
                menuContents[i].classList.add('hide');
        }
    }

    function update(activeLine, activeStation, activeTransfer) {    //jshint ignore:line
        const lineGroupsObject = Core.getAllLines().reduce((groups, line) => {
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

        //noinspection JSUnresolvedFunction
        replaceList(document.getElementById('station-list'),
            Core.getAllStations()
                .sort((A, B) => A.name.localeCompare(B.name))
                .map(station => createStationElement(station))
        );

        if (activeLine !== undefined)
            setActiveLine(activeLine);
        if (activeStation !== undefined)
            setActiveStation(activeStation);
    }

    function createLineElement(line) {
        const lineElement = document.createElement('span');
        lineElement.title = line.branch;
        lineElement.classList.add('line', line.express ? 'express' : 'local');
        lineElement.appendChild(document.createTextNode(line.name));
        lineElement.style.backgroundColor = line.color;
        lineElement.onclick = Core.setActiveLine.bind(null, line.id);
        return lineElement;
    }

    function createLineGroupElement(lineGroup) {
        const lineGroupElement = document.createElement('li');
        lineGroupElement.classList.add('line-group');
        lineGroup.forEach(line => {
            lineGroupElement.appendChild(createLineElement(line));
        });
        return lineGroupElement;
    }

    function setActiveLine(line) {
        let lineElement;
        let lineExpressElement;
        let branchElement;
        let terminalOneElement;
        let terminalTwoElement;
        let stationCountElement;
        let stationListElement;
        if (line !== undefined) {
            lineElement = createLineElement(line);
            lineExpressElement = document.createTextNode(line.express ? 'Express' : '');
            branchElement = makeEditable(document.createTextNode(line.branch),
                Core.updateLine.bind(null, line, 'branch'));
            terminalOneElement = document.createTextNode(Core.getStation(line.stations[0]).name);
            terminalTwoElement = document.createTextNode(
                Core.getStation(line.stations[line.stations.length - 1]).name);
            stationCountElement = document.createTextNode('' + line.stations.length);
            stationListElement = line.stations.map(
                stationId => createStationElement(Core.getStation(stationId)));
        }
        replaceChild(document.getElementById('line-element-container'), lineElement);
        replaceChild(document.getElementById('express'), lineExpressElement);
        replaceChild(document.getElementById('branch'), branchElement);
        replaceChild(document.getElementById('terminal-1'), terminalOneElement);
        replaceChild(document.getElementById('terminal-2'), terminalTwoElement);
        replaceChild(document.getElementById('station-count'), stationCountElement);
        replaceList(document.getElementById('line-station-list'), stationListElement);
        switchToLinesMenu();
    }

    function setActiveStation(station) {
        let stationName;
        let stationLines;
        if (station !== undefined) {
           stationName = makeEditable(document.createTextNode(station.name),
               Core.updateStation.bind(null, station, 'name'));
           stationLines = station.lines.map(lineId => createLineElement(Core.getLine(lineId)));
        }
        replaceChild(document.getElementById('station-name'), stationName);
        replaceList(document.getElementById('station-lines'), stationLines);
        switchToStationsMenu();
    }

    function replaceChild(parentNode, newChild) {
        if (parentNode.firstChild !== null)
            parentNode.removeChild(parentNode.firstChild);
        if (newChild !== undefined)
            parentNode.appendChild(newChild);
    }

    function replaceList(listNode, newListElementArray) {
        while (listNode.firstChild !== null) {
            listNode.removeChild(listNode.firstChild);
        }
        if (newListElementArray !== undefined) {
            const elementsToAdd = newListElementArray.slice();
            while (elementsToAdd.length > 0) {
                const listElement = document.createElement('li');
                const elementToAdd = elementsToAdd.shift();
                if (elementToAdd === undefined)
                    continue;
                listElement.appendChild(elementToAdd);
                listNode.appendChild(listElement);
            }
        }
    }

    function createStationElement(station) {
        const stationElement = document.createElement('span');
        stationElement.classList.add('station-element');

        const stationName = document.createElement('p');
        stationName.appendChild(document.createTextNode(station.name));
        stationName.onclick = Core.setActiveStation.bind(null, station.id);
        stationElement.appendChild(stationName);

        const stationLines = document.createElement('ul');
        stationLines.classList.add('line-list');
        replaceList(stationLines, station.lines.map(
            lineId => createLineElement(Core.getLine(lineId))));
        stationElement.appendChild(stationLines);

        return stationElement;
    }

    function downloadGame(save) {
        const saveLink = document.createElement('a');
        saveLink.classList.add('hide');
        saveLink.href = 'data:' + save.data;
        saveLink.download = save.name;
        document.body.appendChild(saveLink);
        saveLink.click();
        document.body.removeChild(saveLink);
    }

    function uploadGame() {
        const loadForm = document.createElement('input');
        loadForm.setAttribute('type', 'file');
        loadForm.onchange = Core.loadHandler.bind(null, loadForm);
        loadForm.click();
    }

    function setCurrentAction(message) {
        replaceChild(document.getElementById('current-action'), document.createTextNode(message));
    }

    function makeEditable(textNode, callback) {
        const editIcon = document.createElement('i');
        editIcon.classList.add('material-icons');
        editIcon.appendChild(document.createTextNode('mode_edit'));

        const editableElement = document.createElement('span');
        editableElement.appendChild(textNode);
        editableElement.appendChild(editIcon);

        editIcon.onclick = () => {
            const editBox = document.createElement('textarea');
            textNode.parentNode.replaceChild(editBox, textNode);
            editBox.appendChild(textNode);
            editableElement.removeChild(editIcon);
            editBox.focus();
            editBox.onblur = () => {
                callback(editBox.value);
            };
        };

        return editableElement;
    }

    function createStationPopupContent(station) {
        const content = document.createElement('div');

        const nameElement = document.createElement('h1');
        nameElement.appendChild(document.createTextNode(station.name));
        content.appendChild(nameElement);

        const idElement = document.createElement('p');
        idElement.appendChild(document.createTextNode('id: ' + station.id));
        content.appendChild(idElement);

        const linesList = document.createElement('ul');
        station.lines.map(lineId => createLineElement(Core.getLine(lineId)))
            .forEach(lineElement => {
                linesList.appendChild(lineElement);
            });
        content.appendChild(linesList);

        return content;
    }

    return {
        getMap,
        initialize,
        update,
        setActiveLine,
        setActiveStation,
        setCurrentAction,
        downloadGame,
        uploadGame,
        createStationPopupContent
    };
})();