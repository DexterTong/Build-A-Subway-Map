/* eslint-env browser */
/* globals app */

const ui = (() => { // eslint-disable-line no-unused-vars
  function getMap() {
    return document.getElementById('map');
  }

  document.addEventListener('DOMContentLoaded', app.initialize);

  function initialize() {
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
      tabContents[i].classList.add('hide');
    }

    document.getElementById('button-save').onclick = app.saveGame;
    document.getElementById('button-load').onclick = app.loadGame;
    document.getElementById('button-station-add').onclick = app.stations.create;
    document.getElementById('button-station-delete').onclick = app.stations.remove;
    document.getElementById('button-line-delete').onclick = app.lines.remove;
    document.getElementById('button-line-station-add').onclick = app.addStationToLine;
    document.getElementById('button-line-station-delete').onclick = app.removeStationFromLine;

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
      if (menuLinks[i].id === tabLinkId) {
        menuLinks[i].classList.add('active');
      } else {
        menuLinks[i].classList.remove('active');
      }
    }

    const menuContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < menuContents.length; i++) {
      if (menuContents[i].id === tabContentId) {
        menuContents[i].classList.remove('hide');
      } else {
        menuContents[i].classList.add('hide');
      }
    }
  }

  function update(activeLine, activeStation, activeTransfer) { // eslint-disable-line no-unused-vars
    const lineGroupsObject = app.lines.getAll().reduce((groups, line) => {
      if (groups[line.color]) {
        groups[line.color].push(line);
      } else {
        groups[line.color] = [line];  // eslint-disable-line no-param-reassign
      }

      return groups;
    }, {});
    const lineGroupsKeys = Object.keys(lineGroupsObject);
    const lineGroups = [];
    lineGroupsKeys.forEach(key => lineGroups.push(lineGroupsObject[key]));
    lineGroups.forEach((lineGroup) => {
      lineGroup.sort((A, B) => {
        const res = A.name.localeCompare(B.name);
        if (res !== 0) { return res; }

        if (B.express) { return -1; }

        return 1;
      });
    });
    lineGroups.sort((A, B) => A[0].name.localeCompare(B[0].name));
    replaceList(document.getElementById('line-group-list'),
      lineGroups.map(lineGroup => createLineGroupElement(lineGroup)));

    replaceList(document.getElementById('station-list'),
      app.stations.getAll()
        .sort((A, B) => A.name.localeCompare(B.name))
        .map(station => createStationElement(station)));

    if (activeLine !== undefined) { setActiveLine(activeLine); }

    if (activeStation !== undefined) { setActiveStation(activeStation); }
  }

  function createLineElement(line) {
    const lineElement = document.createElement('span');
    lineElement.title = line.branch;
    lineElement.classList.add('line', line.express ? 'express' : 'local');
    lineElement.appendChild(document.createTextNode(line.name));
    lineElement.style.backgroundColor = line.color;
    lineElement.onclick = app.lines.setActive.bind(null, line.id);
    return lineElement;
  }

  function createLineGroupElement(lineGroup) {
    const lineGroupElement = document.createElement('li');
    lineGroupElement.classList.add('line-group');
    lineGroup.forEach(line => lineGroupElement.appendChild(createLineElement(line)));
    return lineGroupElement;
  }

  function setActiveLine(line) {
    let lineIcon;
    let lineExpress;
    let branch;
    let terminalOne;
    let terminalTwo;
    let stationCount;
    let stationList;

    if (line !== undefined) {
      lineIcon = createLineElement(line);
      lineExpress = document.createTextNode(line.express ? 'Express' : '');
      branch = makeEditable(document.createTextNode(line.branch), app.lines.update.bind(null, line, 'branch'));
      if (line.stations.length > 0) {
        terminalOne = document.createTextNode(app.stations.get(line.stations[0]).name);
        terminalTwo = document.createTextNode(app.stations.get(line.stations[line.stations.length - 1]).name);
      }

      stationCount = document.createTextNode(`${line.stations.length}`);
      stationList = line.stations.map(stationId => createStationElement(app.stations.get(stationId)));
    }

    replaceChild(document.getElementById('line-element-container'), lineIcon);
    replaceChild(document.getElementById('express'), lineExpress);
    replaceChild(document.getElementById('branch'), branch);
    replaceChild(document.getElementById('terminal-1'), terminalOne);
    replaceChild(document.getElementById('terminal-2'), terminalTwo);
    replaceChild(document.getElementById('station-count'), stationCount);
    replaceList(document.getElementById('line-station-list'), stationList);

    switchToLinesMenu();
  }

  function setActiveStation(station) {
    let stationName;
    let stationLines;

    if (station !== undefined) {
      stationName = makeEditable(document.createTextNode(station.name),
        app.stations.update.bind(null, station, 'name'));
      stationLines = station.lines.map(lineId => createLineElement(app.lines.get(lineId)));
    }

    replaceChild(document.getElementById('station-name'), stationName);
    replaceList(document.getElementById('station-lines'), stationLines);

    switchToStationsMenu();
  }

  function replaceChild(parentNode, newChild) {
    if (parentNode.firstChild !== null) {
      parentNode.removeChild(parentNode.firstChild);
    }

    if (newChild !== undefined) {
      parentNode.appendChild(newChild);
    }
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
        if (elementToAdd !== undefined) {
          listElement.appendChild(elementToAdd);
          listNode.appendChild(listElement);
        }
      }
    }
  }

  function createStationElement(station) {
    const stationElement = document.createElement('span');
    stationElement.classList.add('station-element');

    const stationName = document.createElement('p');
    stationName.appendChild(document.createTextNode(station.name));
    stationName.onclick = app.stations.clickController.bind(null, station.id);
    stationElement.appendChild(stationName);

    const stationLines = document.createElement('ul');
    stationLines.classList.add('line-list');
    replaceList(stationLines, station.lines.map(lineId => createLineElement(app.lines.get(lineId))));
    stationElement.appendChild(stationLines);

    return stationElement;
  }

  function downloadGame(save) {
    const saveLink = document.createElement('a');
    saveLink.classList.add('hide');
    saveLink.href = `data:${save.data}`;
    saveLink.download = save.name;
    document.body.appendChild(saveLink);
    saveLink.click();
    document.body.removeChild(saveLink);
  }

  function uploadGame() {
    const loadForm = document.createElement('input');
    loadForm.setAttribute('type', 'file');
    loadForm.onchange = app.loadHandler.bind(null, loadForm);
    loadForm.click();
  }

  function setCurrentAction(action) {
    replaceChild(document.getElementById('current-action'), document.createTextNode(action));
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
      editBox.onblur = () => callback(editBox.value);
    };

    return editableElement;
  }

  function createStationPopupContent(station) {
    const content = document.createElement('div');

    const nameElement = document.createElement('h1');
    nameElement.appendChild(document.createTextNode(station.name));
    content.appendChild(nameElement);

    const idElement = document.createElement('p');
    idElement.appendChild(document.createTextNode(`id: ${station.id}`));
    content.appendChild(idElement);

    const linesList = document.createElement('ul');
    station.lines.map(lineId => createLineElement(app.lines.get(lineId)))
      .forEach(lineElement => linesList.appendChild(lineElement));
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
    createStationPopupContent,
  };
})();
