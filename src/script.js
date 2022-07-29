function Counter(selector, settings) {
	this.settings = Object.assign(
		{
			digits: 5,
			delay: 250,
			direction: "ltr"
		},
		settings || {}
	);

	this.DOM = {};
	this.build(selector);

	this.DOM.scope.addEventListener("transitionend", (e) => {
		if (e.pseudoElement === "::before" && e.propertyName == "margin-top") {
			e.target.classList.remove("blur");
		}
	});

	this.count();
}

Counter.prototype = {
	build(selector) {
		var scopeElm =
			typeof selector == "string"
				? document.querySelector(selector)
				: selector
				? selector
				: this.DOM.scope;

		scopeElm.innerHTML = Array(this.settings.digits + 1).join(
			'<div><b data-value="0"></b></div>'
		);

		this.DOM = {
			scope: scopeElm,
			digits: scopeElm.querySelectorAll("b")
		};
	},

	count(newVal) {
		var countTo,
			className,
			settings = this.settings,
			digitsElms = this.DOM.digits;
		this.value = newVal || this.DOM.scope.dataset.value | 0;

		if (!this.value) return;

		countTo = (this.value + "").split("");

		if (settings.direction == "rtl") {
			countTo = countTo.reverse();
			digitsElms = [].slice.call(digitsElms).reverse();
		}

		digitsElms.forEach(function (item, i) {
			if (+item.dataset.value != countTo[i] && countTo[i] >= 0)
				setTimeout(
					function (j) {
						var diff = Math.abs(countTo[j] - +item.dataset.value);
						item.dataset.value = countTo[j];
						if (diff > 3) item.className = "blur";
					},
					i * settings.delay,
					i
				);
		});
	}
};

var counter = new Counter(".numCounter", {
	direction: "rtl",
	delay: 200,
	digits: 7
});

var counterInterval = setInterval(randomCount, 3000);

function randomCount() {
	counter.count(+("" + Math.random()).substring(2, 2 + counter.settings.digits));
}

function getRandomNum(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
