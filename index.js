const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight 

const gravity = 1.5

// Images
const platform_img = new Image()
platform_img.src = 'http://127.0.0.1:5500/img/platform1.png'
console.log(platform_img)


// Création de la Classe Player
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

const player = new Player()
const platforms = [
    new Platform({x: 200, y:800, image: platform_img}),
    new Platform({x:300, y: 700, image: platform_img})]
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}


let scrollOffset = 0

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0,0, canvas.width, canvas.height)
    platforms.forEach(platform => {
        platform.draw()
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
        } else if (keys.left.pressed) {
            scrollOffset -= 5
            platforms.forEach(platform => {
                platform.position.x += 5
            } )
            
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

}

animate()

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
            player.velocity.y -= 20
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
            player.velocity.y -= 20
            break            
    }
})