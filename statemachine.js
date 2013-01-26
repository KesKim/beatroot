var StateMachine = function(states) {
    this.states = states;
    this.reset();
}

StateMachine.prototype.reset = function() {
    this.stateIndex = -1;
    this.advance();
}

StateMachine.prototype.advance = function() {
    this.stateIndex++;
    this.timer = 0;
    this.state = this.states[this.stateIndex];
};

StateMachine.prototype.update = function(timeDelta) {
    this.timer += timeDelta;
};