export default function() {
    // Make room for navbar
    if (document && document.getElementById('navbar')) {
        let navbarHeight = document.getElementById('navbar').offsetHeight;
        return 'calc(100vh - '+ navbarHeight +'px)';
    }
    else {
        return 'calc(100vh - 60px)'; // reasonable default
    }
}