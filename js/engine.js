/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.getElementById('game-area').appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */

    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    };

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        lastTime = Date.now();
        $("#game-area").css("display", 'block');
        game.resetGame();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
    }

    /* This is called by the update function  and loops through all of the
     * objects within your level.enemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        if (game.state === "game") {
            game.levels[game.lvl].enemies.forEach(function(enemy) {
                enemy.update(dt);
            });
            game.player.update();
        }
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        // Draw background rectangle
        ctx.beginPath();
        ctx.rect(0, 0, 505, 606);
        ctx.fillStyle = 'white';
        ctx.fill();

        switch(game.state){
        case "game":
            game.levels[game.lvl].render();

            /* Loop through all of the objects within the level.enemies array and call
             * the render function you have defined.
             */
            game.levels[game.lvl].enemies.forEach(function(enemy) {
                enemy.render();
            });

            // Render player

            game.player.render();

            // Render status text

            ctx.font = "bold 20pt Calibri";
            ctx.textAlign = "center";
            ctx.fillStyle = 'black';
            ctx.fillText("Lives: " + game.lives, 125, 37);
            ctx.fillText("Level: " + game.lvl + 1, 375, 37);
            break;

        case "start":
            // Draw Selector
            game.selector.render();

            // Draw characters
            var i = 0;
            var chr = game.selector.characters;
            for (i = 0; i < chr.length; i++) {
                ctx.drawImage(Resources.get(chr[i]['sprite']), i * 101 + 50, 3 * 83 - 20);
            }

            // Draw text

            ctx.font = 'bold 20pt Calibri';
            ctx.textAlign = 'center';
            ctx.fillStyle = "black";
            ctx.fillText('Select Your Heroine!', 252, 100);
            ctx.font = 'bold 14pt Calibri';
            ctx.fillText('Press Space or Enter to Begin', 252, 160);
            break;

        case "win":
            ctx.drawImage(Resources.get(game.player.sprite), 101+50, 3 * 83 - 20);
            ctx.drawImage(Resources.get('images/char-boy.png'), 202+50, 3 * 83 - 20);
            ctx.drawImage(Resources.get('images/Heart.png'), 151+50, 3 * 83 - 20);

            ctx.font = 'bold 20pt Calibri';
            ctx.textAlign = 'center';
            ctx.fillStyle = "black";
            ctx.fillText('You Win!', 252, 100);
            ctx.font = 'bold 14pt Calibri';
            ctx.fillText('Press Space or Enter to Restart', 252, 160);
            break;

        case "over":


            ctx.font = 'bold 20pt Calibri';
            ctx.textAlign = 'center';
            ctx.fillStyle = "black";
            ctx.fillText('Game Over!', 252, 100);
            ctx.font = 'bold 14pt Calibri';
            ctx.fillText('Press Space or Enter to Restart', 252, 160);
            break;
        }
    }


    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-horn-girl.png',
        'images/char-cat-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/enemy-bug-flipped.png',
        'images/Selector.png',
        'images/Heart.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
