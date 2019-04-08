'use babel';

class Ruler extends HTMLCanvasElement {
    /**
     * Create callback
     */
    createdCallback() {
        this.options = {
            orientation: 'horizontal',
            step: 20,
            stepForShowNumber: 5,
            color: 'rgba(157, 165, 180, 0.6)',
            fontColor: 'rgba(157, 165, 180, 0.6)',
            defaultSize: 15
        };

        this.isHorizontal = true;
        this.setOrientation(this.options.orientation);
    }

    /**
     * Set orientation
     * @param {string} orientation
     */
    setOrientation(orientation) {
        var prefix = 'orientation-';
        ['horizontal', 'vertical'].forEach((type) => {
            if (type === orientation.toLowerCase()) {
                this.classList.add(prefix + type);
                this.options.orientaion = type;
                this.isHorizontal = (type == 'horizontal');
            } else {
                this.classList.remove(prefix + type);
            }
        });
    }

    /**
     * Set layout
     * @param {Object} offset
     * @param {number} ratio
     */
    setLayout(offset, ratio) {
        var width,
            height;

        if (this.isHorizontal) {
            if (this.offsetHeight > this.options.defaultSize) { // FIX_ME : unexpected layout size is now ignored
                return;
            }
        } else { // vertical
           if (this.offsetWidth > this.options.defaultSize) {
                return;
           }
        }

        if (this.getAttribute('width')) {
            width = this.getAttribute('width');
        } else {
            width = this.offsetWidth;
            this.setAttribute('width', width);
        }

        if (this.getAttribute('height')) {
            height = this.getAttribute('height');
        } else {
            height = this.offsetHeight;
            this.setAttribute('height', height);
        }

        this.style.width = width + 'px';
        this.style.height = height + 'px';
        this._draw(width, height, offset, ratio);
    }

    /**
     * Scroll
     * @param {number} x
     * @param {number} y
     */
    scroll(x, y) {
        var isHorizontal = this.isHorizontal;
        this.style.transform = 'translate3d(' + (isHorizontal ? -x : 0) + 'px, ' + (isHorizontal ? 0 : -y) + 'px, 0px)';
    }

    /**
     * Draw
     * @param {number} width
     * @param {number} height
     * @param {Object} offset
     * @param {number} ratio
     * @private
     */
    _draw(width, height, offset, ratio) {
        var ctx = this.getContext('2d'),
            options = this.options,
            isHorizontal = this.isHorizontal,
            step = options.step,
            stepForShowNum = options.stepForShowNumber,
            start = offset[isHorizontal ? 'left' : 'top'],
            end = isHorizontal ? width : height,
            barHeight = isHorizontal ? height : width,
            lineColor = options.color,
            fontColor = options.fontColor,
            fontSize = parseInt(barHeight * 0.6, 10),
            fontMarginLeft = 5,
            fontMarginBottom = 2,
            maxLineRate = 0.7,
            minLineRate = 0.2,
            lineHeight = 0,
            pos,
            i, s, e;

        ctx.clearRect(0, 0, width, height);
        ctx.font = fontSize + 'px Arial';
        ctx.fillStyle = fontColor;

        function drawLine(sx, sy, ex, ey) {
            ctx.lineCap = 'square';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(sx + 0.5, sy + 0.5);
            ctx.lineTo(ex + 0.5, ey + 0.5);
            ctx.strokeStyle = lineColor;
            ctx.stroke();
        }

        function drawText(text, x, y) {
            ctx.fillText(text, x, y);
        }

        s = (start / (step * ratio)) + 1;
        s += stepForShowNum - (s % stepForShowNum);
        e = ((end - start) / (step * ratio)) + 1;

        for (i = -s; i <= e; i += 1) {
            lineHeight = i % stepForShowNum === 0 ? barHeight * maxLineRate : barHeight * minLineRate;
            pos = start + ((i * step) * ratio);

            if (isHorizontal) {
                drawLine(pos, 0, pos, lineHeight);
                if (pos > 0 && i % stepForShowNum === 0) {
                    drawText(i * step, pos + fontMarginLeft, barHeight - fontMarginBottom);
                }
            } else {
                drawLine(0, pos, lineHeight, pos);
                if (pos > 0 && i % stepForShowNum === 0) {
                    ctx.save();
                    ctx.rotate(Math.PI / 2);
                    drawText(i * step, pos + fontMarginLeft, -(barHeight - fontSize));
                    ctx.restore();
                }
            }
        }
    }
}

const RulerElement = document.registerElement('closet-design-editor-ruler', {
    prototype: Ruler.prototype,
    extends: 'canvas'
});

export {Ruler, RulerElement};
