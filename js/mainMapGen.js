var mapGen;

define(['jquery', 'mapGen'], function($, MapGen) {
    var initMapGen = function() {
        $(document).ready(function() {
            //build out the map generator
            mapGen=new MapGen();
        });
    }
    
    initMapGen();
});