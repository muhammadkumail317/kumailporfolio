"use strict";

/*==== PARTICLE CONFIGURATION ====*/


const canvas = document.getElementById(
    "particles"
);


const ctx = canvas?.getContext("2d");


let particlesArray = [];



/*==== CANVAS SIZE ====*/


function resizeCanvas() {


    if (!canvas) return;


    canvas.width = window.innerWidth;


    canvas.height = window.innerHeight;


}


resizeCanvas();



window.addEventListener(

    "resize",

    resizeCanvas

);



/*==== MOUSE POSITION ====*/


const mouse = {


    x: null,

    y: null,

    radius: 120


};




window.addEventListener(

    "mouseout",

    () => {


        mouse.x = null;


        mouse.y = null;


    }

);




/*==== PARTICLE CLASS ====*/


class Particle {


    constructor() {


        this.x =

            Math.random() *

            canvas.width;



        this.y =

            Math.random() *

            canvas.height;



        this.size =

            Math.random() * 3 + 1;



        this.speedX =

            Math.random() * 1 - 0.5;



        this.speedY =

            Math.random() * 1 - 0.5;


    }



    update() {


        this.x += this.speedX;


        this.y += this.speedY;



        if (

            this.x < 0 ||

            this.x > canvas.width

        ) {

            this.speedX *= -1;

        }



        if (

            this.y < 0 ||

            this.y > canvas.height

        ) {

            this.speedY *= -1;

        }



        // Mouse interaction


        if (mouse.x && mouse.y) {


            const dx =

                mouse.x - this.x;



            const dy =

                mouse.y - this.y;



            const distance =

                Math.sqrt(

                    dx * dx +

                    dy * dy

                );



            if (distance < mouse.radius) {


                this.x -= dx / 20;


                this.y -= dy / 20;


            }


        }


    }



    draw() {


        ctx.beginPath();


        ctx.arc(

            this.x,

            this.y,

            this.size,

            0,

            Math.PI * 2

        );


        ctx.fillStyle =

            "rgba(59,130,246,0.8)";


        ctx.fill();


    }


}



/*==== CREATE PARTICLES ====*/


function initParticles() {


    particlesArray = [];



    const number =

        window.innerWidth < 768

            ? 40

            : 100;



    for (

        let i = 0;

        i < number;

        i++

    ) {


        particlesArray.push(

            new Particle()

        );


    }


}


initParticles();



window.addEventListener(

    "resize",

    initParticles

);


/*==== PARTICLES PART 2  ANIMATION ENGINE ====*/


/*==== CONNECT PARTICLES ====*/


function connectParticles() {


    if (!canvas || !ctx) return;



    for (

        let a = 0;

        a < particlesArray.length;

        a++

    ) {


        for (

            let b = a;

            b < particlesArray.length;

            b++

        ) {


            const dx =

                particlesArray[a].x -

                particlesArray[b].x;



            const dy =

                particlesArray[a].y -

                particlesArray[b].y;



            const distance =

                Math.sqrt(

                    dx * dx +

                    dy * dy

                );



            if (distance < 120) {


                const opacity =

                    1 -

                    distance / 120;



                ctx.beginPath();



                ctx.strokeStyle =

                    `rgba(59,130,246,${opacity * 0.35})`;



                ctx.lineWidth = 1;



                ctx.moveTo(

                    particlesArray[a].x,

                    particlesArray[a].y

                );



                ctx.lineTo(

                    particlesArray[b].x,

                    particlesArray[b].y

                );



                ctx.stroke();



            }


        }


    }


}



/*==== ANIMATION LOOP ====*/


let animationID;


let animationPaused = false;



function animateParticles() {


    if (!canvas || !ctx) return;



    if (animationPaused) {


        return;


    }



    ctx.clearRect(

        0,

        0,

        canvas.width,

        canvas.height

    );



    particlesArray.forEach(

        particle => {


            particle.update();


            particle.draw();


        }

    );



    connectParticles();



    animationID =

        requestAnimationFrame(

            animateParticles

        );


}



animateParticles();




/*==== TAB VISIBILITY OPTIMIZATION ====*/


document.addEventListener(

    "visibilitychange",

    () => {


        if (document.hidden) {


            animationPaused = true;



            cancelAnimationFrame(

                animationID

            );


        }


        else {


            animationPaused = false;



            animateParticles();


        }


    }

);




/*==== THEME SUPPORT ====*/


function updateParticleTheme() {


    const isLight =

        document.body.classList.contains(

            "light-theme"

        );



    if (isLight) {


        return {


            particle:

                "rgba(15,23,42,0.35)",


            line:

                "rgba(15,23,42,0.15)"


        };


    }



    return {


        particle:

            "rgba(59,130,246,0.8)",


        line:

            "rgba(59,130,246,0.35)"


    };


}




/*==== OVERRIDE DRAW COLORS ====*/


Particle.prototype.draw = function () {


    const colors =

        updateParticleTheme();



    ctx.beginPath();



    ctx.arc(

        this.x,

        this.y,

        this.size,

        0,

        Math.PI * 2

    );



    ctx.fillStyle =

        colors.particle;



    ctx.fill();


};




/*==== CLEANUP ====*/


window.addEventListener(

    "beforeunload",

    () => {


        cancelAnimationFrame(

            animationID

        );


    }

);



console.log(

    "%cParticle Background Activated ✨",

    "color:#3b82f6;font-weight:bold;"

);s