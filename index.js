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
background_img.src = 'http://127.0.0.1:5500/img/background1d.png'

const cloud_img = new Image()
cloud_img.src = 'http://127.0.0.1:5500/img/clouds.png'






// Création des Classes
class Player {
    constructor() {
        this.position = {
            x : 100,
            y: 100
        }
        this.velocity = {
            x : 0,
            y: 0
        }
        this.width = 30
        this.height = 30
    }

    draw() {
        c.fillStyle = 'green'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x


        if(this.position.y + this.height + this.velocity.y  <= canvas.height)
            this.velocity.y += gravity
        else this.velocity.y = 0
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

// Création et Placement des éléments
const player = new Player()
const platforms = [
    new Platform({x: 70, y:800, image: platform_img}),
    new Platform({x:300, y: 400, image: platform_img})]
const grounds = [
    // Ground 
    new Ground({x:-1, y: canvas.height - ground_img.height, image: ground_img}),
    new Ground({x:ground_img.width - 1, y: canvas.height - ground_img.height, image: ground_img}),
    new Ground({x:ground_img.width * 2 - 1, y: canvas.height - ground_img.height, image: ground_img}),
    new Ground({x:ground_img.width * 3 - 1, y: canvas.height - ground_img.height, image: ground_img}),
]
const genericObjects = [
    new GenericObjects({x:0, y:0, image: background_img, height:1024, width:576}),
    new GenericObjects({x:200, y:100, image: cloud_img, height:120, width:67.5})
]



let scrollOffset = 0






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
            player.velocity.y -= 10
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
            player.velocity.y -= 10
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
        player.velocity.x = 5
    } else if (keys.left.pressed == true && player.position.x > 70) {
        player.velocity.x = -5
    } else {
        player.velocity.x = 0
        if (keys.right.pressed){
            scrollOffset += 5
            platforms.forEach(platform => {
                platform.position.x -= 5
            } )
            grounds.forEach(ground => {
                ground.position.x -= 5
            })
            genericObjects.forEach(GenericObjects => {
                GenericObjects.position.x -= 3
            })
        } else if (keys.left.pressed) {
            scrollOffset -= 5
            platforms.forEach(platform => {
                platform.position.x += 5
            } )
            grounds.forEach(ground => {
                ground.position.x += 5
            })
            genericObjects.forEach(GenericObjects => {
                GenericObjects.position.x += 3
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

        if (scrollOffset > 2000) {
            console.log('Win')
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

}

animate()