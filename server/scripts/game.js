var Game = new (function() {
    var gravityVector;
    var forceVector;
    var world;
    var canvas;
    var content;
    var SCALE = 30;
    var ballBody;
    
    var createBall = function() {
        var ballFixture = new Box2D.Dynamics.b2FixtureDef();
        ballFixture.density = 1.0;
        ballFixture.friction = 0.1;
        ballFixture.restitution = 0.75;
        ballFixture.shape = new Box2D.Collision.Shapes.b2CircleShape(0.5);
        
        var ballDef = new Box2D.Dynamics.b2BodyDef();
        ballDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        ballDef.position.x = 0;
        ballDef.position.y = 0;

        ballBody = world.CreateBody(ballDef);
        ballBody.CreateFixture(ballFixture);  
    };
    
    var createWalls = function() {
        var fWallFixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fWallFixtureDef.density = 1.0;
        fWallFixtureDef.friction = 0.5;
        fWallFixtureDef.restitution = 0.2;
        fWallFixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
        
        drawBlock(0,0, 1/SCALE, 480/SCALE, fWallFixtureDef);
        drawBlock(600/SCALE, 0, 1/SCALE, 480/SCALE, fWallFixtureDef);
    };
    
    var createFixtureRow = function(row) {
        var rowSep = 100;
        var ballSize = 64 / SCALE;
        var appwidth = 600;
        var remainingWidth = appwidth / SCALE;
        
        var fFixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fFixtureDef.density = 1.0;
        fFixtureDef.friction = 0.5;
        fFixtureDef.restitution = 0.2;
        fFixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
        var spaceLeft = true;
        var offset = 0;
        var rowPos = row * rowSep / SCALE;
        var maxholecount = 2;
        var holecount = 0;
        
        do {
            maxholecount = Math.ceil((Math.random() * 2));
            var partition = Math.random() * (remainingWidth - ballSize);
            var halfWidth1 = ( partition / 2 );
            var offsetIncrement = ballSize + (halfWidth1 * 2);
            
            drawBlock(offset + halfWidth1, row * rowSep / SCALE,
                      halfWidth1,
                      (10/SCALE) / 2, 
                      fFixtureDef );
                                          
            offset += offsetIncrement;
            remainingWidth -= offsetIncrement;
            
            holecount++;
        } while(remainingWidth > ballSize && holecount < maxholecount)
        
        drawBlock(offset + remainingWidth / 2 , 
                  row * rowSep / SCALE,
                  remainingWidth / 2,
                  (10/SCALE) / 2, 
                  fFixtureDef );
    };
    
    this.loadLevel = function(level) {
        this.init();
    };
    
    this.init = function() {
        canvas = document.getElementById("game");
        context = canvas.getContext("2d");
        gravityVector = new Box2D.Common.Math.b2Vec2(0, 10);
        forceVector = new Box2D.Common.Math.b2Vec2(0, 0);
        world = new Box2D.Dynamics.b2World(gravityVector, true);
        
        createBall();
        createWalls();
        createFixtureRow(1, seed);
        createFixtureRow(2, seed);
        createFixtureRow(3, seed);
        createFixtureRow(4, seed);
        // Might not want to game tick
        gameTick();
    };
    
    this.resize = function(width, height) {
        
    };
    
    this.takeInput = function(direction) {
        forceVector.Set(direction, 0);
    };
    
    var drawFrame = function() {
        
    };
    
    var updateWorld = function() {
        world.SetGravity(gravityVector); 
        world.Step(
            1 / 60   //frame-rate
            ,  10    //velocity iterations
            ,  10    //position iterations
        );
      
        world.DrawDebugData();
        world.ClearForces();   
    };
    
    var processInput = function() {
        ballBody.ApplyForce(forceVector, ballBody.GetWorldCenter());
    };
    
    var gameTick = function() {
        processInput();
        updateWorld();
        drawFrame();
        requestAnimFrame(gameTick);
    };
})();

window.addEventListner("DOMContentLoaded", function(e) {
      
}, false);

window.addEventListner("resize", function(e) {
   Game.resize(document.width, document.height);
});

window.addEventListener("deviceorientation", function(e) {
    var power = Math.abs(e.gamma) * 2; // convert to a unit vector of X
    var angle = 0;
    if(e.gamma < 0)
      angle = 180;
    
    Game.takeInput(Math.cos(angle * (Math.PI / 180)) * power);
}, false);


var app = new routes();

app.get("/level/:level", function(req) {
    Game.loadLevel(req.level);
});