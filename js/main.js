(function(){
    // Constantes
    const START_SECONDS = 2;
    const SECONDS_DECREM = 0.025;
    const START_POINTS = 50;
    const POINTS_INCREM = 50;

    // Rectangle
    function createRectangle(width, height, x, y, lineWidth, lineColor, fillColor){
        let rectangle = new PIXI.Graphics();
        rectangle.lineStyle(lineWidth, lineColor, 1);
        rectangle.beginFill(fillColor);
        rectangle.drawRect(0, 0, width, height);
        rectangle.endFill();
        rectangle.x = x;
        rectangle.y = y;
        return rectangle;
    }
    // Cercle
    function createCircle(radius, x, y, fillColor){
        let circle = new PIXI.Graphics();
        circle.beginFill(fillColor);
        circle.drawCircle(0, 0, radius);
        circle.endFill();
        circle.x = x;
        circle.y = y;
        return circle;
    }
    // Texte
    function createText(value, x, y, style, anchor = {x:0, y:0}){
        let text = new PIXI.Text(value, style);
        text.position.set(x - (text.width * anchor.x), y - (text.height * anchor.y));
        return text;
    }

    // Création de l'application
    const app = new PIXI.Application({
        width: 10,
        height: 10,
        antialias: false,
        transparent: false,
        resolution: 50
    });
    // Ajout du canvas au body
    document.body.appendChild(app.view);
    // Style du canvas
    app.renderer.view.style.margin = 'auto';
    app.renderer.view.style.display = 'block';
    // Couleur du background
    app.renderer.backgroundColor = 0x061639;
    // Formes
    let timeline = createRectangle(10, 1.5, 0, 7, 0, 0x000000, 0xFF00DF);
    app.stage.addChild(timeline);
    let letterCircle = createCircle(2.5, 5, 4, 0xFF00DF);
    app.stage.addChild(letterCircle);
    // Textes
    let score = createText("000000", 0, 0, {
        fill: 0xFFFFFF,
        fontSize: 1,
        fontFamily: 'Arcade'
    });
    app.stage.addChild(score);
    let letter = createText("A", 5, 4, {
        fill: 0xFFFFFF,
        fontSize: 2,
        fontFamily: 'Arcade'
    }, {x: 0.43, y: 0.4});
    app.stage.addChild(letter);

    // Boucle de jeu
    let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ".split('');
    let seconds = START_SECONDS;
    let actual = 0;
    let highscore = 0;
    let lost = false;
    app.ticker.add(_ => {
        if(lost){ // PERDU
            timeline.width = 0;
        }
        else{ // PARTIE EN COURS
            // Calcul du delta
            let delta = app.ticker.elapsedMS / 1000;
            // Ajout du delta au compteur
            actual += delta;
            // Calcul de la width de la timeline
            let timelineWidth = 10;
            let timelineCoef = actual / seconds;
            timelineCoef = timelineCoef * 1.1;
            timelineCoef = 1 - timelineCoef;
            timeline.width = timelineWidth * timelineCoef;
            // A la fin de la timeline => perdu
            if(actual >= seconds){
                lost = true;
            }
        }
    });

    // Touches
    document.addEventListener('keydown', function(key){
        // Si la partie est toujours en cours
        if(!lost){
            // Si c'est la bonne touche
            if(key.key.toUpperCase() == letter.text){
                // On augmente le score
                highscore += 50 + (50 * Math.round((START_SECONDS - seconds) / SECONDS_DECREM));
                // On met à jour le texte du score
                let scoreText = '';
                for(let i = 0; i < (6 - (highscore+'').length); i++){
                    scoreText += "0";
                }
                scoreText += highscore;
                score.text = scoreText;
                // On met à jour le jeu
                actual = 0;
                seconds -= SECONDS_DECREM;
                seconds = Math.round(seconds * 1000) / 1000;
                letter.text = letters[Math.floor(Math.random() * letters.length)];
            }
            else{ // Sinon c'est perdu
                lost = true;
            }
        }
    });
})();