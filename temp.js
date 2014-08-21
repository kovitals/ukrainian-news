/**
 * Created by vitaliyko on 8/21/14.
 */
document.addEventListener('DOMContentLoaded', function () {
    newsGenerator.showNews_(newsGenerator.requestNews());
    document.getElementById('readall').addEventListener('click', newsGenerator.markAllAsRead);
});
