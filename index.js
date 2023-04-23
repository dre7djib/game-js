const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 0.5


// Images
// Platforme
const platform_img = new Image() 
platform_img.src = 'http://127.0.0.1:5500/img/platform1.png'

// Ground
const ground_img = new Image()
ground_img.src = 'http://127.0.0.1:5500/img/ground.png'

// Background
const background_img = new Image()
background_img.src = 'http://127.0.0.1:5500/img/background.gif'


// Sprites Mario
const runLeft_img = new Image()
runLeft_img.src = 'http://127.0.0.1:5500/img/sprites/run_left.png'
const runRight_img = new Image()
runRight_img.src = 'http://127.0.0.1:5500/img/sprites/run_right.png'
const stand_img = new Image()
stand_img.src = 'http://127.0.0.1:5500/img/sprites/stand.png'



// Création des Classes
class Player {
    constructor() {
        this.speed = 4
        this.position = {
            x : 100,
            y: 100
        }
        this.velocity = {
            x : 0,
            y: 0
        }
        this.width = 30
        this.height = 50

        this.image = stand_img
    
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y,this.width, this.height)
    }

    update() {
        this.frames++
        this.draw()
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x


        if(this.position.y + this.height + this.velocity.y  <= canvas.height)
            this.velocity.y += gravity
    }
}
class Ground {
    constructor( {x , y, image}) {
        this.position = {
            y,
            x 
        }

        this.image = image
        this.width = image.width
        this.height = image.height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}
class Platform {
    constructor( {x , y, image}) {
        this.position = {
            y,
            x 
        }

        this.image = image
        this.width = image.width
        this.height = image.height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}
class GenericObjects {
    constructor( {x , y, image, height,width}) {
        this.position = {
            y,
            x
        }

        this.image = image
        this.width = width
        this.height = height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.height, this.width)
    }
}

let player = new Player()
let platforms = []
let grounds = []
let genericObjects = []

let scrollOffset = 0



// Fonction Init lorsqu'on perds
function init() {
    player = new Player()
    platforms = [
        new Platform({x:ground_img.width * 5 + 200 -1, y: 400, image: platform_img}),
        new Platform({x:ground_img.width * 5 + 350 -1, y: 300, image: platform_img}),

    ]
    grounds = [
        // Ground 
        new Ground({x:-1, y: canvas.height - ground_img.height, image: ground_img}),
        new Ground({x:ground_img.width - 3, y: canvas.height - ground_img.height, image: ground_img}),
        new Ground({x:ground_img.width * 2 - 3, y: canvas.height - ground_img.height, image: ground_img}),
        new Ground({x:ground_img.width * 3 + 150, y: canvas.height - ground_img.height, image: ground_img}),
        new Ground({x:ground_img.width * 4 + 150 -3, y: canvas.height - ground_img.height, image: ground_img}),
        new Ground({x:ground_img.width * 6 + 200 -3, y: canvas.height - ground_img.height, image: ground_img}),
        new Ground({x:ground_img.width * 7 + 200 -3, y: canvas.height - (ground_img.height * 3), image: ground_img}),
        new Ground({x:ground_img.width * 9 + 100 -3, y: canvas.height - ground_img.height, image: ground_img}),
        
    
    ]
    genericObjects = [
        new GenericObjects({x:0, y:0, image: background_img, height:1024, width:576}),
        new GenericObjects({x:background_img.width - 3, y:0, image: background_img, height:1024, width:576}),
        new GenericObjects({x:background_img.width * 2 - 5, y:0, image: background_img, height:1024, width:576}),

    ]

    scrollOffset = 0
}
// Création et Placement des éléments







const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}
// Appuie sur la touche
addEventListener('keydown', ({keyCode}) => {
    switch(keyCode) {
        case 81:
            console.log('left')
            keys.left.pressed = true
            break
        case 83:
            console.log('down')
            break
        case 68:
            console.log('right')
            keys.right.pressed = true
            break
        case 90:
            console.log('up')
            //if (event.repeat) { return }
            player.velocity.y -= 15
            break            
    }
})

// Relacher la Touche 
addEventListener('keyup', ({keyCode}) => {
    switch(keyCode) {
        case 81:
            console.log('left')
            keys.left.pressed = false
            break
        case 83:
            console.log('down')
            break
        case 68:
            console.log('right')
            keys.right.pressed = false
            break
        case 90:
            console.log('up')
            break            
    }
})


function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0, canvas.width, canvas.height)
    genericObjects.forEach(GenericObjects => {
        GenericObjects.draw()
    })
    grounds.forEach(ground => {
        ground.draw()
    })
    platforms.forEach(Platform => {
        Platform.draw()
    })
    player.update()


    if (keys.right.pressed == true && player.position.x < 400 ) {
        player.velocity.x = player.speed
    } else if ((keys.left.pressed == true && player.position.x > 150) || keys.left.pressed && scrollOffset === 0 && player.position.x > 0 ) {
        player.velocity.x = -player.speed
    } else {
        player.velocity.x = 0
        if (keys.right.pressed){
            scrollOffset += player.speed
            platforms.forEach(platform => {
                platform.position.x -= player.speed
            } )
            grounds.forEach(ground => {
                ground.position.x -= player.speed
            })
            genericObjects.forEach(GenericObjects => {
                GenericObjects.position.x -= player.speed * 0.66
            })
        } else if (keys.left.pressed) {
            scrollOffset -= player.speed
            platforms.forEach(platform => {
                platform.position.x += player.speed
            } )
            grounds.forEach(ground => {
                ground.position.x += player.speed
            })
            genericObjects.forEach(GenericObjects => {
                GenericObjects.position.x += player.speed * 0.66
            })
            
        }
    }


    // Collision Joueur / Platforme
    platforms.forEach(platform => {
        if (player.position.y + player.height <= platform.position.y 
            && player.position.y + player.height + player.velocity.y >= platform.position.y 
            && player.position.x + player.width >= platform.position.x
            && player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0
        }

    })
    grounds.forEach(ground => {
        if (player.position.y + player.height <= ground.position.y 
            && player.position.y + player.height + player.velocity.y >= ground.position.y 
            && player.position.x + player.width >= ground.position.x
            && player.position.x <= ground.position.x + ground.width) {
            player.velocity.y = 0
        }

        if (scrollOffset > 2000) {
            console.log('Win')
        }
    })


    // Win
    if (scrollOffset > 2000) {
        console.log('Win')
    }

    // Loose
    if(player.position.y > canvas.height) {
        init()
    }
}

init()
animate()