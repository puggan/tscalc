document.addEventListener("DOMContentLoaded", () =>
{
	const display = document.getElementById("display");
	const memory = document.getElementById("memory");
	const history = document.getElementById("history");

	let memoryValue: number = 0;
	let displayValue: number = 0;
	let previousDisplayValue: number = 0;
	let operator: string = null;
	let decimalMode: boolean = false;
	let decimalCount: number = 0;

	//<editor-fold desc="Display">
	function updateDisplay()
	{
		let displayText = "";
		if(operator)
		{
			displayText = previousDisplayValue + ' ' + operator + ' ';
		}
		if(!decimalMode)
		{
			if(displayValue || !operator)
			{
				displayText += Math.floor(displayValue);
			}
		}
		else if(decimalCount > 0)
		{
			displayText += displayValue.toFixed(decimalCount);
		}
		else if(decimalCount < 0)
		{
			displayText += displayValue;
		}
		else
		{
			displayText += Math.floor(displayValue) + ".";
		}
		display.innerText = displayText;
		//console.log([displayText, previousDisplayValue, operator, displayValue, decimalMode, decimalCount]);
		return displayText;
	}

	function setDisplay(newValue: number, integer: boolean)
	{
		displayValue = newValue;
		if(integer)
		{
			decimalMode = false;
			decimalCount = 0;
			return updateDisplay();
		}

		let valueAsInt = Math.floor(displayValue);
		if(displayValue == valueAsInt)
		{
			decimalMode = false;
			decimalCount = 0;
			return updateDisplay();
		}

		decimalMode = true;
		decimalCount = 1;
		let valueAsFloat = displayValue * 10;
		valueAsInt = Math.floor(valueAsFloat);
		while(valueAsFloat != valueAsInt)
		{
			decimalCount++;
			if(decimalCount > 5)
			{
				decimalCount = -1;
				return updateDisplay();
			}
			valueAsFloat *= 10;
			valueAsInt = Math.floor(valueAsFloat);
		}

		return updateDisplay();
	}

	function addDisplay(newValue: number)
	{
		if(!decimalMode)
		{
			return setDisplay(displayValue * 10 + newValue, true);
		}
		if(decimalCount < 0)
		{
			return setDisplay(newValue, true);
		}
		displayValue += newValue * +("1e-" + ++decimalCount);
		return updateDisplay();
	}

	function setDecimalMode()
	{
		decimalMode = true;
		return updateDisplay();
	}

	function clearAll()
	{
		operator = null;
		return setDisplay(0, true);
	}

	function clearCurrent()
	{
		if(displayValue)
		{
			return setDisplay(0, true);
		}
		operator = null;
		return setDisplay(previousDisplayValue, false);
	}

	function clearOne()
	{
		if(decimalMode)
		{
			if(decimalCount <= 0)
			{
				decimalMode = false;
				return updateDisplay();
			}
			const decimalOffset = +("1e" + decimalCount);
			let valueAsInt = displayValue * decimalOffset;
			valueAsInt -= valueAsInt % 10;
			displayValue = valueAsInt / decimalOffset;
			decimalCount--;
			return updateDisplay();
		}
		if(displayValue)
		{
			return setDisplay((displayValue - displayValue % 10) / 10, true);
		}
		return clearCurrent();
	}
	//</editor-fold>

	//<editor-fold desc="Memory">
	function setMemory(newValue: number)
	{
		memoryValue = newValue;
		memory.innerText = "" + memoryValue;
		return memoryValue;
	}

	function addMemory(incrementValue: number)
	{
		return setMemory(memoryValue + incrementValue);
	}

	function readMemory()
	{
		return setDisplay(memoryValue, false);
	}

	//</editor-fold>

	function addHistory(history_text: string)
	{
		const li = document.createElement('li');
		li.innerText = history_text;
		history.append(li);
	}

	function calculate()
	{
		let history_text = updateDisplay();
		switch(operator)
		{
			case "+":
				displayValue += previousDisplayValue;
				break;
			case "-":
				displayValue = previousDisplayValue - displayValue;
				break;
			case "×":
				displayValue *= previousDisplayValue;
				break;
			case "÷":
				displayValue = previousDisplayValue / displayValue;
				break;

			case "√":
				history_text = "√" + previousDisplayValue;
				displayValue = Math.sqrt(previousDisplayValue);
				break;
			case "x²":
				history_text = previousDisplayValue + '²';
				displayValue = previousDisplayValue * previousDisplayValue;
				break;
			case "1/x":
				history_text = "1 / " + previousDisplayValue;
				displayValue = 1 / previousDisplayValue;
				break;
			case "±":
				history_text = "-(" + previousDisplayValue + ')';
				displayValue = -previousDisplayValue;
				break;
			default:
				return;
		}
		operator = null;
		decimalMode = false;
		decimalCount = 0;
		history_text += ' = ' + displayValue;
		addHistory(history_text);
		setDisplay(displayValue, false);
	}

	//<editor-fold desc="Operators">
	function setOperator(newOperator: string)
	{
		if(operator)
		{
			calculate();
		}
		previousDisplayValue = displayValue;
		operator = newOperator;
		return setDisplay(0, true);
	}

	function useOperator(newOperator: string)
	{
		setOperator(newOperator);
		calculate();
	}

	//</editor-fold>

	function init()
	{
		setMemory(0);
		readMemory();

		const buttons = document.getElementById("buttons-box").children;
		//for(const button of buttons)
		for(let button_index = 0; button_index < buttons.length; button_index++)
		{
			const button = buttons[button_index] as HTMLInputElement;
			switch(button.value)
			{
				//<editor-fold desc="Operators">
				case "=":
					button.addEventListener("click", calculate);
					break;

				case "+":
				case "-":
				case "×":
				case "÷":
					button.addEventListener("click", () => setOperator(button.value));
					break;

				case "√":
				case "x²":
				case "1/x":
				case "±":
					button.addEventListener("click", () => useOperator(button.value));
					break;
				//</editor-fold>

				//<editor-fold desc="Memory">
				case "MR":
					button.addEventListener("click", readMemory);
					break;
				case "M+":
					button.addEventListener("click", () => addMemory(displayValue));
					break;
				case "M-":
					button.addEventListener("click", () => addMemory(-displayValue));
					break;
				case "MS":
					button.addEventListener("click", () => setMemory(displayValue));
					break;
				case "MC":
					button.addEventListener("click", () => setMemory(0));
					break;
				//</editor-fold>

				//<editor-fold desc="Clear">
				case "AC":
					button.addEventListener("click", clearAll);
					break;
				case "C":
					button.addEventListener("click", clearCurrent);
					break;
				case "←":
					button.addEventListener("click", clearOne);
					break;
				//</editor-fold>

				//<editor-fold desc="Numbers">
				case ",":
					button.addEventListener("click", setDecimalMode);
					break;

				default:
					const buttonValue = +button.value;
					if(isNaN(buttonValue))
					{
						button.addEventListener("click", () => console.error("Button " + button.value + " have no connected function"));
						console.error("Button " + button.value + " have no connected function");
						break;
					}
					button.addEventListener("click", () => addDisplay(buttonValue));
					break;
				//</editor-fold>
			}
		}
	}

	init();
});
