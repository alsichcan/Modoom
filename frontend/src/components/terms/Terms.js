import React from 'react';
import {Row, Col} from 'reactstrap';

const terms = "<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"/><title>모둠 서비스 이용약관</title><style>\n" +
    "/* webkit printing magic: print all background colors */\n" +
    "html {\n" +
    "\t-webkit-print-color-adjust: exact;\n" +
    "}\n" +
    "* {\n" +
    "\tbox-sizing: border-box;\n" +
    "\t-webkit-print-color-adjust: exact;\n" +
    "}\n" +
    "\n" +
    "html,\n" +
    "body {\n" +
    "\tmargin: 0;\n" +
    "\tpadding: 0;\n" +
    "}\n" +
    "@media only screen {\n" +
    "\tbody {\n" +
    "\t\tmargin: 2em auto;\n" +
    "\t\tmax-width: 900px;\n" +
    "\t\tcolor: rgb(55, 53, 47);\n" +
    "\t}\n" +
    "}\n" +
    "\n" +
    "body {\n" +
    "\tline-height: 1.5;\n" +
    "\twhite-space: pre-wrap;\n" +
    "}\n" +
    "\n" +
    "a,\n" +
    "a.visited {\n" +
    "\tcolor: inherit;\n" +
    "\ttext-decoration: underline;\n" +
    "}\n" +
    "\n" +
    ".pdf-relative-link-path {\n" +
    "\tfont-size: 80%;\n" +
    "\tcolor: #444;\n" +
    "}\n" +
    "\n" +
    "h1,\n" +
    "h2,\n" +
    "h3 {\n" +
    "\tletter-spacing: -0.01em;\n" +
    "\tline-height: 1.2;\n" +
    "\tfont-weight: 600;\n" +
    "\tmargin-bottom: 0;\n" +
    "}\n" +
    "\n" +
    ".page-title {\n" +
    "\tfont-size: 2.5rem;\n" +
    "\tfont-weight: 700;\n" +
    "\tmargin-top: 0;\n" +
    "\tmargin-bottom: 0.75em;\n" +
    "}\n" +
    "\n" +
    "h1 {\n" +
    "\tfont-size: 1.875rem;\n" +
    "\tmargin-top: 1.875rem;\n" +
    "}\n" +
    "\n" +
    "h2 {\n" +
    "\tfont-size: 1.5rem;\n" +
    "\tmargin-top: 1.5rem;\n" +
    "}\n" +
    "\n" +
    "h3 {\n" +
    "\tfont-size: 1.25rem;\n" +
    "\tmargin-top: 1.25rem;\n" +
    "}\n" +
    "\n" +
    ".source {\n" +
    "\tborder: 1px solid #ddd;\n" +
    "\tborder-radius: 3px;\n" +
    "\tpadding: 1.5em;\n" +
    "\tword-break: break-all;\n" +
    "}\n" +
    "\n" +
    ".callout {\n" +
    "\tborder-radius: 3px;\n" +
    "\tpadding: 1rem;\n" +
    "}\n" +
    "\n" +
    "figure {\n" +
    "\tmargin: 1.25em 0;\n" +
    "\tpage-break-inside: avoid;\n" +
    "}\n" +
    "\n" +
    "figcaption {\n" +
    "\topacity: 0.5;\n" +
    "\tfont-size: 85%;\n" +
    "\tmargin-top: 0.5em;\n" +
    "}\n" +
    "\n" +
    "mark {\n" +
    "\tbackground-color: transparent;\n" +
    "}\n" +
    "\n" +
    ".indented {\n" +
    "\tpadding-left: 1.5em;\n" +
    "}\n" +
    "\n" +
    "hr {\n" +
    "\tbackground: transparent;\n" +
    "\tdisplay: block;\n" +
    "\twidth: 100%;\n" +
    "\theight: 1px;\n" +
    "\tvisibility: visible;\n" +
    "\tborder: none;\n" +
    "\tborder-bottom: 1px solid rgba(55, 53, 47, 0.09);\n" +
    "}\n" +
    "\n" +
    "img {\n" +
    "\tmax-width: 100%;\n" +
    "}\n" +
    "\n" +
    "@media only print {\n" +
    "\timg {\n" +
    "\t\tmax-height: 100vh;\n" +
    "\t\tobject-fit: contain;\n" +
    "\t}\n" +
    "}\n" +
    "\n" +
    "@page {\n" +
    "\tmargin: 1in;\n" +
    "}\n" +
    "\n" +
    ".collection-content {\n" +
    "\tfont-size: 0.875rem;\n" +
    "}\n" +
    "\n" +
    ".column-list {\n" +
    "\tdisplay: flex;\n" +
    "\tjustify-content: space-between;\n" +
    "}\n" +
    "\n" +
    ".column {\n" +
    "\tpadding: 0 1em;\n" +
    "}\n" +
    "\n" +
    ".column:first-child {\n" +
    "\tpadding-left: 0;\n" +
    "}\n" +
    "\n" +
    ".column:last-child {\n" +
    "\tpadding-right: 0;\n" +
    "}\n" +
    "\n" +
    ".table_of_contents-item {\n" +
    "\tdisplay: block;\n" +
    "\tfont-size: 0.875rem;\n" +
    "\tline-height: 1.3;\n" +
    "\tpadding: 0.125rem;\n" +
    "}\n" +
    "\n" +
    ".table_of_contents-indent-1 {\n" +
    "\tmargin-left: 1.5rem;\n" +
    "}\n" +
    "\n" +
    ".table_of_contents-indent-2 {\n" +
    "\tmargin-left: 3rem;\n" +
    "}\n" +
    "\n" +
    ".table_of_contents-indent-3 {\n" +
    "\tmargin-left: 4.5rem;\n" +
    "}\n" +
    "\n" +
    ".table_of_contents-link {\n" +
    "\ttext-decoration: none;\n" +
    "\topacity: 0.7;\n" +
    "\tborder-bottom: 1px solid rgba(55, 53, 47, 0.18);\n" +
    "}\n" +
    "\n" +
    "table,\n" +
    "th,\n" +
    "td {\n" +
    "\tborder: 1px solid rgba(55, 53, 47, 0.09);\n" +
    "\tborder-collapse: collapse;\n" +
    "}\n" +
    "\n" +
    "table {\n" +
    "\tborder-left: none;\n" +
    "\tborder-right: none;\n" +
    "}\n" +
    "\n" +
    "th,\n" +
    "td {\n" +
    "\tfont-weight: normal;\n" +
    "\tpadding: 0.25em 0.5em;\n" +
    "\tline-height: 1.5;\n" +
    "\tmin-height: 1.5em;\n" +
    "\ttext-align: left;\n" +
    "}\n" +
    "\n" +
    "th {\n" +
    "\tcolor: rgba(55, 53, 47, 0.6);\n" +
    "}\n" +
    "\n" +
    "ol,\n" +
    "ul {\n" +
    "\tmargin: 0;\n" +
    "\tmargin-block-start: 0.6em;\n" +
    "\tmargin-block-end: 0.6em;\n" +
    "}\n" +
    "\n" +
    "li > ol:first-child,\n" +
    "li > ul:first-child {\n" +
    "\tmargin-block-start: 0.6em;\n" +
    "}\n" +
    "\n" +
    "ul > li {\n" +
    "\tlist-style: disc;\n" +
    "}\n" +
    "\n" +
    "ul.to-do-list {\n" +
    "\ttext-indent: -1.7em;\n" +
    "}\n" +
    "\n" +
    "ul.to-do-list > li {\n" +
    "\tlist-style: none;\n" +
    "}\n" +
    "\n" +
    ".to-do-children-checked {\n" +
    "\ttext-decoration: line-through;\n" +
    "\topacity: 0.375;\n" +
    "}\n" +
    "\n" +
    "ul.toggle > li {\n" +
    "\tlist-style: none;\n" +
    "}\n" +
    "\n" +
    "ul {\n" +
    "\tpadding-inline-start: 1.7em;\n" +
    "}\n" +
    "\n" +
    "ul > li {\n" +
    "\tpadding-left: 0.1em;\n" +
    "}\n" +
    "\n" +
    "ol {\n" +
    "\tpadding-inline-start: 1.6em;\n" +
    "}\n" +
    "\n" +
    "ol > li {\n" +
    "\tpadding-left: 0.2em;\n" +
    "}\n" +
    "\n" +
    ".mono ol {\n" +
    "\tpadding-inline-start: 2em;\n" +
    "}\n" +
    "\n" +
    ".mono ol > li {\n" +
    "\ttext-indent: -0.4em;\n" +
    "}\n" +
    "\n" +
    ".toggle {\n" +
    "\tpadding-inline-start: 0em;\n" +
    "\tlist-style-type: none;\n" +
    "}\n" +
    "\n" +
    "/* Indent toggle children */\n" +
    ".toggle > li > details {\n" +
    "\tpadding-left: 1.7em;\n" +
    "}\n" +
    "\n" +
    ".toggle > li > details > summary {\n" +
    "\tmargin-left: -1.1em;\n" +
    "}\n" +
    "\n" +
    ".selected-value {\n" +
    "\tdisplay: inline-block;\n" +
    "\tpadding: 0 0.5em;\n" +
    "\tbackground: rgba(206, 205, 202, 0.5);\n" +
    "\tborder-radius: 3px;\n" +
    "\tmargin-right: 0.5em;\n" +
    "\tmargin-top: 0.3em;\n" +
    "\tmargin-bottom: 0.3em;\n" +
    "\twhite-space: nowrap;\n" +
    "}\n" +
    "\n" +
    ".collection-title {\n" +
    "\tdisplay: inline-block;\n" +
    "\tmargin-right: 1em;\n" +
    "}\n" +
    "\n" +
    "time {\n" +
    "\topacity: 0.5;\n" +
    "}\n" +
    "\n" +
    ".icon {\n" +
    "\tdisplay: inline-block;\n" +
    "\tmax-width: 1.2em;\n" +
    "\tmax-height: 1.2em;\n" +
    "\ttext-decoration: none;\n" +
    "\tvertical-align: text-bottom;\n" +
    "\tmargin-right: 0.5em;\n" +
    "}\n" +
    "\n" +
    "img.icon {\n" +
    "\tborder-radius: 3px;\n" +
    "}\n" +
    "\n" +
    ".user-icon {\n" +
    "\twidth: 1.5em;\n" +
    "\theight: 1.5em;\n" +
    "\tborder-radius: 100%;\n" +
    "\tmargin-right: 0.5rem;\n" +
    "}\n" +
    "\n" +
    ".user-icon-inner {\n" +
    "\tfont-size: 0.8em;\n" +
    "}\n" +
    "\n" +
    ".text-icon {\n" +
    "\tborder: 1px solid #000;\n" +
    "\ttext-align: center;\n" +
    "}\n" +
    "\n" +
    ".page-cover-image {\n" +
    "\tdisplay: block;\n" +
    "\tobject-fit: cover;\n" +
    "\twidth: 100%;\n" +
    "\theight: 30vh;\n" +
    "}\n" +
    "\n" +
    ".page-header-icon {\n" +
    "\tfont-size: 3rem;\n" +
    "\tmargin-bottom: 1rem;\n" +
    "}\n" +
    "\n" +
    ".page-header-icon-with-cover {\n" +
    "\tmargin-top: -0.72em;\n" +
    "\tmargin-left: 0.07em;\n" +
    "}\n" +
    "\n" +
    ".page-header-icon img {\n" +
    "\tborder-radius: 3px;\n" +
    "}\n" +
    "\n" +
    ".link-to-page {\n" +
    "\tmargin: 1em 0;\n" +
    "\tpadding: 0;\n" +
    "\tborder: none;\n" +
    "\tfont-weight: 500;\n" +
    "}\n" +
    "\n" +
    "p > .user {\n" +
    "\topacity: 0.5;\n" +
    "}\n" +
    "\n" +
    "td > .user,\n" +
    "td > time {\n" +
    "\twhite-space: nowrap;\n" +
    "}\n" +
    "\n" +
    "input[type=\"checkbox\"] {\n" +
    "\ttransform: scale(1.5);\n" +
    "\tmargin-right: 0.6em;\n" +
    "\tvertical-align: middle;\n" +
    "}\n" +
    "\n" +
    "p {\n" +
    "\tmargin-top: 0.5em;\n" +
    "\tmargin-bottom: 0.5em;\n" +
    "}\n" +
    "\n" +
    ".image {\n" +
    "\tborder: none;\n" +
    "\tmargin: 1.5em 0;\n" +
    "\tpadding: 0;\n" +
    "\tborder-radius: 0;\n" +
    "\ttext-align: center;\n" +
    "}\n" +
    "\n" +
    ".code,\n" +
    "code {\n" +
    "\tbackground: rgba(135, 131, 120, 0.15);\n" +
    "\tborder-radius: 3px;\n" +
    "\tpadding: 0.2em 0.4em;\n" +
    "\tborder-radius: 3px;\n" +
    "\tfont-size: 85%;\n" +
    "\ttab-size: 2;\n" +
    "}\n" +
    "\n" +
    "code {\n" +
    "\tcolor: #eb5757;\n" +
    "}\n" +
    "\n" +
    ".code {\n" +
    "\tpadding: 1.5em 1em;\n" +
    "}\n" +
    "\n" +
    ".code-wrap {\n" +
    "\twhite-space: pre-wrap;\n" +
    "\tword-break: break-all;\n" +
    "}\n" +
    "\n" +
    ".code > code {\n" +
    "\tbackground: none;\n" +
    "\tpadding: 0;\n" +
    "\tfont-size: 100%;\n" +
    "\tcolor: inherit;\n" +
    "}\n" +
    "\n" +
    "blockquote {\n" +
    "\tfont-size: 1.25em;\n" +
    "\tmargin: 1em 0;\n" +
    "\tpadding-left: 1em;\n" +
    "\tborder-left: 3px solid rgb(55, 53, 47);\n" +
    "}\n" +
    "\n" +
    ".bookmark {\n" +
    "\ttext-decoration: none;\n" +
    "\tmax-height: 8em;\n" +
    "\tpadding: 0;\n" +
    "\tdisplay: flex;\n" +
    "\twidth: 100%;\n" +
    "\talign-items: stretch;\n" +
    "}\n" +
    "\n" +
    ".bookmark-title {\n" +
    "\tfont-size: 0.85em;\n" +
    "\toverflow: hidden;\n" +
    "\ttext-overflow: ellipsis;\n" +
    "\theight: 1.75em;\n" +
    "\twhite-space: nowrap;\n" +
    "}\n" +
    "\n" +
    ".bookmark-text {\n" +
    "\tdisplay: flex;\n" +
    "\tflex-direction: column;\n" +
    "}\n" +
    "\n" +
    ".bookmark-info {\n" +
    "\tflex: 4 1 180px;\n" +
    "\tpadding: 12px 14px 14px;\n" +
    "\tdisplay: flex;\n" +
    "\tflex-direction: column;\n" +
    "\tjustify-content: space-between;\n" +
    "}\n" +
    "\n" +
    ".bookmark-image {\n" +
    "\twidth: 33%;\n" +
    "\tflex: 1 1 180px;\n" +
    "\tdisplay: block;\n" +
    "\tposition: relative;\n" +
    "\tobject-fit: cover;\n" +
    "\tborder-radius: 1px;\n" +
    "}\n" +
    "\n" +
    ".bookmark-description {\n" +
    "\tcolor: rgba(55, 53, 47, 0.6);\n" +
    "\tfont-size: 0.75em;\n" +
    "\toverflow: hidden;\n" +
    "\tmax-height: 4.5em;\n" +
    "\tword-break: break-word;\n" +
    "}\n" +
    "\n" +
    ".bookmark-href {\n" +
    "\tfont-size: 0.75em;\n" +
    "\tmargin-top: 0.25em;\n" +
    "}\n" +
    "\n" +
    ".sans { font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, \"Apple Color Emoji\", Arial, sans-serif, \"Segoe UI Emoji\", \"Segoe UI Symbol\"; }\n" +
    ".code { font-family: \"SFMono-Regular\", Consolas, \"Liberation Mono\", Menlo, Courier, monospace; }\n" +
    ".serif { font-family: Lyon-Text, Georgia, YuMincho, \"Yu Mincho\", \"Hiragino Mincho ProN\", \"Hiragino Mincho Pro\", \"Songti TC\", \"Songti SC\", \"SimSun\", \"Nanum Myeongjo\", NanumMyeongjo, Batang, serif; }\n" +
    ".mono { font-family: iawriter-mono, Nitti, Menlo, Courier, monospace; }\n" +
    ".pdf .sans { font-family: Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, \"Apple Color Emoji\", Arial, sans-serif, \"Segoe UI Emoji\", \"Segoe UI Symbol\", 'Twemoji', 'Noto Color Emoji', 'Noto Sans CJK SC', 'Noto Sans CJK KR'; }\n" +
    "\n" +
    ".pdf .code { font-family: Source Code Pro, \"SFMono-Regular\", Consolas, \"Liberation Mono\", Menlo, Courier, monospace, 'Twemoji', 'Noto Color Emoji', 'Noto Sans Mono CJK SC', 'Noto Sans Mono CJK KR'; }\n" +
    "\n" +
    ".pdf .serif { font-family: PT Serif, Lyon-Text, Georgia, YuMincho, \"Yu Mincho\", \"Hiragino Mincho ProN\", \"Hiragino Mincho Pro\", \"Songti TC\", \"Songti SC\", \"SimSun\", \"Nanum Myeongjo\", NanumMyeongjo, Batang, serif, 'Twemoji', 'Noto Color Emoji', 'Noto Sans CJK SC', 'Noto Sans CJK KR'; }\n" +
    "\n" +
    ".pdf .mono { font-family: PT Mono, iawriter-mono, Nitti, Menlo, Courier, monospace, 'Twemoji', 'Noto Color Emoji', 'Noto Sans Mono CJK SC', 'Noto Sans Mono CJK KR'; }\n" +
    "\n" +
    ".highlight-default {\n" +
    "}\n" +
    ".highlight-gray {\n" +
    "\tcolor: rgb(155,154,151);\n" +
    "}\n" +
    ".highlight-brown {\n" +
    "\tcolor: rgb(100,71,58);\n" +
    "}\n" +
    ".highlight-orange {\n" +
    "\tcolor: rgb(217,115,13);\n" +
    "}\n" +
    ".highlight-yellow {\n" +
    "\tcolor: rgb(223,171,1);\n" +
    "}\n" +
    ".highlight-teal {\n" +
    "\tcolor: rgb(15,123,108);\n" +
    "}\n" +
    ".highlight-blue {\n" +
    "\tcolor: rgb(11,110,153);\n" +
    "}\n" +
    ".highlight-purple {\n" +
    "\tcolor: rgb(105,64,165);\n" +
    "}\n" +
    ".highlight-pink {\n" +
    "\tcolor: rgb(173,26,114);\n" +
    "}\n" +
    ".highlight-red {\n" +
    "\tcolor: rgb(224,62,62);\n" +
    "}\n" +
    ".highlight-gray_background {\n" +
    "\tbackground: rgb(235,236,237);\n" +
    "}\n" +
    ".highlight-brown_background {\n" +
    "\tbackground: rgb(233,229,227);\n" +
    "}\n" +
    ".highlight-orange_background {\n" +
    "\tbackground: rgb(250,235,221);\n" +
    "}\n" +
    ".highlight-yellow_background {\n" +
    "\tbackground: rgb(251,243,219);\n" +
    "}\n" +
    ".highlight-teal_background {\n" +
    "\tbackground: rgb(221,237,234);\n" +
    "}\n" +
    ".highlight-blue_background {\n" +
    "\tbackground: rgb(221,235,241);\n" +
    "}\n" +
    ".highlight-purple_background {\n" +
    "\tbackground: rgb(234,228,242);\n" +
    "}\n" +
    ".highlight-pink_background {\n" +
    "\tbackground: rgb(244,223,235);\n" +
    "}\n" +
    ".highlight-red_background {\n" +
    "\tbackground: rgb(251,228,228);\n" +
    "}\n" +
    ".block-color-default {\n" +
    "\tcolor: inherit;\n" +
    "\tfill: inherit;\n" +
    "}\n" +
    ".block-color-gray {\n" +
    "\tcolor: rgba(55, 53, 47, 0.6);\n" +
    "\tfill: rgba(55, 53, 47, 0.6);\n" +
    "}\n" +
    ".block-color-brown {\n" +
    "\tcolor: rgb(100,71,58);\n" +
    "\tfill: rgb(100,71,58);\n" +
    "}\n" +
    ".block-color-orange {\n" +
    "\tcolor: rgb(217,115,13);\n" +
    "\tfill: rgb(217,115,13);\n" +
    "}\n" +
    ".block-color-yellow {\n" +
    "\tcolor: rgb(223,171,1);\n" +
    "\tfill: rgb(223,171,1);\n" +
    "}\n" +
    ".block-color-teal {\n" +
    "\tcolor: rgb(15,123,108);\n" +
    "\tfill: rgb(15,123,108);\n" +
    "}\n" +
    ".block-color-blue {\n" +
    "\tcolor: rgb(11,110,153);\n" +
    "\tfill: rgb(11,110,153);\n" +
    "}\n" +
    ".block-color-purple {\n" +
    "\tcolor: rgb(105,64,165);\n" +
    "\tfill: rgb(105,64,165);\n" +
    "}\n" +
    ".block-color-pink {\n" +
    "\tcolor: rgb(173,26,114);\n" +
    "\tfill: rgb(173,26,114);\n" +
    "}\n" +
    ".block-color-red {\n" +
    "\tcolor: rgb(224,62,62);\n" +
    "\tfill: rgb(224,62,62);\n" +
    "}\n" +
    ".block-color-gray_background {\n" +
    "\tbackground: rgb(235,236,237);\n" +
    "}\n" +
    ".block-color-brown_background {\n" +
    "\tbackground: rgb(233,229,227);\n" +
    "}\n" +
    ".block-color-orange_background {\n" +
    "\tbackground: rgb(250,235,221);\n" +
    "}\n" +
    ".block-color-yellow_background {\n" +
    "\tbackground: rgb(251,243,219);\n" +
    "}\n" +
    ".block-color-teal_background {\n" +
    "\tbackground: rgb(221,237,234);\n" +
    "}\n" +
    ".block-color-blue_background {\n" +
    "\tbackground: rgb(221,235,241);\n" +
    "}\n" +
    ".block-color-purple_background {\n" +
    "\tbackground: rgb(234,228,242);\n" +
    "}\n" +
    ".block-color-pink_background {\n" +
    "\tbackground: rgb(244,223,235);\n" +
    "}\n" +
    ".block-color-red_background {\n" +
    "\tbackground: rgb(251,228,228);\n" +
    "}\n" +
    ".select-value-color-default { background-color: rgba(206,205,202,0.5); }\n" +
    ".select-value-color-gray { background-color: rgba(155,154,151, 0.4); }\n" +
    ".select-value-color-brown { background-color: rgba(140,46,0,0.2); }\n" +
    ".select-value-color-orange { background-color: rgba(245,93,0,0.2); }\n" +
    ".select-value-color-yellow { background-color: rgba(233,168,0,0.2); }\n" +
    ".select-value-color-green { background-color: rgba(0,135,107,0.2); }\n" +
    ".select-value-color-blue { background-color: rgba(0,120,223,0.2); }\n" +
    ".select-value-color-purple { background-color: rgba(103,36,222,0.2); }\n" +
    ".select-value-color-pink { background-color: rgba(221,0,129,0.2); }\n" +
    ".select-value-color-red { background-color: rgba(255,0,26,0.2); }\n" +
    "\n" +
    ".checkbox {\n" +
    "\tdisplay: inline-flex;\n" +
    "\tvertical-align: text-bottom;\n" +
    "\twidth: 16;\n" +
    "\theight: 16;\n" +
    "\tbackground-size: 16px;\n" +
    "\tmargin-left: 2px;\n" +
    "\tmargin-right: 5px;\n" +
    "}\n" +
    "\n" +
    ".checkbox-on {\n" +
    "\tbackground-image: url(\"data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Crect%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22%2358A9D7%22%2F%3E%0A%3Cpath%20d%3D%22M6.71429%2012.2852L14%204.9995L12.7143%203.71436L6.71429%209.71378L3.28571%206.2831L2%207.57092L6.71429%2012.2852Z%22%20fill%3D%22white%22%2F%3E%0A%3C%2Fsvg%3E\");\n" +
    "}\n" +
    "\n" +
    ".checkbox-off {\n" +
    "\tbackground-image: url(\"data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Crect%20x%3D%220.75%22%20y%3D%220.75%22%20width%3D%2214.5%22%20height%3D%2214.5%22%20fill%3D%22white%22%20stroke%3D%22%2336352F%22%20stroke-width%3D%221.5%22%2F%3E%0A%3C%2Fsvg%3E\");\n" +
    "}\n" +
    "\t\n" +
    "</style></head><body><article id=\"b9ac13de-abc6-4be2-8c81-3af73ab31e44\" class=\"page sans\"><header><h1 class=\"page-title\">모둠 서비스 이용약관</h1></header><div class=\"page-body\"><p id=\"caed1342-163f-41e8-80f2-a2031db5ae98\" class=\"\">본 서비스 이용약관은 귀하(이하 “귀하” 또는 “사용자”라 합니다)가 모둠(이하 &quot;회사&quot;라 합니다)가 제공하는 관심사 기반 네트워크 서비스 “모둠” 및 그 후속 버전의 서비스(이하 통칭하여 “본 서비스”라 합니다)를 사용하는 데에 적용됩니다. 본 서비스를 사용하기 전에 본 서비스 이용약관(이하 “본 약관”이라 합니다)을 주의 깊게 읽어주시기 바랍니다. 귀하가 본 서비스에 접근하여 사용하는 경우, 귀하는 본 약관의 모든 내용에 동의하는 것으로 간주됩니다. 본 약관에 동의하지 않는 경우, 본 서비스의 이용을 중지하기 바랍니다.</p><p id=\"b0cc0e19-dcdc-4e47-bf70-7a5ae789b342\" class=\"\">\n" +
    "</p><p id=\"3ab25b43-eb2d-4db9-8a8c-da54f6b4840c\" class=\"\"><strong>계정</strong></p><p id=\"84026cbe-7b06-4723-a791-a219f9ece358\" class=\"\">사용자는 이메일 인증 과정을 거쳐 계정을 생성하실 수 있습니다. 아래의 경우에는 계정 생성을 승인하지 않을 수 있습니다.</p><ul id=\"d0b6cc88-ab9b-4fbb-8393-7658a07b07fe\" class=\"bulleted-list\"><li>다른 사람의 이메일을 이용하여 계정을 생성하려 한 경우</li></ul><ul id=\"d782ffeb-50bb-465b-b2ea-0af63ce6aff0\" class=\"bulleted-list\"><li>동일인이 다수의 계정을 생성하려 한 경우</li></ul><ul id=\"72d9148a-fec4-4a48-ab49-778495f2ea4c\" class=\"bulleted-list\"><li>계정 생성시 필요한 정보를 입력하지 않거나 허위 정보를 입력한 경우</li></ul><ul id=\"b759e6bc-6498-40ca-a183-83c35a2cac1b\" class=\"bulleted-list\"><li>회사가 과거에 운영원칙 또는 법률 위반 등의 정당한 사유로 해당 계정을 삭제 또는 징계한 경우</li></ul><ul id=\"e5d68b50-ce3a-4534-be00-528cf5ce09fc\" class=\"bulleted-list\"><li>사기 정보 모음 사이트나 정부기관 사이트 등에서 거래 사기 및 스팸 신고 이력이 있는 이메일로 확인된 경우</li></ul><p id=\"6f832626-b528-4f79-a559-6c3f9b08484c\" class=\"\">계정은 본인만 이용할 수 있고, 다른 사람에게 이용을 허락하거나 양도할 수 없습니다. 사용자는 계정과 관련된 정보, 즉 프로필 사진이나 별명 등을 수정할 수 있습니다. 단, 실명 정보는 최대 1회만 수정할 수 있습니다. 이메일이 바뀐 경우에는 본 서비스 내 설정 메뉴나 고객센터 문의를 통해 새 이메일 인증절차를 걸쳐 수정할 수 있습니다.</p><p id=\"b32b0267-d362-49af-b5fa-a9bf3e30a5ad\" class=\"\">\n" +
    "</p><p id=\"e95ec0ed-a740-4bab-bb6a-013289429c23\" class=\"\"><strong>서비스 사용</strong></p><p id=\"a33f41bc-bf29-43f0-ab0c-7a6148002574\" class=\"\">회사는 사용자가 아래와 같이 잘못된 방법이나 행위로 본 서비스를 이용할 경우 사용에 대한 제재(이용정지, 강제탈퇴 등)를 가할 수 있습니다.</p><ul id=\"d4e50d71-7fd2-4a8e-8120-856684388c00\" class=\"bulleted-list\"><li>실명 정보(이름, 성)를 고의로 허위 기재한 경우</li></ul><ul id=\"58445fc1-1234-4e23-8efe-2cbfbda8cd05\" class=\"bulleted-list\"><li>잘못된 방법으로 본 서비스의 제공을 방해하거나 회사가 안내하는 방법 이외의 다른 방법을 사용하여 본 서비스에 접근하는 행위</li></ul><ul id=\"f8f6fcf6-a5fb-4bcf-b965-7946ad52ee1d\" class=\"bulleted-list\"><li>다른 사용자의 정보를 무단으로 수집, 이용하거나 다른 사람들에게 제공하는 행위</li></ul><ul id=\"51b59f06-9f86-4d53-bfa9-4a124cf556cd\" class=\"bulleted-list\"><li>본 서비스를 영리나 홍보 목적으로 이용하는 행위</li></ul><ul id=\"34e52e87-50b8-443b-9378-974039c78686\" class=\"bulleted-list\"><li>음란 정보나 저작권 침해 정보 등 공서양속 및 법령에 위반되는 내용의 정보 등을 발송하거나 게시하는 행위</li></ul><ul id=\"c38af573-efc4-4b8d-a81e-ef22df660a9e\" class=\"bulleted-list\"><li>회사의 동의 없이 본 서비스 또는 이에 포함된 소프트웨어의 일부를 복사, 수정, 배포, 판매, 양도, 대여, 담보제공하거나 타인에게 그 이용을 허락하는 행위</li></ul><ul id=\"87d6a8a1-e89f-447d-9641-9cfb5cb3cb82\" class=\"bulleted-list\"><li>소프트웨어를 역설계하거나 소스 코드의 추출을 시도하는 등 본 서비스를 복제, 분해 또는 모방하거나 기타 변형하는 행위</li></ul><ul id=\"3e1f9a5f-50fd-414e-bb83-1f4c8e35eb7c\" class=\"bulleted-list\"><li>관련 법령, 회사의 모든 약관 또는 정책을 준수하지 않는 행위</li></ul><p id=\"e291c106-1a84-434a-b4bb-fd333853da90\" class=\"\">\n" +
    "</p><p id=\"d144479e-5b8f-4c53-bfa9-e7f563861f51\" class=\"\"><strong>개인정보 보호</strong></p><p id=\"d5c5ceb9-cc5c-41b8-aea4-d87bf1c99eae\" class=\"\">개인정보는 본 서비스의 원활한 제공을 위하여 사용자가 동의한 목적과 범위 내에서만 이용됩니다. 개인정보 보호 관련 기타 상세한 사항은 개인정보처리방침을 참고하시기 바랍니다.</p><p id=\"9e83fe69-fc1e-46bb-8304-34bd66a5bdc2\" class=\"\">\n" +
    "</p><p id=\"24b56b48-f7f7-437a-bf0e-39238300e0b5\" class=\"\"><strong>게시물의 저작권 보호</strong></p><p id=\"cf1f8f94-045d-421b-b29b-d72a825ca79e\" class=\"\">본본 서비스 사용자가 본 서비스 내에 게시한 게시물의 저작권은 해당 게시물의 저작자에게 귀속됩니다.</p><p id=\"a0c39477-7896-4c7e-9a63-8fe3be6ee797\" class=\"\">사용자가 본 서비스 내에 게시하는 게시물은 검색결과 내지 본 서비스 및 관련 프로모션, 광고 등에 노출될 수 있으며, 해당 노출을 위해 필요한 범위 내에서는 일부 수정, 복제, 편집되어 게시될 수 있습니다. 이 경우, 회사는 저작권법 규정을 준수하며, 사용자는 언제든지 고객센터 또는 운영자 문의 기능을 통해 해당 게시물에 대해 삭제, 검색결과 제외, 비공개 등의 조치를 요청할 수 있습니다.</p><p id=\"99c25db5-a107-43e8-ac4a-b06710ad68d8\" class=\"\">위 2항 이외의 방법으로 사용자의 게시물을 이용하고자 하는 경우에는 전화, 팩스, 전자우편 등을 통해 사전에 사용자의 동의를 얻어야 합니다.</p><p id=\"a4ceb7c7-f2b8-412f-be66-d7c8f799b424\" class=\"\">\n" +
    "</p><p id=\"3bacdd48-d514-4c26-b0b5-a6c8cbb0bde2\" class=\"\"><strong>게시물의 관리</strong></p><p id=\"f2ebeae8-6140-42a6-a504-13b37bbb161b\" class=\"\">사용자의 게시물이 &quot;정보통신망법&quot; 및 &quot;저작권법&quot;등 관련법에 위반되는 내용을 포함하는 경우, 권리자는 관련법이 정한 절차에 따라 해당 게시물의 게시중단 및 삭제 등을 요청할 수 있으며, 회사는 관련법에 따라 조치를 취하여야 합니다.</p><p id=\"53fbb190-abe4-4fee-9ce9-057f70ed1041\" class=\"\">회사는 전항에 따른 권리자의 요청이 없는 경우라도 권리침해가 인정될 만한 사유가 있거나 기타 회사 정책 및 관련법에 위반되는 경우에는 관련법에 따라 해당 게시물에 대해 임시조치(삭제, 노출제한, 게시중단) 등을 취할 수 있습니다.</p><p id=\"ba4e0069-8554-462a-a79d-b496293831f8\" class=\"\">\n" +
    "</p><p id=\"af66cfed-0375-4e42-b89a-c5f2f46bffab\" class=\"\"><strong>사용권리</strong></p><p id=\"0b7516fd-27bb-4fca-b69d-b87577540952\" class=\"\">회사는 본 서비스 이용을 위하여 양도불가능하고 무상의 라이선스를 사용자분들에게 제공합니다. 다만,회사 상표 및 로고를 사용할 권리를 사용자분들에게 부여하는 것은 아닙니다.</p><p id=\"f3d979e8-b2bb-4512-b9f6-c4d00c761377\" class=\"\">\n" +
    "</p><p id=\"54686f30-d130-4549-bf6e-f64b1643178e\" class=\"\"><strong>서비스 고지 및 홍보내용 표시</strong></p><p id=\"51b4da15-dbbb-4b04-9d14-79dcc14a7a1f\" class=\"\">회사는 본 서비스 사용자분의 편의를 위해 본 서비스 이용과 관련된 각종 고지 및 기타 회사 본 서비스 홍보를 포함한 다양한 정보를 회사 본 서비스에 표시하거나 사용자의 휴대폰 문자로 발송할 수 있습니다.</p><p id=\"9a59fbf9-7a67-476b-8642-7ed319ba00ed\" class=\"\">\n" +
    "</p><p id=\"17c30399-0c63-42c6-9e32-1bfbffff2826\" class=\"\"><strong>서비스 중단</strong></p><p id=\"25ae62a2-ec7c-4cc7-b315-cf699fb10283\" class=\"\">회사는 장비의 유지∙보수를 위한 정기 또는 임시 점검 또는 다른 상당한 이유로 본 서비스의 제공이 일시 중단할 수 있으며, 이때에는 미리 본 서비스 제공화면에 공지하겠습니다. 만약, 회사가 예측할 수 없는 이유로 본 서비스가 중단된 때에는 회사가 상황을 파악하는 즉시 통지하겠습니다.</p><p id=\"c169a664-f8c7-4583-a0ea-fb969623802f\" class=\"\">\n" +
    "</p><p id=\"765e05d5-7167-4f9e-947e-b2c37a8377b5\" class=\"\"><strong>이용계약 해지 (탈퇴)</strong></p><p id=\"5e453434-810e-4bc8-9d53-f6734f02a89f\" class=\"\">사용자가 본 서비스의 이용을 더 이상 원치 않는 때에는 언제든지 본 서비스 내 제공되는 메뉴를 이용하여 본 서비스 이용계약의 해지 신청을 할 수 있으며, 회사는 법령이 정하는 바에 따라 신속히 처리하겠습니다. 이용계약이 해지되면 법령 및 개인정보처리방침에 따라 사용자 정보를 보유하는 경우를 제외하고는 모든 사용자 정보 사용자가 삭제됩니다. 다만, 사용자가 작성한 게시물은 다른 이용자의 원활한 이용을 위해 필요한 범위 내에서 본 서비스 내에 삭제되지 않고 남아 있게 됩니다.</p><p id=\"14214aaf-4653-4042-b846-72e7f66333a3\" class=\"\">\n" +
    "</p><p id=\"3239ef61-da8e-4e97-9e0c-3efb0a43636d\" class=\"\"><strong>책임제한</strong></p><p id=\"f8814540-1781-4632-9ebc-25948f5258af\" class=\"\">회사는 법령상 허용되는 한도 내에서 회사 본 서비스와 관련하여 본 약관에 명시되지 않은 어떠한 구체적인 사항에 대한 약정이나 보증을 하지 않습니다. 예를 들어, 회사는 회사 본 서비스에 속한 콘텐츠, 본 서비스의 특정 기능, 본 서비스의 이용가능성에 대하여 어떠한 약정이나 보증을 하는 것이 아니며, 본 서비스를 있는 그대로 제공할 뿐입니다.</p><p id=\"16ac3bbb-3b82-4041-91e3-31ee80002107\" class=\"\">\n" +
    "</p><p id=\"e26846fa-85ae-4b0e-8bbb-f0d76e71638e\" class=\"\"><strong>손해배상</strong></p><p id=\"3055a87a-142f-45b6-9cee-c6ac70eea147\" class=\"\">회사의 과실로 인하여 사용자가 손해를 입게 될 경우 회사는 법령에 따라 사용자의 손해를 배상하겠습니다. 다만, 회사는 본 서비스에 접속 또는 이용과정에서 발생하는 개인적인 손해, 제3자가 불법적으로 회사의 서버에 접속하거나 서버를 이용함으로써 발생하는 손해, 제3자가 회사 서버에 대한 전송 또는 회사 서버로부터의 전송을 방해함으로써 발생하는 손해, 제3자가 악성 프로그램을 전송 또는 유포함으로써 발생하는 손해, 전송된 데이터의 생략, 누락, 파괴 등으로 발생한 손해, 명예훼손 등 제3자가 회사 본 서비스를 이용하는 과정에서 사용자에게 발생시킨 손해에 대하여 책임을 부담하지 않습니다. 또한 회사는 법률상 허용되는 한도 내에서 간접 손해, 특별 손해, 결과적 손해, 징계적 손해, 및 징벌적 손해에 대한 책임을 부담하지 않습니다.</p><p id=\"72ac82d9-bcf3-449d-9449-6d31a0faccf9\" class=\"\">\n" +
    "</p><p id=\"776e151f-61a1-49bb-9c3d-02025f0ae97c\" class=\"\"><strong>약관수정</strong></p><p id=\"4f56455d-83cc-415c-8e65-193751edc7ae\" class=\"\">회사는 법률이나 회사 본 서비스의 변경사항을 반영하기 위한 목적 등으로 본 약관이나 고지사항을 수정할 수 있습니다. 본 약관이 변경되는 경우 회사는 변경 사항을 개별 회사 본 서비스 초기화면에 게시하며, 변경된 약관은 게시한 날로부터 7일 후부터 효력이 발생합니다.</p><p id=\"0eefc1d5-8321-4495-80ee-1a92f3850974\" class=\"\">회사는 변경된 약관을 게시한 날로부터 효력이 발생되는 날까지 약관변경에 대한 사용자의 의견을 기다리겠습니다. 위 기간이 지나도록 사용자의 의견이 회사에 접수되지 않으면, 사용자가 변경된 약관에 따라 본 서비스를 이용하는 데에 동의하는 것으로 보겠습니다. 사용자가 변경된 약관에 동의하지 않는 경우 변경된 약관의 적용을 받는 해당 본 서비스의 제공이 더 이상 불가능하게 됩니다.</p><p id=\"68443e57-350b-465e-9b8b-aebbee678594\" class=\"\">\n" +
    "</p><p id=\"ab75b0de-31b4-484f-93ea-fb7e917e2d41\" class=\"\"><strong>사용자 의견</strong></p><p id=\"587d936f-d7b0-4a71-84d1-c16790c8d51d\" class=\"\">사용자는 언제든지 본 서비스 내 운영자 문의란을 통해 의견을 개진할 수 있습니다. 회사는 채팅, 이메일등으로 사용자에게 여러 가지 소식을 알려드리며, 사용자 전체에 대한 통지는 회사 본 서비스 초기화면 또는 공지사항 란에 게시함으로써 효력이 발생합니다.</p><p id=\"f2224219-65d1-4012-85a0-a6deb2f4e11a\" class=\"\">\n" +
    "</p><p id=\"b8aa1404-c1b0-4548-819c-c07b54485334\" class=\"\">본 약관은 회사와 사용자와의 관계에 적용되며, 제3자의 수익권을 발생시키지 않습니다.</p><p id=\"221eef24-154a-46a0-a5c9-2de273e05184\" class=\"\">\n" +
    "</p><p id=\"ca884f93-3aec-4aa2-94bb-98c506606531\" class=\"\">사용자가 본 약관을 준수하지 않은 경우에, 회사가 즉시 조치를 취하지 않더라도 회사가 가지고 있는 권리를 포기하는 것이 아니며, 본 약관 중 일부 조항의 집행이 불가능하게 되더라도 다른 조항에는 영향을 미치지 않습니다.</p><p id=\"45a52816-98c1-4c78-b152-7280e43c1816\" class=\"\">\n" +
    "</p><p id=\"bc626bb4-b066-4140-9545-ec8f482661d7\" class=\"\">본 약관 또는 회사 본 서비스와 관련하여서는 대한민국의 법률이 적용됩니다.</p><p id=\"7a4d9644-7abf-49a0-9956-7fde6d4ab52a\" class=\"\">\n" +
    "</p><p id=\"7f34c047-e36c-4451-b2b0-d27d9ab780cf\" class=\"\">공고 일자 : 2021년 03월 01일 (최초 공고)</p><p id=\"efc501c2-ef94-4024-804f-b677717508b1\" class=\"\">시행 일자 : 2021년 03월 01일</p><p id=\"804b8684-0869-4946-bd6d-d10d69d9c4ab\" class=\"\">\n" +
    "</p></div></article></body></html>"

const Terms = () => {
    return (
        <div className='container' dangerouslySetInnerHTML={{__html: terms}}/>
    );
};

export default Terms;