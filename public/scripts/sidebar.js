document.addEventListener('DOMContentLoaded', function() {
    moveHeaderToSidebar();
    addListeners();
});

function moveHeaderToSidebar() {
    const common = document.getElementById('main-header');
    const sidebar = document.getElementById('sidebar');
    common.parentNode.removeChild(common);
    sidebar.insertBefore(common, sidebar.firstChild);
}

function addListeners() {
    addTabListeners();
}

function addTabListeners() {
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
           switchTab(event.target, tabContentId);
        });
    }
}

function switchTab(tabLinkElement, tabContentId) {
    const tabLinks = document.getElementsByClassName('tab-link');
    for(let i = 0; i < tabLinks.length; i++) {
        if(tabLinks[i] === tabLinkElement)
            tabLinks[i].classList.add('active');
        else
            tabLinks[i].classList.remove('active');
    }
    const tabContents = document.getElementsByClassName('tab-content');
    for(let i = 0; i < tabContents.length; i++) {
        if(tabContents[i].id === tabContentId)
            tabContents[i].style.display = '';
        else
            tabContents[i].style.display = 'none';
    }
}

//called by map.js
function initDefaults() {
    document.getElementsByClassName('tab-link')[0].click();
    document.getElementsByClassName('line')[0].click();
    document.getElementsByClassName('leaflet-marker-pane')[0].firstChild.click();
    const stationList = document.getElementById('station-list');
    createStationArray(undefined, true).forEach(stationElement => {stationList.appendChild(stationElement)});
}