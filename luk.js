var luk;

function extend(target, source) {
    var key;

    for (key in source) {
        target[key] = source[key];
    }
}

luk = {
    'Knob': function (element, options) {
        var self = this,
            defaults,
            classes,
            innerElement,
            tickElement,
            downX,
            downY,
            downValue;
        
        defaults = {
            'value': 0,
            'minimumValue': 0,
            'maximumValue': 100,
            'minimumDegree': -180,
            'maximumDegree': 90,
            'sensitivity': 2
        }

        extend(self, defaults);

        if (options) {
            extend(self, options);
        }

        if (element) {
            self.element = element;
        }
        else {
            self.element = document.createElement('div');
        }

        classes = self.element.className;
        self.element.className = classes + ' knob';

        innerElement = document.createElement('div');
        innerElement.className = 'inner';

        tickElement = document.createElement('div');
        tickElement.className = 'tick';

        self.element.appendChild(innerElement);
        innerElement.appendChild(tickElement);

        function position() {
            var valueRange = self.maximumValue - self.minimumValue,
                degreeRange = self.maximumDegree - self.minimumDegree,
                tickSize = degreeRange / valueRange,
                rotation = self.minimumDegree + (tickSize * self.value);

            innerElement.style.webkitTransform = 'rotate(' + rotation + 'deg)';
        }

        function mouseMove(event) {
            var x = event.pageX,
                y = event.pageY,
                distance = ((x - downX) + (downY - y)) / 2;

            self.value = Math.round(downValue + (distance * self.sensitivity));

            if (self.value < self.minimumValue) {
                self.value = self.minimumValue;
            }
            if (self.value > self.maximumValue) {
                self.value = self.maximumValue;
            }

            if (self.onchange) {
                self.onchange(self.value);
            }

            position();
        }

        function mouseUp() {
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
        }

        function mouseDown(event) {
            event.preventDefault();
            downX = event.pageX;
            downY = event.pageY;
            downValue = self.value;

            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('mouseup', mouseUp);
        }

        self.element.addEventListener('mousedown', mouseDown);

        position();
    }
};
