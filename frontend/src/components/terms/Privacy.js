import React from 'react';
import {Row, Col} from 'reactstrap';

const privacy = "<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"/><title>개인정보처리방침</title><style>\n" +
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
    "\n" +
    "</style></head><body><article id=\"e6417476-8553-4925-b241-8933c22c8b57\" class=\"page sans\"><header><h1 class=\"page-title\">개인정보처리방침</h1></header><div class=\"page-body\"><p id=\"21ac256a-f89b-4226-8c25-6722a34d736c\" class=\"\">&quot;모둠”(이하 “회사”)은 사용자의 개인정보를 매우 소중히 생각합니다. 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」, 「개인정보보호법」을 비롯한 개인정보 관련 법령을 준수하고 있습니다. 사용자께서 알려주신 개인정보는 수집, 이용 동의를 받은 범위 내에서 수집되며, 별도의 동의 없이는 결코 제 3 자에게 제공되지 않습니다. 또한 기본적 인권 침해의 우려가 있는 민감한 개인정보는 수집하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.</p><ul id=\"fc1d3b27-9812-44b6-bd98-e17b95665b2c\" class=\"bulleted-list\"><li>사용자가 사전에 동의한 경우(사용자가 사전에 동의한 경우란, 서비스 이용 등을 위하여 사용자 자발적으로 자신의 개인정보를 제3자에게 제공하는 것에 동의하는 것을 의미합니다.)</li></ul><ul id=\"63f98ab9-ce10-4b6b-a38d-a8c07daa5b3f\" class=\"bulleted-list\"><li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li></ul><p id=\"52b4f76f-65f7-44a3-ae21-4049ba1cb296\" class=\"\">이러한 경우에도, 회사는 사용자에게 (1) 개인정보를 제공받는 자 (2) 그의 이용목적 (3) 개인정보의 보유 및 이용기간을 사전에 고지하고 이에 대해 명시적·개별적으로 동의를 얻습니다. 이와 같은 모든 과정에 있어서 회사는 사용자의 의사에 반하여 추가적인 정보를 수집하거나, 동의의 범위를 벗어난 정보를 제3자와 공유하지 않습니다.</p><p id=\"bc473dcf-a657-4ac0-aba6-5ec49993913f\" class=\"\">\n" +
    "</p><p id=\"8341ace6-5a99-4a7b-8c4d-b978e7af7bb4\" class=\"\"><strong>개인정보 활용처</strong></p><p id=\"88105a63-9e65-4bde-b525-246fc6e1d767\" class=\"\">회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음 목적 이외의 용도로 이용되지 아니하며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p><ul id=\"b4212e74-e414-4d5a-9ad9-157441ea77fc\" class=\"bulleted-list\"><li>서비스 회원 가입 및 관리\n" +
    "회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별 및 인증, 회원자격 유지와 관리, 제한적 본인확인제 시행에 따른 본인확인, 서비스 부정이용 방지, 각종 고지 및 통지, 고충처리 등을 목적으로 개인정보를 처리합니다.</li></ul><ul id=\"e665ed2f-fb73-4cba-92b0-dcb841e4eb45\" class=\"bulleted-list\"><li>재화 또는 서비스 제공\n" +
    "서비스 제공, 콘텐츠 제공, 맞춤서비스 제공, 본인인증, 연령인증, 요금결제 및 정산, 포인트 적립 및 이용, 계약서 및 청구서 발송, 채권추심 등을 목적으로 개인정보를 처리합니다.</li></ul><ul id=\"9d4092cb-1131-45e2-9907-d88ce72f5733\" class=\"bulleted-list\"><li>마케팅 및 광고에의 활용\n" +
    "이벤트 및 광고성 정보 제공 및 참여기회 제공, 인구통계학적 특성에 따른 서비스 제공 및 광고 게재, 접속빈도 파악 또는 회원의 서비스 이용에 대한 통계 등을 목적으로 개인정보를 처리합니다.</li></ul><ul id=\"e4b4d470-661b-409c-b902-f751d98209ea\" class=\"bulleted-list\"><li>고충처리\n" +
    "민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락 및 통지, 처리결과 통보 등의 목적으로 개인정보를 처리합니다.</li></ul><p id=\"3e328402-0980-48af-b95b-d144be354f7b\" class=\"\">\n" +
    "</p><p id=\"40826aba-a9b2-4333-93bc-2b06df40ecdf\" class=\"\"><strong>수집하는 개인정보</strong></p><ul id=\"a81ace3f-dcc0-4979-9f9c-b1be58d61b1c\" class=\"bulleted-list\"><li>로그인 ID, 비밀번호 - 이메일</li></ul><ul id=\"7a7836d0-4382-41ef-841f-bff57325a0ff\" class=\"bulleted-list\"><li>이름</li></ul><ul id=\"fc395482-9ed1-4af3-8d9e-30abe1a32406\" class=\"bulleted-list\"><li>프로필 사진</li></ul><ul id=\"04a7b31b-db71-4d74-8f7c-92a4cff09737\" class=\"bulleted-list\"><li>사용자 이름(별명) - 앱 내 채팅 기능을 사용한 채팅 내용</li></ul><ul id=\"6c75fb5e-7dcd-4737-bb20-1cac00812f75\" class=\"bulleted-list\"><li>IP 주소, 쿠키, MAC 주소, 서비스 이용기록, 방문기록, 불량 이용기록 등 인터넷 이용 과정에서 자동 생성되는 정보</li></ul><p id=\"abb5dd98-5356-43a7-804c-5169b4eaf297\" class=\"\">\n" +
    "</p><p id=\"3c1fc1fb-b50d-4435-b9c5-3079d6446729\" class=\"\"><strong>개인정보를 수집하는 방법</strong></p><p id=\"bf676a84-b852-4544-ad6e-56728a2649c2\" class=\"\">회사는 다음과 같은 방법을 통해 개인정보를 수집합니다.</p><ul id=\"f56181bf-54cc-477b-82d5-6a776367eeb6\" class=\"bulleted-list\"><li>웹사이트를 통한 회원가입 및 회원정보수정 과정에서 사용자가 개인정보 수집에 대해 동의를 하고 직접 정보를 입력하는 경우</li></ul><ul id=\"6a71ca80-64da-48aa-b503-de22d33c25b9\" class=\"bulleted-list\"><li>운영자에 대한 직접 문의 및 요청</li></ul><ul id=\"0c6ee4c6-2ff3-458e-8fe2-7c635bc28be0\" class=\"bulleted-list\"><li>웹사이트 내에서의 채팅 기록</li></ul><ul id=\"f823bde9-67c4-448e-9a42-f0d5f1131480\" class=\"bulleted-list\"><li>인터넷 웹사이트 이용 과정에서 자동 생성 및 수집</li></ul><p id=\"2b9477ea-1917-47b4-a6b4-e10d4a591553\" class=\"\">\n" +
    "</p><p id=\"b1055960-dd66-48ac-bf8a-cee3433f59fd\" class=\"\"><strong>개인정보 보유기간</strong><strong>, </strong><strong>파기방법 및 이용기간</strong></p><p id=\"7ce5e7cd-2490-4129-b512-62ee14ba17c3\" class=\"\">사용자 개인정보는 사용자로부터 동의를 받은 수집 및 이용 적이 달성된 때에는 회사 내부 방침 또는 관계 법령에서 정한 일정한 기간 동안 보관한 다음 파기합니다. 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기하고, 전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다. 회사가 방침 또는 법령에 따라 보관하는 개인정보 및 해당 법령은 아래 표와 같습니다. 또한 아래 기준과 별개로 회사는 1년간 서비스를 이용하지 않은 회원의 개인정보를 별도로 분리 보관 또는 삭제하고 있으며, 분리 보관된 개인정보는 4년간 보관 후 지체없이 파기합니다.</p><p id=\"d968d973-b3b7-493a-870e-2e18f0e6dac9\" class=\"\">가. 회사 내부 방침에 의한 정보보유 사유</p><p id=\"ea36cb17-ffd2-4a99-b505-7ad90529ce72\" class=\"\">보존 항목: 부정 이용 기록</p><p id=\"e49f6172-34f1-4ab2-ba69-c587cede6353\" class=\"\">보존 이유: 부정 이용 방지</p><p id=\"27f113b0-db8e-4844-9682-e8f9a8676f1c\" class=\"\">보존 기간: 10년</p><p id=\"9ccaa255-9b0b-474e-9bc3-102b7424adc2\" class=\"\">보존 항목: 게시물(댓글 포함) 및 채팅 내용</p><p id=\"936c2fd0-2775-4103-ae6d-a15a43080b00\" class=\"\">보존 이유: 고충처리 및 분쟁 해결</p><p id=\"622a3615-ed40-407c-8d80-7c5ab2bde7de\" class=\"\">보존 기간: 5년</p><p id=\"49534e72-478c-4fab-9074-042ef7426e65\" class=\"\">나. 관련 법령에 의한 정보보유 사유</p><p id=\"99b09834-bb8b-477e-9fce-50455ab08836\" class=\"\">보존 항목: 서비스 방문기록</p><p id=\"50906f45-c58f-4731-8875-cfa848fe7275\" class=\"\">근거 법령: 통신비밀보호법</p><p id=\"7125c3d3-9d95-49bc-8c04-9b80b39752a1\" class=\"\">보존 기간: 3개월</p><p id=\"84fc156a-886f-4819-96b9-a18d6db2425f\" class=\"\">\n" +
    "</p><p id=\"2713c277-9928-4aa0-b098-695cae05734c\" class=\"\"><strong>개인정보 공유 및 제공</strong></p><p id=\"cba9762f-533c-4bff-9540-cc9ecf8ffcb8\" class=\"\">회사는 사용자가 서비스 이용과정 등에서 따로 동의하는 경우나 법령에 규정된 경우를 제외하고는 사용자 개인정보를 위에서 말씀드린 목적 범위를 초과하여 이용하거나 제3자에게 제공 또는 공유하지 않습니다.</p><p id=\"883df666-db62-4799-9fac-42ec8c90f479\" class=\"\">\n" +
    "</p><p id=\"671a3a58-6bfc-43b6-9ef6-05c0378b2371\" class=\"\"><strong>사용자 권리 보호</strong></p><p id=\"b8f8549a-7b40-4145-8bab-402c950f3c3d\" class=\"\">사용자(만 14세 미만인 경우 법정 대리인)는 언제든지 사용자 개인정보를 조회하거나 수정할 수 있으며 수집·이용에 대한 동의 철회 또는 가입 해지를 요청할 수도 있습니다. 보다 구체적으로는 서비스 내 설정 기능을 통한 변경, 가입 해지(동의 철회)를 위해서는 서비스 내 &quot;계정탈퇴&quot;를 클릭하면 되며, 운영자에게 이메일이나 별도 게시판으로 문의할 경우도 지체 없이 조치하겠습니다.</p><p id=\"541b8cfc-2532-4aec-ad03-60f663a41f39\" class=\"\">\n" +
    "</p><p id=\"a2d06369-f8de-425c-bc69-13ecda3e394d\" class=\"\"><strong>개인정보 문의처</strong></p><p id=\"27358afb-3ee2-4db7-acf9-99716fce61b4\" class=\"\">사용자가 서비스를 이용하면서 발생하는 모든 개인정보보호 관련 문의, 불만, 조언이나 기타 사항은 개인정보 보호책임자에게 연락해 주시기 바랍니다. 회사는 사용자 목소리에 귀 기울이고 신속하고 충분한 답변을 드릴 수 있도록 최선을 다하겠습니다.</p><p id=\"c7b7a4e0-d94c-44f2-aa02-2aee973526da\" class=\"\">\n" +
    "</p><p id=\"266fa85b-7d4f-4000-baaf-5ff608fe2bec\" class=\"\"><strong>개인정보 보호책임자</strong></p><p id=\"5b979ad9-6631-4114-9773-cada18343f43\" class=\"\">이름: 박지상</p><p id=\"ab84eb5a-f5ee-473e-ae47-3fb637c29209\" class=\"\">직위: 대표</p><p id=\"2eef2e03-95ab-4f03-9bee-8e32343d9652\" class=\"\">연락처: admin@modoom.us</p><p id=\"81421b12-4e95-40c1-98b2-82447092b8af\" class=\"\">\n" +
    "</p><p id=\"6f51fdfd-5c80-4bdc-a3c3-1ad13f56ee44\" class=\"\"><strong>고지의 의무</strong></p><p id=\"253675d9-82b5-4d2b-89ae-23e1930ec587\" class=\"\">회사는 법률이나 서비스의 변경사항을 반영하기 위한 목적 등으로 개인정보처리방침을 수정할 수 있습니다. 개인정보처리방침이 변경되는 경우 회사는 변경 사항을 게시하며, 변경된 개인정보처리방침은 게시한 날로부터 7일 후부터 효력이 발생합니다.</p><p id=\"d85ba62f-2fd4-498e-aa65-1b3e1af0247b\" class=\"\">\n" +
    "</p><p id=\"6b8181aa-20ef-4195-a169-963a0177f672\" class=\"\">공고일자: 2021년 3월 1일 (최초 공고)</p><p id=\"00e5234e-9992-4187-9432-f3c0aaa1f938\" class=\"\">시행일자: 2021년 3월 1일</p></div></article></body></html>"

const Privacy = () => {
    return (
        <div className='container' dangerouslySetInnerHTML={{__html: privacy}}/>
    );
};

export default Privacy;