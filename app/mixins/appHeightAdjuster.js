export default {
    methods: {
        adjustAppHeight: function() {
            if (document && document.getElementById('navbar')) {
                // Make room for navbar
                let navbarHeight = document.getElementById('navbar').offsetHeight;
                return 'calc(100vh - '+ navbarHeight +'px)';
            }
            else {
                // No navbar
                return 'calc(100vh)'; 
            }
        },
    },
}
