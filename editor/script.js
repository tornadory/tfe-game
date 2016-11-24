var editor = document.getElementById('editor');

var selected_item=null;
var selected_hexagone=null;

for(var line=0; line<30; line++)
{
    var l = document.createElement('div');
    l.className='line '+(line%2 ? 'line-impair' : '');

    for(var row=0; row<30; row++)
    {
        var real_row = line%2===0 ? row*2  : row*2+1;
        var real_line = Math.floor(line/2);

        var h = document.createElement('div');
        h.className='hexagone '+(line==0 && row==0 ? 'start_cell' : 'disabled');
        h.setAttribute('line',real_line);
        h.setAttribute('row',real_row);
        h.addEventListener('click',toggle.bind(this,h, real_line, real_row), false);
        l.appendChild(h);
    }
    editor.appendChild(l);

}


var mode='edit_map';

document.getElementById('edit_map').addEventListener('click',function() { mode='edit_map'; }, false);
document.getElementById('mark_end').addEventListener('click',function() { mode='mark_end'; }, false);
document.getElementById('add_ennemy').addEventListener('click',function() { mode='add_ennemy'; }, false);
document.getElementById('save').addEventListener('click',save, false);
document.getElementById('load').addEventListener('click',load, false);
document.getElementById('rotate').addEventListener('click',rotate, false);
document.getElementById('remove').addEventListener('click',remove, false);

function reset()
{
    var nodes = [...document.querySelectorAll('.hexagone:not(.disabled)')];
    nodes.forEach(function(node)
    {
        if(node.getAttribute('row')!==0 || node.getAttribute('line')!==0)
        {
            node.classList.add('disabled');
            node.classList.remove('end_cell');
        }
    });

}
function load(txt)
{
    if(txt || (txt=  prompt('Level string: ')))
    {
        try
        {
            reset();
            // Fix javascript parse format
            txt = txt.replace(/([^{}:",]+):/g,'"$1":')
            var data= JSON.parse(txt);

            if(data && data.outside_cells && data.end_cell)
            {
                data.outside_cells.forEach(function(cell)
                {
                    var node = document.querySelector('.hexagone[row="'+cell.x+'"][line="'+cell.z+'"]');
                    node.classList.remove('disabled');
                });
                node = document.querySelector('.hexagone[row="'+data.end_cell.x+'"][line="'+data.end_cell.z+'"]');
                node.classList.add('end_cell');
            }
        }
        catch(err)
        {
            alert('Error parseing the level data : '+txt);
        }
    }
}

function save()
{
    var map =
    {
        outside_cells:
        [
        ],
        extracells:
        [
        ],
        end_cell:  null
    };
    var nodes = [...document.querySelectorAll('.hexagone:not(.disabled)')];
    nodes.forEach(function(node)
    {
        map.outside_cells.push({ x: node.getAttribute('row'), z: node.getAttribute('line') });
    });
    var node = document.querySelector('.end_cell');
    map.end_cell = { x: node.getAttribute('row'), z: node.getAttribute('line') };
    window.open('data:text/plain,'+JSON.stringify(map).replace(/"/g,''));

};

function toggle(h, line, row, e)
{
    if(mode=='edit_map')
    {
        if(h.classList.contains('disabled'))
        {
            h.classList.remove('disabled');
        }
        else
        {
            h.classList.add('disabled');
        }
    }
    else
    {
        if(h.classList.contains('disabled'))
        {
            return;
        }

        if(mode=='mark_end')
        {
            var nodes = [...document.querySelectorAll('.hexagone')];
            nodes.forEach(function(node)
            {
                node.classList.remove('end_cell');
            });
            h.classList.add('end_cell');
        }
        else if(mode=='add_ennemy')
        {
            var div = document.createElement('div');
            div.className='ennemy';
            div.innerText='Ennemy';
            h.appendChild(div);

            var editorLeft =  editor.offsetLeft;
            var editorTop =  editor.offsetTop;
            
            var left = (e.pageX - h.offsetLeft - editorLeft ) / h.offsetWidth;
            var top = (e.pageY - h.offsetTop - editorTop ) / h.offsetHeight;
            div.setAttribute('rotate','0');
            div.style.left=(left*100)+'%';
            div.style.top=(top*100)+'%';

            div.addEventListener('click', selectItem.bind(this, div, h), true);
            div.click();
            e.stopPropagation();
        }
    }
}
function selectItem(div, hexagone, e)
{
    if(selected_item)
    {
        selected_item.classList.remove('selected');
    }
    selected_item=div;
    selected_item.classList.add('selected');

    selected_hexagone = hexagone;

    var nodes = [...document.querySelectorAll('.selected_item_action')];
    nodes.forEach(function(node)
    {
        node.removeAttribute('disabled');
    });

    e.stopPropagation();
}

function rotate(e)
{
    var rotation = parseInt(selected_item.getAttribute('rotate'),10);
    rotation+=10;

    selected_item.style.transform='rotate('+rotation+'deg)';
    selected_item.setAttribute('rotate',rotation);
    console.log('rotate ennemy',e);
    e.stopPropagation();
}

function remove(e)
{
    selected_item.parentElement.removeChild(selected_item);
    selected_item=null;
    selected_hexagone=null;

    var nodes = [...document.querySelectorAll('.selected_item_action')];
    nodes.forEach(function(node)
    {
        node.setAttribute('disabled','');
    });

    e.stopPropagation();
}

var re = /load=(.*)/;
if(result = location.href.match(re))
{
    console.log('result ',result);
    load(result[1]);
}
