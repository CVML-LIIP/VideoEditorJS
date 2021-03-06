var c = document.getElementById('canvas');
var ctx = c.getContext("2d");

ctx.width = 500;
ctx.height = 100;

ctx.fillStyle = '#EFEFEF';
ctx.fillRect(0, 0, ctx.width, ctx.height);

var imageThumbnail = new Image();

imageThumbnail.onload = function() {
    console.log('loaded thumbnail');
};

imageThumbnail.src = 'http://clangue.net/other/testVideo/canvastry/img/thumbnail.png';

var imageClose = new Image();

imageClose.onload = function() {
    console.log('loaded close');
};

imageClose.src = 'http://clangue.net/other/testVideo/canvastry/img/close.png';

var mousedown = false;
var gap = 0;

var scroll = 0;

var tabElement = [];
var currentRow = 0;

var MODE = {
    NONE: 0,
    MOVE: 1,
    RESIZE: {
        LEFT: 2,
        RIGHT: 3
    },
    REMOVE: 4
};

var currentMode = MODE.NONE;

c.onmousedown = function(e) {
    console.log('mousedown');

    mousedown = true;
    gap = (currentRow != 'none') ? (tabElement[currentRow].marginLeft + tabElement[currentRow].width - ((e.offsetX == undefined)?e.layerX:e.offsetX)) : 0;
};

c.onmouseup = function(e) {
    mousedown = false;

    for(var i = 0; i < tabElement.length; i++)
    {
        if(tabElement[currentRow].marginLeft > tabElement[i].marginLeft && tabElement[currentRow].marginLeft < (tabElement[i].marginLeft + tabElement[i].width))
        {
            console.log('collision before');

            tabElement[i].width = tabElement[currentRow].marginLeft - tabElement[i].marginLeft;
        }

        if((tabElement[currentRow].marginLeft + tabElement[currentRow].width) > tabElement[i].marginLeft && (tabElement[currentRow].marginLeft + tabElement[currentRow].width) < (tabElement[i].marginLeft + tabElement[i].width))
        {
            console.log('collision after');

            tabElement[i].width = (tabElement[i].marginLeft + tabElement[i].width) - (tabElement[currentRow].marginLeft + tabElement[currentRow].width);
            tabElement[i].marginLeft = (tabElement[i].marginLeft + tabElement[i].width) - ((tabElement[i].marginLeft + tabElement[i].width) - (tabElement[currentRow].marginLeft + tabElement[currentRow].width));
        }
    }

    drawElements();
};

c.onmousemove = function(e) {
    var x = e.offsetX==undefined?e.layerX:e.offsetX;

    if(mousedown)
    {
        if(currentMode == MODE.MOVE)
        {
            //console.log(gap, x, (x - gap));

            tabElement[currentRow].marginLeft = x - gap;
        }
        else if(currentMode == MODE.RESIZE.LEFT)
        {
            console.log('resize left');
        }
        else if(currentMode == MODE.RESIZE.RIGHT)
        {
            //console.log('resize right');
            //console.log(x-gap);

            if((x - gap) > 0)
            {
                if(tabElement[currentRow].width < tabElement[currentRow].maxWidth)
                {
                    //console.log('good');

                    tabElement[currentRow].width++;
                    gap = x;
                }
            }
            else
            {
                if(tabElement[currentRow].width > tabElement[currentRow].minWidth)
                {
                    //console.log('good');

                    tabElement[currentRow].width--;
                    gap = x;
                }
            }
        }
    }
    else
    {
        rowTabElement(x);

        if(currentRow != 'none')
        {
            if(x >= (tabElement[currentRow].marginLeft - 2) && x <= (tabElement[currentRow].marginLeft + 2))
            {
                currentMode = MODE.RESIZE.LEFT;
                c.style.cursor = 'w-resize';
            }
            else if(x >= (tabElement[currentRow].marginLeft + tabElement[currentRow].width - 2) && x <= (tabElement[currentRow].marginLeft + tabElement[currentRow].width + 2))
            {
                currentMode = MODE.RESIZE.RIGHT;
                c.style.cursor = 'w-resize';
            }
            else
            {
                currentMode = MODE.MOVE;
                c.style.cursor = 'all-scroll';
            }
        }
        else
        {
            if(!mousedown)
            {
                currentMode = MODE.NONE;
                c.style.cursor = 'default';
            }
        }
    }

    drawElements();
};

/*
 document.getElementById('divCanvas').onscroll = function() {
 console.log(this.scrollLeft);

 c.style.width = (ctx.width + 5) + 'px';
 c.style.height = '100px';

 ctx.width = ctx.width + 2;
 ctx.height = 100;
 };
 */

function plusScroll() {
    scroll += 2;
    drawElements();
}

function lessScroll() {
    if(scroll >= 2)
    {
        scroll -= 2;
        drawElements();
    }
}

function rowTabElement(x) {
    currentRow = 'none';

    for(var i = 0; i < tabElement.length; i++)
    {
        if(tabElement[i].marginLeft <= x && (tabElement[i].marginLeft + tabElement[i].width) >= x)
        {
            console.log('row : ', i);

            currentRow = i;

            tabElement[i].selected = true;
        }
        else
        {
            tabElement[i].selected = false;
        }
    }
}

function addElement() {
    var width = 100;
    var marginLeft = 0;

    for(var i = 0; i < tabElement.length; i++)
    {
        marginLeft += tabElement[i].width;
        tabElement[i].selected = false;
    }

    tabElement.push(new Element(tabElement.length, width, marginLeft));

    drawElements();
}

function drawElements() {
    ctx.fillStyle = '#EFEFEF';
    ctx.fillRect(0, 0, ctx.width, ctx.height);

    var rowSelected = 'none';

    for(var i = 0; i < tabElement.length; i++)
    {
        if(tabElement[i].selected)
        {
            rowSelected = i;
        }
        else
        {
            element(i);
        }
    }

    if(rowSelected != 'none')
    {
        element(rowSelected);
    }
}

function element(row) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = (tabElement[row].selected) ? 'blue' : 'gray';
    ctx.rect(tabElement[row].marginLeft - scroll, 0, tabElement[row].width, 100);
    ctx.stroke();

    ctx.fillStyle = '#F4F4F4';
    ctx.fillRect(tabElement[row].marginLeft - scroll, 0, tabElement[row].width, 100);

    ctx.font = '15px Calibri';
    ctx.fillStyle = '#000000';
    ctx.fillText('Test', (tabElement[row].marginLeft + 10) - scroll, 15);

    ctx.drawImage(imageClose, (tabElement[row].marginLeft + tabElement[row].width - 20) - scroll, 5, 15, 15);

    var showWidth = (tabElement[row].width < 100) ? (imageThumbnail.width - (((80 - (tabElement[row].width - 20)) / 80) * imageThumbnail.width)) : imageThumbnail.width;

    //console.log(showWidth, (80 - (tabElement[row].width - 20)), (((80 - (tabElement[row].width - 20)) / 80) * imageThumbnail.width), imageThumbnail.width);

    ctx.drawImage(imageThumbnail, 0, 0, showWidth, imageThumbnail.height, (tabElement[row].marginLeft + 10) - scroll, 35, (tabElement[row].width < 100) ? (80 - (80 - (tabElement[row].width - 20))) : 80, 80 * (imageThumbnail.height / imageThumbnail.width));
}