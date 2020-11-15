
var Q = [
	  [100, 0, 0, 0, 0],
	  [0, 0, 0, 0, 0],
	  [0, 0, 0, 0, 0],
	  [0, 0, 0, 0, 0],
	  [0, 0, 0, 0, 0]
	];

class cord {
  constructor(X,Y) {
	   
	  if(X<=4 && Y<=4 && X>=0 && Y>=0){
		this.x = X;
		this.y = Y;

	  }
	}
	get X() {
    return this.x;
	}
	get Y() {
    return this.y;
	}
	
	XY(X,Y){
		this.x = X;
		this.y = Y;
	}
	
	
}

class QlearningHorse{
	
constructor() {
	this.ALPHA = 0.1;
	this.GAMMA = 0.95;
	this.Actions = [];
	this.score = 0.0;
}

 RandomInteger(min,max) {
  // случайное число от min до (max+1)
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

MaxScoreList(aray){
	let max = aray[0];
	aray.forEach(function(e) {
		if (Q[e.X][e.Y] > Q[max.X][max.Y]) max = e;
	});
	return Q[max.X][max.Y];
}

 FilterArr(item){
	 return item.X != undefined && item.Y != undefined
 }
 
 ListStep(state){
	 //функция списка возможных ходов из данного состояния
	var LStep = []; 

	LStep.push(new cord(state.X+2, state.Y+1));
	LStep.push(new cord(state.X-2, state.Y+1));
	LStep.push(new cord(state.X+2, state.Y-1));
	LStep.push(new cord(state.X-2, state.Y-1));
	LStep.push(new cord(state.X+1, state.Y+2));
	LStep.push(new cord(state.X-1, state.Y+2));
	LStep.push(new cord(state.X+1, state.Y-2));
	LStep.push(new cord(state.X-1, state.Y-2));
	LStep = LStep.filter(this.FilterArr);

	return LStep;
 }
 
 MaxAdvan(state){
	 //функция наиболее выгодного хода
	 var max = 0;
	 var maximum = state;
	 var lS= this.ListStep(state);
	 lS.forEach(function(item){

		if(Q[item.X][item.Y] > max){
			max=Q[item.X][item.Y];
			maximum.XY(item.X,item.Y);
			
		}
		if(Q[item.X][item.Y] == max){
			var ch= Math.floor(1 + Math.random() * (2 + 1 - 1));

			if(ch == 1)
			{
				max=Q[item.X][item.Y]; 
				maximum.XY(item.X,item.Y);
			}
		}
		
	});

	return maximum;
 }
 
 MovingHorse(state){
	 //функция смены состояния лошади
	if(state.X == 0 && state.Y ==0){
		let previousState = Q[this.Actions[this.Actions.length-1].X][this.Actions[this.Actions.length-1].Y];
		this.score += Q[state.X][state.Y];

		Q[this.Actions[this.Actions.length-1].X][this.Actions[this.Actions.length-1].Y] = (1-this.ALPHA)*previousState 
		+ this.ALPHA * (this.score + this.GAMMA * 100 - previousState);
		
		return;
		}
	else{
		let previousState = new cord(state.X,state.Y);
		this.Actions.push(previousState);
		state = this.MaxAdvan(state);
		
		this.score += Q[state.X][state.Y];

		Q[previousState.X][previousState.Y] = Q[previousState.X][previousState.Y] 
		+ this.ALPHA * (this.score + this.GAMMA * this.MaxScoreList(this.Actions) - Q[state.X][state.Y]);
		
        this.MovingHorse(state);	
	}
 }
	
 Learn(era, row, column){
	//обучение по эрам

	for (let i=0; i<=era; i++)
		{
			let startE = new cord(row, column);
			this.Actions.length=0;
			this.score=0;
			this.MovingHorse(startE);
		}
		alert("Обучение успешно окончено!");
 }
  
 SingleMove(state){
	 //одиночный ход лошади после или до обучения
	
	 if(state.X == 0 && state.Y ==0){
	 return state;
	 }
	else {
		state = this.MaxAdvan(state);
		return state;
	 }
 }
 
}

var pictureH =""+ document.getElementById("horse").parentNode.innerHTML; //картинка лошади
var pictureG =""+ document.getElementById("goal").parentNode.innerHTML;	//картинка цели
var LH = new QlearningHorse();	//экземпляр класса обучения глобальный для двух функций : обучения и хождения

 function learnHorse() {
	//функция обучения 

	Q = [
	  [100, 0, 0, 0, 0],
	  [0, 0, 0, 0, 0],
	  [0, 0, 0, 0, 0],
	  [0, 0, 0, 0, 0],
	  [0, 0, 0, 0, 0]
	];
	
	var era = document.getElementById("eraC").value;
	var column = document.getElementById("colum").value;
	var row = document.getElementById("row").value;
	
	document.getElementById(document.getElementById("horse").parentNode.id).innerHTML = "";
	document.getElementById(""+Number(row)+"_"+Number(column)).innerHTML = pictureH;
	document.getElementById("NumberMove").innerHTML ="0";
	
	LH.Learn(Number(era),Number(row),Number(column));

 }

 function moveHorse() {
	//функция хода конем после обучения 
	//без обучения можно проверить насколько хаотично ходит фигура
	
	let count = Number(document.getElementById("NumberMove").innerHTML);
	const idH = document.getElementById("horse").parentNode;
	
	let startS = ""+idH.id;
	let arrayOfCord = startS.split('_');
	let stateH = new cord (Number(arrayOfCord[0]),Number(arrayOfCord[1]));
	stateH = LH.SingleMove(stateH);
	let endS = ""+stateH.X+"_"+stateH.Y;

	count++;
	
	document.getElementById(idH.id).innerHTML = "";
	document.getElementById("0_0").innerHTML = pictureG;
	document.getElementById(endS).innerHTML = pictureH;
	document.getElementById("NumberMove").innerHTML = ""+count;
	
 }
