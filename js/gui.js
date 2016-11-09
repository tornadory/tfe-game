Game.prototype.gui =
{
    weapons: [],

    bind: function()
    {
        var self=this;

        this.bone_attachments_container = document.querySelector('.bones_attachments');
        this.bone_attachments = Array.prototype.slice.call(document.querySelectorAll('.bone_attachment'));
        this.gui_container = document.querySelector('.gui');
        this.loader_container = document.querySelector('.loader');
        this.loader_text = document.querySelector('.loader-text');
        this.loader_progress_container = document.querySelector('.loader-progress span');

    },

    toggle_weapon : function(bone, e)
    {
        if(!bone)
        {
            console.log('no weapon selected!');
            return false;
        }
        var self=this;
        this.bone_attachments.forEach(function(subbone)
        {
            if(subbone!==bone)
            {
                subbone.classList.remove('selected');
            }
        });
        game.focus_perso.hand_equip(bone.getAttribute('data-type'));
        bone.classList.add('selected');
        if(e)
        {
            e.stopPropagation();
        }
        return false;
    },
    update_loading: function(current, total)
    {
        this.bind();
        var x = (current/total*100).toFixed(2);
        this.loader_progress_container.style.width = (x)+'%';
        this.loader_text.innerHTML=(x)+'%';
    },

    init: function()
    {
        var self=this;
        this.bind();
        
        this.gui_container.classList.remove('hidden');
        this.loader_container.classList.add('hidden');

        // Keys handle
        document.addEventListener( 'keydown', this.keydown.bind(this));
        document.addEventListener( 'keyup', this.keyup.bind(this));

        this.add_weapon('punch');
    },

    keyup: function(e)
    {
        switch(e.key)
        {
            case 'Shift' : game.focus_perso.run(); break;
        }
    },
    keydown: function(e)
    {
        switch(e.key)
        {
            case 'Shift' : game.focus_perso.walk(); break;
            case '1' :  this.toggle_weapon(this.bone_attachments[0],e); break;
            case '2' :  this.toggle_weapon(this.bone_attachments[1],e); break;
            case '3' :  this.toggle_weapon(this.bone_attachments[2],e); break;
            case '4' :  this.toggle_weapon(this.bone_attachments[3],e); break;
            case '5' :  this.toggle_weapon(this.bone_attachments[4],e); break;
            case '6' :  this.toggle_weapon(this.bone_attachments[5],e); break;
            case '7' :  this.toggle_weapon(this.bone_attachments[6],e); break;
            case '8' :  this.toggle_weapon(this.bone_attachments[7],e); break;
            case '9' :  this.toggle_weapon(this.bone_attachments[8],e); break;
        }
    },

    add_weapon: function(type)
    {
        if(this.weapons.indexOf(type)!==-1)
        {
            return;
        }
        this.weapons.push(type);
        var div = document.createElement('div');
        div.setAttribute('class', 'bone_attachment '+type);
        div.setAttribute('data-type', type);

        var div_hover = document.createElement('div');
        div_hover.setAttribute('class', 'bone_attachment-hover');
        div_hover.innerHTML = 'Select <span>['+(this.bone_attachments.length+1)+']';

        div.addEventListener('mousedown', this.toggle_weapon.bind(this,div));


        this.bone_attachments_container.appendChild(div);
        this.bind();
        this.toggle_weapon(div);
    },

};
