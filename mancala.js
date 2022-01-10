
class Board{
    sides = {};
    turn;
    gameOver = false;
}
class MancalaLocal{
    constructor(pits, seeds, player1, player2, turn, aiLevel){
        this.aiLevel=aiLevel;
        this.pits=pits;
        this.players = [player1,player2];
        this.board= MancalaLocal.newGame(pits,seeds,player1,player2,turn);
    }
    static newGame(pits,seeds,player1,player2,turn){
        var board= new Board();
        if(! (turn==player1 || turn ==player2)) throw("Invalid turn value");
        board.sides[player1]={"store":0,"pits": new Array(pits),};
        board.sides[player2]={"store":0,"pits": new Array(pits),};
        board.turn=turn;
        for(let player in board.sides){
            for(let i=0;i<pits;++i)
                board.sides[player].pits[i]=seeds;
        }
        board.gameOver = false;
        return board;
    }
    static getOtherPlayer(board,player){
        for(let p in board.sides)
            {if(p!=player){
                return p;
            }
        }
    }
    static move(board, player, sourcePit){
        if(player != board.turn) return board;
        let seeds = board.sides[player].pits[sourcePit];
        if(seeds==0) return board;
        
        let currentPlayer=player;
        let otherPlayer=MancalaLocal.getOtherPlayer(board,player);
        let currentPit=sourcePit;
        let numPits = board['sides'][player]['pits'].length;
        
        board['sides'][player]['pits'][sourcePit]=0;
        for(;seeds>0;--seeds){
            ++currentPit;
            if(currentPit>numPits){//has overflown into other side.
                currentPit=0;
                currentPlayer=(currentPlayer==player?otherPlayer:player);
            }
            if(currentPit==numPits){//is warehouse
                if(currentPlayer==player){
                    board.sides[player].store++;
                }else{
                    seeds++;
                    continue; //skip placing on opponent store.
                }
            }else{
                board.sides[currentPlayer].pits[currentPit]++;
            }
        }
        //handle last seed
        if(currentPit==numPits){//own store.
            return MancalaLocal.isGameOver(board); //turn remains unchanged.
        }
        board.turn = otherPlayer;//change player turn.
        if(currentPlayer==player && board.sides[player].pits[currentPit]==1){//was on player side and empty
            board.sides[player].store+= board.sides[otherPlayer].pits[numPits-1-currentPit] + 1;
            board.sides[otherPlayer].pits[numPits-1-currentPit]=0; // remove from pit in front.
            board.sides[player].pits[currentPit] = 0;
        }
        return MancalaLocal.isGameOver(board); 
    }
    static isGameOver(board2){
        var board=board2;
        for(let player in board.sides){
            let playerseeds=0
            for(let i=0 ; i < board.sides[player].pits.length; ++i){
                playerseeds+=board.sides[player].pits[i];
                if(playerseeds>0) break;
            }
            if(playerseeds==0){ //player is done.
                let otherPlayer= MancalaLocal.getOtherPlayer(board,player);
                board.sides[otherPlayer].pits.forEach((seeds,index)=>{
                    board.sides[otherPlayer].store+=seeds; //fill opponent warehouse.
                    board.sides[otherPlayer].pits[index]=0;
                });
                board.gameOver=true;
                return board;
            }
        }
        board.gameOver=false;
        return board;
    }
}
