var typeR = ['ADD', 'SUB', 'SRA', 'SRL', 'SLL', 'AND', 'OR', 'HALT']
var typeI = ['NOP', 'LB', 'SB', 'ADDI', 'ANDI', 'ORI', 
			'BEQ', 'BNE', 'BGEZ', 'BLTZ']

function regToCode(reg) {
	return decbin(parseInt(reg.replace(/R/, '')), 3)
}

function memToCode(input) {
	var parts = input.split('(')
	parts[1] = parts[1].replace(/\)/, '')
	return parts
}

function decbin(dec,length){
  var out = "";
  while(length--)
    out += (dec >> length ) & 1;    
  return out;  
}

Session.setDefault('result', []);

Template.main.helpers({
	'result': function() {
		return Session.get('result');
	}
});

Template.main.events({
	'submit form': function(evt) {
		evt.preventDefault();

		var input = evt.target.assembly.value;
		var lines = input.split('\n');

		var commands = [];
		for (var i = lines.length - 1; i >= 0; i--) {
			if(lines[i] != '') 
				commands[i] = lines[i].replace(/\,/g, '').split(' ');
		};

		var result = [];

		for (var i = 0; i < commands.length; i++) {
			cmd = commands[i];
			if(_.indexOf(typeR, cmd[0]) != -1) {
				var op = '1111';
				var rs = '000';
				var rt = '000';
				var rd = '000';
				var funct = '000';
				switch(cmd[0]) {
					case 'ADD':
						rd = regToCode(cmd[1]);
						rs = regToCode(cmd[2]);
						rt = regToCode(cmd[3]);
						funct = '000';
						break;
					case 'SUB':
						rd = regToCode(cmd[1]);
						rs = regToCode(cmd[2]);
						rt = regToCode(cmd[3]);
						funct = '001';
						break;
					case 'SRA':
						rd = regToCode(cmd[1]);
						rs = regToCode(cmd[2]);
						funct = '010';
						break;
					case 'SRL':
						rd = regToCode(cmd[1]);
						rs = regToCode(cmd[2]);
						funct = '011';
						break;
					case 'SLL':
						rd = regToCode(cmd[1]);
						rs = regToCode(cmd[2]);
						funct = '100';
						break;
					case 'AND':
						rd = regToCode(cmd[1]);
						rs = regToCode(cmd[2]);
						rt = regToCode(cmd[3]);
						funct = '101';
						break;
					case 'OR':
						rd = regToCode(cmd[1]);
						rs = regToCode(cmd[2]);
						rt = regToCode(cmd[3]);
						funct = '110';
						break;
					case 'HALT':
						op = '0000';
						rs = '000';
						rt = '000';
						rd = '000';
						funct = '001';
						break;
					default:
						break;
				}
				result.push(op.toString() + rs.toString() + rt.toString() +
						rd.toString() + funct.toString() + " # " + cmd.join(' '));
			}
			else if (_.indexOf(typeI, cmd[0]) != -1)  {
				var op = '0000';
				var rs = '000';
				var rt = '000';
				var imm = '000000';
				switch(cmd[0]) {
					case 'NOP':
						op = '0000';
						rs = '000';
						rt = '000';
						imm = '000000';
						break;
					case 'LB':
						var data = memToCode(cmd[2]);
						op = '0010';
						rs = regToCode(data[1]);
						rt = regToCode(cmd[1]);
						imm = decbin(parseInt(data[0]), 6);
						break;
					case 'SB':
						var data = memToCode(cmd[2]);
						op = '0100';
						rs = regToCode(data[1]);
						rt = regToCode(cmd[1]);
						imm = decbin(parseInt(data[0]), 6);
						break;
					case 'ADDI':
						op = '0101';
						rs = regToCode(cmd[2]);
						rt = regToCode(cmd[1]);
						imm = decbin(parseInt(cmd[3]), 6);
						break;
					case 'ANDI':
						op = '0110';
						rs = regToCode(cmd[2]);
						rt = regToCode(cmd[1]);
						imm = decbin(parseInt(cmd[3]), 6);
						break;
					case 'ORI':
						op = '0111';
						rs = regToCode(cmd[2]);
						rt = regToCode(cmd[1]);
						imm = decbin(parseInt(cmd[3]), 6);
						break;
					case 'BEQ':
						op = '1000';
						rt = regToCode(cmd[2]);
						rs = regToCode(cmd[1]);
						imm = decbin(parseInt(cmd[3]), 6);
						break;
					case 'BNE':
						op = '1001';
						rt = regToCode(cmd[2]);
						rs = regToCode(cmd[1]);
						imm = decbin(parseInt(cmd[3]), 6);
						break;
					case 'BGEZ':
						op = '1010';
						rs = regToCode(cmd[1]);
						rt = '000';
						imm = decbin(parseInt(cmd[2]), 6);
						break;
					case 'BLTZ':
						op = '1011';
						rs = regToCode(cmd[1]);
						rt = '000';
						imm = decbin(parseInt(cmd[2]), 6);
						break;
					default:
						break;
				}
				result.push(op.toString() + rs.toString() + rt.toString() + 
						imm.toString() + " # " + cmd.join(' '));
			}
			else {
				result.push("BAD OP");
			}
		};
		Session.set('result', result);
	}
});