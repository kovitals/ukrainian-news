document.addEventListener('DOMContentLoaded', function () {
    newsGenerator.showNews_(newsGenerator.requestNews());
    document.getElementById('readall').addEventListener('click', newsGenerator.markAllAsRead);
});
