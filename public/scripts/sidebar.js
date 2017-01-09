document.addEventListener('DOMContentLoaded', function() {
    moveHeaderToSidebar();
});

function moveHeaderToSidebar() {
    const common = document.getElementById('common');
    const sidebar = document.getElementById('sidebar');
    common.parentNode.removeChild(common);
    sidebar.insertBefore(common, sidebar.firstChild);
}