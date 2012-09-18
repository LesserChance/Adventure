define(['jquery', 'game'], function($, Game) {
    var initGame = function() {
        $(document).ready(function() {
            new Game();
        });
    }
    
    initGame();
});