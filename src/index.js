class Game
{
    constructor(gameWidth, gameHeight, tilesRange, deckCode1, deckCode2)
    {
        this.gameWidth = gameWidth
        this.gameHeight = gameHeight
        this.tilesRange = tilesRange
        this.deckCode1 = deckCode1
        this.deckCode2 = deckCode2
    }

    start()
    {
        this.gameObjects = []
        for (let i = 0; i < this.tilesRange * this.tilesRange; i++)
        {
            this.newtile = new Tile(this, i)
            this.gameObjects.push(this.newtile)
        }
        this.deck = new Deck(this.deckCode1)
        this.deck.shuffle()
        this.hand = new Hand(50, 50)
        this.hand.drawCard(this.deck.cards)
        this.gameObjects.push(this.hand)
        this.drawcardbutton = new Button(this, "drawcard")
        this.gameObjects.push(this.drawcardbutton)

        if (this.deckCode2)
        {
            this.deckopp = new Deck(this.deckCode2)
            this.deckopp.shuffle()
        }


    }

    draw(ctx)
    {
        ctx.fillStyle = "#fff"
        ctx.fillRect(345, 95, 510, 510)
    }

}

class Tile
{
    constructor(game, tileID)
    {
        this.gameWidth = game.gameWidth
        this.gameHeight = game.gameHeight
        this.tileID = tileID
        this.width = 500 / game.tilesRange

        this.posX = 350 + (tileID % game.tilesRange) * this.width
        this.posy = 100 + Math.floor(tileID / game.tilesRange) * this.width
        this.color = "#fff"
        this.brtile = 3
        this.selected = false
        this.clicked = false

        this.value = 0
    }


    draw(ctx)
    {
        ctx.fillStyle = this.color
        ctx.fillRect(this.posX + this.brtile, this.posy + this.brtile, this.width - 2 * this.brtile, this.width - 2 * this.brtile)
        ctx.fillStyle = "#000"
        ctx.font = "50px sans-serif"
        if (this.value != 0)
        {
            if (this.value > 0)
            {
                if (this.value < 10)
                {
                    ctx.fillText(this.value.toString(), this.posX + 30, this.posy + 60)
                }
                else
                {
                    ctx.fillText(this.value.toString(), this.posX + 13, this.posy + 60)
                }
            }
            
        }

    }

    update()
    {
        if (mouseposX > this.posX && mouseposX < this.posX + this.width && mouseposY > this.posy && mouseposY < this.posy + this.width) 
        {
            this.color = "#f00"
            this.selected = true
            if (clickToken == true)
            {
                this.clicked = true
                this.value += mousedata.power
                mousedata.power = 0
                if (mousedata.card != null)
                {
                    mousedata.card.hand.discardCard(mousedata.card.id)
                }
                clickToken = false
            }
        }
        else if (this.clicked == true)
        {
            if (this.value > 0)
            {
                this.color = "#0f0"
            }
            else
            {
                this.color = "#000"
                this.clicked = false
            }

        }
        else
        {
            this.color = "#000"
            this.selected = false
        }
    }

}

class Button
{
    constructor(game, type)
    {
        this.gameWidth = game.gameWidth
        this.gameHeight = game.gameHeight

        this.type = type
        this.color = "#f00"
        
        if (type == "startgame")
        {
            this.posX = 420
            this.posy = 400
            this.width = 400
            this.height = 100
            this.text = "START GAME"
            this.font = "50px sans-serif"
            this.fontdelayX = 40
            this.fontdelayY = 65
        }

        if (type == "drawcard")
        {
            this.posX = 480
            this.posy = 620
            this.width = 240
            this.height = 70
            this.text = "draw card"
            this.font = "35px sans-serif"
            this.fontdelayX = 40
            this.fontdelayY = 45
        }

        this.selected = false
        this.clicked = false
    }

    draw(ctx)
    {
        ctx.fillStyle = this.color
        ctx.fillRect(this.posX, this.posy, this.width, this.height)
        ctx.fillStyle = "#000"
        ctx.font = this.font
        ctx.fillText(this.text, this.posX + this.fontdelayX, this.posy + this.fontdelayY)
    }

    update()
    {
        if (mouseposX > this.posX && mouseposX < this.posX + this.width && mouseposY > this.posy && mouseposY < this.posy + this.height) 
        {
            this.color = "#0f0"
            this.selected = true
            if (clickToken == true)
            {
                this.clicked = true
                clickToken = false
            }
        }
        else
        {
            this.color = "#f00"
            this.selected = false
        }

        if (this.clicked == true)
        {
            if (this.type == "startgame")
            {
                game.start()
                gamemode = "game"
                this.clicked = false
            }

            if (this.type == "drawcard")
            {
                game.hand.drawCard(game.deck.cards)
                this.clicked = false
            }
        }
    }

}

class MainMenu
{
    constructor(gameWidth, gameHeight)
    {
        this.gameWidth = gameWidth
        this.gameHeight = gameHeight
    }

    start()
    {
        this.gameObjects = []
        this.newbutton = new Button(this, "startgame")
        this.gameObjects.push(this.newbutton)
    }

    draw(ctx)
    {
        ctx.fillStyle = "#fff"
        ctx.font = "100px sans-serif"
        ctx.fillText("AMALTEA", 380, 250)
    }
}

class Deck
{
    constructor(deckCode)
    {
        this.cards = decodeDeck(deckCode)
    }

    shuffle()
    {
        let currentIndex = this.cards.length,  randomIndex;

        while (currentIndex != 0) 
        {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [this.cards[currentIndex], this.cards[randomIndex]] = [
          this.cards[randomIndex], this.cards[currentIndex]];
        }
    }
}

class Hand
{
    constructor(posX, posy)
    {
        this.cards = []
        this.posX = posX
        this.posY = posy
    }

    drawCard(deck)
    {
        if (this.cards.length < 3)
        {
            let drawnCardID = deck[0]
            let drawnCard = new Card(drawnCardID, this)
            this.cards.push(drawnCard)
            // removes top card drom the deck (array.shift removes first element of array)
            deck.shift()
        }
        
    }

    draw(ctx)
    {
        for (let i = 0; i < this.cards.length; i++)
        {
            this.cards[i].draw(ctx, this.posX, this.posY + 200 * i, 150, 150)
        }
    }

    update()
    {
        for (let i = 0; i < this.cards.length; i++)
        {
            this.cards[i].update()
        }
    }

    discardCard(cardID)
    {
        for (element in this.cards)
        {
            if (this.cards[element].id == cardID)
            {
                this.cards.splice(element, 1)
            }
        }
    }

}

class Card
{
    constructor(cardID, hand)
    {
        this.id = cardID
        this.posx = 0
        this.posy = 0
        this.width = 0
        this.height = 0
        this.color = "#fff"
        this.hand = hand
        this.selected = false
        this.clicked = false

        for (const element of cardsData.cards)
        {
            if (element.cardID == this.id)
            {
                this.cardName = element.cardName
                this.power = element.power
                break
            }
        }

    }

    printdata()
    {
        console.log(this.id)
        console.log(this.cardName)
        console.log(this.power)
    }

    draw(ctx, x, y, width, height)
    {
        this.posx = x
        this.posy = y
        this.width = width
        this.height = height
        ctx.fillStyle = this.color
        ctx.fillRect(x, y, width, height)
        ctx.fillStyle = "#fff"
        ctx.fillText(this.cardName, x, y + 50)
        ctx.fillText(this.power, x + 50, y + 100)
    }

    update()
    {
        if (mouseposX > this.posx && mouseposX < this.posx + this.width && mouseposY > this.posy && mouseposY < this.posy + this.width) 
        {
            this.color = "#a0a"
            this.selected = true
            if (clickToken == true)
            {
                this.clicked = true
                clickToken = false
            }
        }
        else if (this.clicked == true)
        {
            this.color = "#f0f"
            mousedata.power = parseInt(this.power)
            mousedata.card = this
            this.clicked = false
        }
        else
        {
            this.color = "#f0f"
            this.selected = false
        }
    }
}

function decodeDeck(deckCode)
{
    let words = []
    for (let i = 0; i < deckCode.length / 5; i++)
    {
        let word = deckCode.slice(i*5, i*5+ 5)
        words.push(word)
    }

    let cards = []
    for (element in words)
    {
        let cardID = words[element].slice(1, 5)
        for (i = 0; i < parseInt(words[element][0]); i++)
        {
            cards.push(cardID)
        }
    }

    return cards
}

function getRelativeMousePos(event)
{
    let rect = event.target.getBoundingClientRect();
    mouseposX = event.clientX - rect.left;
    mouseposY = event.clientY - rect.top;
}

function getClick()
{
    clickToken = true
}

function ungetClick()
{
    clickToken = false
}

function loadFile(file, callback)
{
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

var cardsData = 0
loadFile("./src/cards.json", function(text){
    cardsData = JSON.parse(text);
});

let canvas = document.getElementById("gameScreen")
let ctx = canvas.getContext("2d")

let mouseposX = 0
let mouseposY = 0

let clickToken = false

let gamemode = "mainmenu"

let mousedata = {"power": 0, "card": null}

let turn = 1

const GAME_WIDTH = 1200;
const GAME_HEIGHT = 700;

let game = new Game(GAME_WIDTH, GAME_HEIGHT, 6, "7000160003200078000650008200096000550004", "90005");
// game.start();
let menu = new MainMenu()
menu.start()

function gameloop()
{
    if (gamemode == "mainmenu")
    {
        ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        menu.draw(ctx)
        menu.gameObjects.forEach(obj=>obj.draw(ctx))
        menu.gameObjects.forEach(obj=>obj.update())
    }
    if (gamemode == "game")
    {
        ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        game.draw(ctx);
        game.gameObjects.forEach(obj=>obj.draw(ctx))
        game.gameObjects.forEach(obj=>obj.update())
    }

    requestAnimationFrame(gameloop);
}

gameloop();
