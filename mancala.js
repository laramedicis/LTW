
class Board{
    sides = {};
    turn;
    gameOver = false;
    clone(){
        var dest= new Board();
        dest.turn=this.turn;
        dest.gameOver=this.gameOver;
        dest.sides={};
        for(let player in this.sides){
            dest.sides[player]={
                "store": this.sides[player].store,
                "pits": new Array(this.sides[player].pits.length),
            };
            for(let i=0;i<this.sides[player].pits.length;++i){
                dest.sides[player].pits[i]=this.sides[player].pits[i];
            }
        }
        return dest;
    }

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
    static move(board2, player, sourcePit){
        var board=board2.clone();
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
        var board = board2.clone();
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
    static aiMove(board2, aiLevel){
        var board=board2.clone();
        const aiPlayer= board.turn;
        const otherPlayer = MancalaLocal.getOtherPlayer(board,aiPlayer);
        let boardValue = (b)=>{
            return b.sides[b.turn].store - b.sides[MancalaLocal.getOtherPlayer(b,b.turn)].store;
        };
        let miniMax = (board,depth)=>{
            if(depth==-1 || board.gameOver){
                return [-1,boardValue(board) * (board.turn==aiPlayer? 1:-1)];
            }
            let i=0;
            let best = [];
            for(;i<board.sides[board.turn].pits.length;++i){
                if(board.sides[board.turn].pits[i]==0)
                    continue;
                let nextBoard=MancalaLocal.move(board,board.turn,i);
                if(nextBoard.turn==aiPlayer){
                    best = [i,miniMax(nextBoard,depth)[1]];
                }else{
                    best = [i,-miniMax(nextBoard,depth-1)[1]];
                }
                ++i; break;
            }
            for(;i<board.sides[board.turn].pits.length;++i){
                if(board.sides[board.turn].pits[i]==0)
                    continue;
                let nextBoard=MancalaLocal.move(board,board.turn,i);
                let child=[];
                if(nextBoard.turn==aiPlayer){
                    child = [i,miniMax(nextBoard,depth)[1]];
                }else{
                    child = [i,-miniMax(nextBoard,depth-1)[1]];
                }
                if(child[1]>best[1])
                    best = child;
            }
            return best;
        }
        var choice = miniMax(board,aiLevel);
        console.log(choice);
        return MancalaLocal.move(board,aiPlayer,choice[0]);
    }
}
