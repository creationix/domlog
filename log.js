var domBuilder = require('dombuilder');

exports.toDom = toDom;
exports.container = undefined;
exports.setup = setup;
exports.log = log;
exports.css =
  ".log{background:#222;color:#ddd;font-family:monospace;padding:0}\n" +
  ".log .array:after{content:']'}\n" +
  ".log .array:before{content:'['}\n" +
  ".log .boolean{color:#f4a}\n" +
  ".log .function{color:#fb0}\n" +
  ".log .null{color:#aaa;font-weight:bold}\n" +
  ".log .number{color:#5cf}\n" +
  ".log .object .key:after{content:':';font-weight:bold}\n" +
  ".log .object:after{content:'}'}\n" +
  ".log .object:before{content:'{'}\n" +
  ".log .string{color:#4e2}\n" +
  ".log .string:after{content:'\\201D'}\n" +
  ".log .string:before{content:'\\201C'}\n" +
  ".log .string:before,.log .string:after{color:#5f3;font-weight:bold}\n" +
  ".log .text{color:#fff}\n" +
  ".log .undefined{color:#aaa}\n" +
  ".log > li{padding:5px}\n" +
  ".log > li *{display:inline-block;margin:0 3px;padding:0}\n";

function toDom(val) {
  if (val === null) {
    return ["span.null", "null"];
  }
  if (Array.isArray(val)) {
    return ["ul.array"].concat(
      val.map(function (item) {
        return ["li", toDom(item)];
      })
    );
  }
  var type = typeof val;
  if (type === "object") {
    return ["dl.object"].concat(
      Object.keys(val).map(function (key) {
        return [
          ["dt.key", key],
          ["dd", toDom(val[key])]
        ];
      })
    );
  }
  var title = "" + val;
  val = title.split("\n");
  if (val.length > 1) {
    val = val[0] + " ... " + val[val.length - 1];
  }
  else {
    val = val[0];
  }
  return ["span", {title: title, class: type}, document.createTextNode(val)];
}

function setup() {
  var style = document.createElement("style");
  style.textContent = exports.css;
  document.head.appendChild(style);
  exports.container = domBuilder(["ul.log"]);
  document.body.appendChild(exports.container);
}

function item(val) {
  if (typeof val === "string") return ["span.text", val];
  return toDom(val);
}

function log() {
  if (!exports.container) setup();
  exports.container.appendChild(domBuilder(["li"].concat(Array.prototype.map.call(arguments, item))));
}
