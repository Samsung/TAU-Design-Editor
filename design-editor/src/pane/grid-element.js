'use babel';

class Grid extends HTMLElement {
	/**
	 * Create callback
	 */
	constructor() {
		super();
		this.elemnent = document.createElement('canvas');
		this.options = {
			step: 50,
			color: 'rgba(255, 255, 255, 0.1)',
			defaultWidth: 720,
			defaultHeight: 1280
		};
	}

	/**
	 * Set layout
	 * @param {Object} offset
	 * @param {number} ratio
	 */
	setLayout(offset, ratio) {
		if (this.elemnent.offsetWidth < this.options.defaultWidth) { // FIX_ME : unexpected layout size is now ignored
			return;
		}
		if (this.elemnent.offsetHeight < this.options.defaultHeight) {
			return;
		}

		const width = this.elemnent.offsetWidth,
			height = this.elemnent.offsetHeight;

		this.setAttribute('width', width);
		this.setAttribute('height', height);
		this.style.width = `${width  }px`;
		this.style.height = `${height  }px`;
		this._draw(width, height, offset, ratio);
	}

    /**
     * Scroll
     * @param {number} x
     * @param {number} y
     */
    scroll(x, y) {
        this.style.transform = 'translate3d(' + -x + 'px, ' + -y + 'px, 0px)';
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
            step = options.step * ratio,
            x, y;

        ctx.clearRect(0, 0, width, height);

        function draw(sx, sy, ex, ey) {
            ctx.lineCap = 'square';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(sx + 0.5, sy + 0.5);
            ctx.lineTo(ex + 0.5, ey + 0.5);
            ctx.strokeStyle = options.color;
            ctx.stroke();
        }

        for (x = offset.left; x > 0; x -= step) {
            draw(x, 0, x, height);
        }

        for (x = offset.left + step; x < width; x += step) {
            draw(x, 0, x, height);
        }

        for (y = offset.top; y > 0; y -= step) {
            draw(0, y, width, y);
        }

        for (y = offset.top + step; y < height; y += step) {
            draw(0, y, width, y);
        }

    }
}


customElements.define('closet-design-editor-grid', Grid);

export {Grid};
