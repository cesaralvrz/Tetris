document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById("grid");
    for(var i = 0; i < 200; i++){
        container.innerHTML +=  '<div>' + '</div>';
    }
    for(var i = 0; i < 20; i++){
        container.innerHTML += '<div class="taken">' + '</div>';
    }

    const miniContainer = document.getElementById('mini-grid');
    for(var i = 0; i < 16; i++){
        miniContainer.innerHTML += '<div>' + '</div>';
    }

    let squares = Array.from(document.querySelectorAll('#grid div'));
    const scoreDisplay = document.querySelector('#score'); 
    const startBtn = document.querySelector("#startButton")
    const width = 10;
    let nextRandom = 0;
    let timerId;
    let score = 0;
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue',
      ]

    //console.log(squares);

    // Formas:
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
      ]
    
      const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
      ]
    
      const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
      ]
    
      const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
      ]
    
      const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
      ]

      const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
      
      let currentPosition = 4;
      let currentRotation = 0;

      let random = Math.floor(Math.random()*theTetrominoes.length);
      console.log(random);
      let current = theTetrominoes[random][currentRotation];

      console.log(theTetrominoes);

      // Dibujar el Tetromino
      function draw(){
          current.forEach(index => {
              squares[currentPosition + index].classList.add('tetromino');
              squares[currentPosition + index].style.backgroundColor = colors[random]
          })
      }

      function undraw(){
          current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = ''
          })
      }

      // Velocidad de caída
      // timerId = setInterval(moveDown, 750);

      // Asignar funciones a teclas
      function control(e){
          // Asignamos a las tecla '37' (flecha izquierda)
          if(e.keyCode === 37){
            moveLeft();
          }else if (e.keyCode === 38){
            rotate();
          }else if(e.keyCode === 39){
              moveRight();
          }else if(e.keyCode === 40){
              moveDown();
          }

      }
      document.addEventListener('keyup', control);

      function moveDown(){
          undraw();
          currentPosition += width;
          draw();
          freeze();
      }

      function freeze(){
          // Cuando alguna parte de la forma del cubo toca un div co clase "taken"
          if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
              // Se aplica al resto
              current.forEach(index => squares[currentPosition + index].classList.add('taken'))
              // Que empieza a caer otro tetrominio
              random = nextRandom;
              nextRandom = Math.floor(Math.random() * theTetrominoes.length) 
              current = theTetrominoes[random][currentRotation];
              currentPosition = 4;
              draw();
              displayShape();
              addScore();
              gameOver(); 
          }
      }
      // movimiento a la izquierda
      function moveLeft(){
          undraw();
          const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

          if (!isAtLeftEdge) currentPosition -= 1;

          if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
              currentPosition +=1
          }

          draw()
      }

      // movimiento a la derecha
      function moveRight(){
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1);

        if (!isAtRightEdge) currentPosition += 1;

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition -=1
        }

        draw()
    }

    function rotate(){
        undraw();
        currentRotation ++;
        if(currentRotation === current.length){
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        draw();
    }

    const displaySquares = document.querySelectorAll('#mini-grid div')
    const displayWidth = 4
    const displayIndex = 0


    // Formas sin rotación
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
        [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
        [0, 1, displayWidth, displayWidth+1], //oTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
    ]

    // Display en el minigrid
    function displayShape() {
        // Quitar la forma del minigrid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    startBtn.addEventListener('click', () => {
        // timerId != null
        if (timerId){
            clearInterval(timerId)
            timerId = null
        // default    
        }else{
            draw()
            timerId = setInterval(moveDown, 750)
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            displayShape()
        }
    })

    function addScore() {
        for (let i = 0; i < 199; i +=width) {
          const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
    
          if(row.every(index => squares[index].classList.contains('taken'))) {
            score +=10
            scoreDisplay.innerHTML = score
            row.forEach(index => {
              squares[index].classList.remove('taken')
              squares[index].classList.remove('tetromino')
              squares[index].style.backgroundColor = ''
            })
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
          }
        }
      }

      function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
          scoreDisplay.innerHTML = 'end'
          clearInterval(timerId)
        }
      }
    

})