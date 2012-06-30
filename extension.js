
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Util = imports.misc.util;

let msg, button;
var pulse_on;

function _hideHello() {
    Main.uiGroup.remove_actor(text);
    msg = null;
}

function _showHello() {
    if (!msg) {
        msg = new St.Label({ style_class: 'msg-label', text: 'bla' });
        Main.uiGroup.add_actor(msg);
    }

    if (pulse_on == true) {
        Util.spawn(['sh', '-c', "echo suspend true | pacmd"]);
        pulse_on = false;
        msg.text = "pulse is OFF";
    } else {
        Util.spawn(['sh', '-c', "echo suspend false | pacmd"]);
        pulse_on = true;
        msg.text = "pulse is ON";
    }

    msg.opacity = 255;

    let monitor = Main.layoutManager.primaryMonitor;

    msg.set_position(Math.floor(monitor.width / 2 - msg.width / 2),
                      Math.floor(monitor.height / 2 - msg.height / 2));

    Tweener.addTween(msg,
                     { opacity: 0,
                       time: 2,
                       transition: 'easeOutQuad',
                       onComplete: _hideHello });
}

function init() {
    pulse_on = true;
    button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });
    let icon = new St.Icon({ icon_name: 'audio-card',
                             icon_type: St.IconType.SYMBOLIC,
                             style_class: 'system-status-icon' });

    button.set_child(icon);
    button.connect('button-press-event', _showHello);
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}
