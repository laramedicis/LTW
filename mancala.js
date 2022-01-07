class Board{
    constructor(numberOfCavities,startingSeeds){
        this.warehouse = {'a':0, 'b':0};
        this.length = numberOfCavities;
        this.cavity = {'a':new Array(numberOfCavities), 'b':new Array(numberOfCavities)};
        this.cavity['a'].forEach(element=>{element=startingSeeds;});
        this.cavity['b'].forEach(element=>{element=startingSeeds;});
    }
    move(player, currentCavity){
        seeds=this.cavity[player][currentCavity];
        if(seeds>0){
            currentPlayer=player; 
            this.cavity[player][currentCavity]=0;
            
            for(;seeds>0;--seeds){
                ++currentCavity;
                if(currentCavity>this.length){//has overflown into other players cavities.
                    currentCavity=0;
                    currentPlayer=(currentPlayer=='a'?'b':'a');
                }
                if(currentCavity==this.length){//if is warehouse
                    if(currentPlayer==player){
                        this.warehouse[currentPlayer]++;
                    }else{
                        seeds++;//skip placing on opponent warehouse.
                    }
                }else{
                    this.cavity[currentPlayer][currentCavity]++;
                }
            }
            //handle last seed
            if(currentCavity==this.length){//own warehouse.
                return player;
            }
            if(currentPlayer==player && this.cavity[player][currentCavity]==1){//was on player side and empty
                this.warehouse[player] += this.cavity[player=='a'?'b':'a'][this.length-1-currentCavity] +1;
                this.cavity[player=='a'?'b':'a'][this.length-1-currentCavity] =0;
                this.cavity[player][currentCavity]=0;
            }
            return (player=='a'?'b':'a'); //change player turn.
        }
        return player;
    }
    gameOver(){ ///TODO: read if 1 player finished and update board.
        this.cavity.forEach(player => {
            this.cavity[player].forEach(element=>{if(element>0)return false;});
        });
        return true;
    }
}
class Game{
    constructor(startingPlayer,aiLevel,cavities,seeds){
        this.turn='a';
        this.aiLevel=0;
        this.cavities=5;
        this.seeds=5;
        this.board = new Board(this.cavities,this.seeds);
    }
    turn(cavity,playerSide){
        if(cavity<this.cavities && cavity>=0 && playerSide == this.turn){
            this.turn = this.board.move(playerSide,cavity);
        }
        return this.board.gameOver();
    }
    makeMove(playerSide,cavity){
        if(this.turn == playerSide)
            this.turn = this.board.move(playerSide,cavity);
    }
}