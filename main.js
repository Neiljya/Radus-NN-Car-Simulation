const carCanvas = document.getElementById("carCanvas");
const networkCanvas = document.getElementById("networkCanvas");

//networkCanvas.width = 300;
carCanvas.width = 200;

// create a 2d render context 
const carCtx = carCanvas.getContext("2d");
//const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width*.9);

// create a car
const N = 100;
const cars  = generateCars(N);

let bestCar = cars[0];

if(localStorage.getItem("bestBrain")){

    for(let i = 0; i < cars.length; i++){

        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain")
        );

        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain, 0.2)
        }
   
    }
    bestCar.brain = JSON.parse(
        localStorage.getItem("bestBrain")
    );

}

function generateRandomCar() {
    const lane = Math.floor(Math.random() * 3); 
    const positionY = -Math.random() * 500 - 100; 
    return new Car(road.getLaneCenter(lane), positionY, 30, 50, "NPC", 2);
}

function generateInitialTraffic(numberOfCars) {
    const initialTraffic = [];
    for (let i = 0; i < numberOfCars; i++) {
        initialTraffic.push(generateRandomCar());
    }
    return initialTraffic;
}


const traffic = generateInitialTraffic(6); 



// animate the car
animate_car();

function save(){
    localStorage.setItem("bestBrain",
    JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain")
}

function generateCars(N){
    const cars = [];

    for(let i = 1; i <= N; i ++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"))
    }

    return cars;
}
function animate_car(){


    for(let i = 0; i < traffic.length; i ++){
        traffic[i].update_pos(road.borders, []);
    }

    for(let i = 0; i < cars.length; i ++){
        cars[i].update_pos(road.borders, traffic);
    }

    // Fitness function
    // find the car with the minimum y-value of all the y-values of each car
    bestCar = cars.find(
        c => c.y == Math.min(...cars.map(c=>c.y))
    );

    // clears the canvas every time
    carCanvas.height = window.innerHeight;
    //networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y+carCanvas.height*.7);

    road.draw(carCtx);

    for(let i = 0; i < traffic.length; i ++){
        traffic[i].draw(carCtx);

    }

    carCtx.globalAlpha = 0.2;

    for(let i = 0; i < cars.length; i ++){
        cars[i].draw(carCtx, "blue");
    }

    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "blue", true);

    carCtx.restore();
    // updates per frame

    requestAnimationFrame(animate_car);
}